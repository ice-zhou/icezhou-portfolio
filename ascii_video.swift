import AVFoundation
import CoreGraphics
import CoreImage
import CoreText
import Foundation

struct ASCIIStyle {
    let cellWidth = 8
    let cellHeight = 12
    let fontSize: CGFloat = 10
    let ramp = Array("@#S%?*+;:,")
    let backgroundCharacter: Character = ","
}

enum ConversionError: Error, CustomStringConvertible {
    case message(String)

    var description: String {
        switch self {
        case .message(let text): return text
        }
    }
}

func orientedSize(for track: AVAssetTrack) -> (width: Int, height: Int, transform: CGAffineTransform) {
    let naturalRect = CGRect(origin: .zero, size: track.naturalSize)
    let transformedRect = naturalRect.applying(track.preferredTransform)
    let width = Int(abs(transformedRect.width).rounded())
    let height = Int(abs(transformedRect.height).rounded())
    let shift = CGAffineTransform(
        translationX: -transformedRect.minX,
        y: -transformedRect.minY
    )
    return (width, height, track.preferredTransform.concatenating(shift))
}

func makePixelBuffer(width: Int, height: Int) throws -> CVPixelBuffer {
    var pixelBuffer: CVPixelBuffer?
    let attributes: [CFString: Any] = [
        kCVPixelBufferCGImageCompatibilityKey: true,
        kCVPixelBufferCGBitmapContextCompatibilityKey: true,
        kCVPixelBufferIOSurfacePropertiesKey: [:] as CFDictionary
    ]
    let status = CVPixelBufferCreate(
        kCFAllocatorDefault,
        width,
        height,
        kCVPixelFormatType_32BGRA,
        attributes as CFDictionary,
        &pixelBuffer
    )
    guard status == kCVReturnSuccess, let pixelBuffer else {
        throw ConversionError.message("Could not allocate a video frame.")
    }
    return pixelBuffer
}

func averageLuminance(
    bytes: UnsafeMutablePointer<UInt8>,
    bytesPerRow: Int,
    width: Int,
    height: Int,
    x0: Int,
    y0: Int,
    cellWidth: Int,
    cellHeight: Int
) -> CGFloat {
    let x1 = min(x0 + cellWidth, width)
    let y1 = min(y0 + cellHeight, height)
    let step = 2
    var sum = 0.0
    var count = 0

    var y = y0
    while y < y1 {
        var x = x0
        while x < x1 {
            let offset = y * bytesPerRow + x * 4
            let b = Double(bytes[offset])
            let g = Double(bytes[offset + 1])
            let r = Double(bytes[offset + 2])
            sum += 0.2126 * r + 0.7152 * g + 0.0722 * b
            count += 1
            x += step
        }
        y += step
    }

    return count == 0 ? 255 : CGFloat(sum / Double(count))
}

func drawASCIIFrame(
    source: CVPixelBuffer,
    destination: CVPixelBuffer,
    width: Int,
    height: Int,
    style: ASCIIStyle,
    font: CTFont
) throws {
    CVPixelBufferLockBaseAddress(source, .readOnly)
    CVPixelBufferLockBaseAddress(destination, [])
    defer {
        CVPixelBufferUnlockBaseAddress(destination, [])
        CVPixelBufferUnlockBaseAddress(source, .readOnly)
    }

    guard
        let sourceBase = CVPixelBufferGetBaseAddress(source),
        let destinationBase = CVPixelBufferGetBaseAddress(destination)
    else {
        throw ConversionError.message("Could not access video frame pixels.")
    }

    let sourceBytes = sourceBase.assumingMemoryBound(to: UInt8.self)
    let sourceRowBytes = CVPixelBufferGetBytesPerRow(source)
    let destinationRowBytes = CVPixelBufferGetBytesPerRow(destination)

    guard let context = CGContext(
        data: destinationBase,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: destinationRowBytes,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGBitmapInfo.byteOrder32Little.rawValue |
            CGImageAlphaInfo.premultipliedFirst.rawValue
    ) else {
        throw ConversionError.message("Could not create the ASCII drawing canvas.")
    }

    context.setFillColor(CGColor(gray: 1, alpha: 1))
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.textMatrix = .identity
    context.translateBy(x: 0, y: CGFloat(height))
    context.scaleBy(x: 1, y: -1)

    let foreground = CGColor(gray: 0.05, alpha: 1)
    let background = CGColor(gray: 0.42, alpha: 1)
    let rows = Int(ceil(Double(height) / Double(style.cellHeight)))
    let columns = Int(ceil(Double(width) / Double(style.cellWidth)))

    for row in 0..<rows {
        let y = row * style.cellHeight
        for column in 0..<columns {
            let x = column * style.cellWidth
            let luminance = averageLuminance(
                bytes: sourceBytes,
                bytesPerRow: sourceRowBytes,
                width: width,
                height: height,
                x0: x,
                y0: y,
                cellWidth: style.cellWidth,
                cellHeight: style.cellHeight
            )

            let isBackground = luminance > 238
            let character: Character
            let color: CGColor

            if isBackground {
                character = style.backgroundCharacter
                color = background
            } else {
                let normalized = max(0, min(1, luminance / 238))
                let index = min(
                    style.ramp.count - 1,
                    Int((normalized * CGFloat(style.ramp.count - 1)).rounded())
                )
                character = style.ramp[index]
                color = foreground
            }

            let attributes: [NSAttributedString.Key: Any] = [
                NSAttributedString.Key(kCTFontAttributeName as String): font,
                NSAttributedString.Key(kCTForegroundColorAttributeName as String): color
            ]
            let line = CTLineCreateWithAttributedString(
                NSAttributedString(string: String(character), attributes: attributes)
            )
            context.textPosition = CGPoint(
                x: CGFloat(x),
                y: CGFloat(height - y - style.cellHeight + 1)
            )
            CTLineDraw(line, context)
        }
    }
}

func convert(inputURL: URL, outputURL: URL) async throws {
    let asset = AVURLAsset(url: inputURL)
    guard let track = try await asset.loadTracks(withMediaType: .video).first else {
        throw ConversionError.message("The input file has no video track.")
    }

    let dimensions = orientedSize(for: track)
    guard dimensions.width > 0, dimensions.height > 0 else {
        throw ConversionError.message("The input video has invalid dimensions.")
    }

    try? FileManager.default.removeItem(at: outputURL)

    let reader = try AVAssetReader(asset: asset)
    let readerOutput = AVAssetReaderTrackOutput(
        track: track,
        outputSettings: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA
        ]
    )
    readerOutput.alwaysCopiesSampleData = false
    guard reader.canAdd(readerOutput) else {
        throw ConversionError.message("Could not configure the video reader.")
    }
    reader.add(readerOutput)

    let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
    let writerInput = AVAssetWriterInput(
        mediaType: .video,
        outputSettings: [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: dimensions.width,
            AVVideoHeightKey: dimensions.height,
            AVVideoCompressionPropertiesKey: [
                AVVideoAverageBitRateKey: 8_000_000,
                AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
            ]
        ]
    )
    writerInput.expectsMediaDataInRealTime = false
    let adaptor = AVAssetWriterInputPixelBufferAdaptor(
        assetWriterInput: writerInput,
        sourcePixelBufferAttributes: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
            kCVPixelBufferWidthKey as String: dimensions.width,
            kCVPixelBufferHeightKey as String: dimensions.height
        ]
    )
    guard writer.canAdd(writerInput) else {
        throw ConversionError.message("Could not configure the video writer.")
    }
    writer.add(writerInput)

    guard reader.startReading(), writer.startWriting() else {
        throw ConversionError.message(reader.error?.localizedDescription ?? writer.error?.localizedDescription ?? "Could not start conversion.")
    }
    writer.startSession(atSourceTime: .zero)

    let style = ASCIIStyle()
    let font = CTFontCreateWithName("Menlo" as CFString, style.fontSize, nil)
    let ciContext = CIContext(options: [.cacheIntermediates: false])
    var frameCount = 0

    while let sampleBuffer = readerOutput.copyNextSampleBuffer() {
        while !writerInput.isReadyForMoreMediaData {
            try await Task.sleep(for: .milliseconds(2))
        }
        guard let encodedBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            continue
        }

        let orientedBuffer = try makePixelBuffer(width: dimensions.width, height: dimensions.height)
        let orientedImage = CIImage(cvPixelBuffer: encodedBuffer).transformed(by: dimensions.transform)
        ciContext.render(
            orientedImage,
            to: orientedBuffer,
            bounds: CGRect(x: 0, y: 0, width: dimensions.width, height: dimensions.height),
            colorSpace: CGColorSpaceCreateDeviceRGB()
        )

        guard let destination = adaptor.pixelBufferPool.flatMap({ pool in
            var buffer: CVPixelBuffer?
            CVPixelBufferPoolCreatePixelBuffer(kCFAllocatorDefault, pool, &buffer)
            return buffer
        }) else {
            throw ConversionError.message("Could not allocate an output frame.")
        }

        try drawASCIIFrame(
            source: orientedBuffer,
            destination: destination,
            width: dimensions.width,
            height: dimensions.height,
            style: style,
            font: font
        )

        let timestamp = CMSampleBufferGetPresentationTimeStamp(sampleBuffer)
        guard adaptor.append(destination, withPresentationTime: timestamp) else {
            throw ConversionError.message(writer.error?.localizedDescription ?? "Could not write a video frame.")
        }
        frameCount += 1
        if frameCount % 30 == 0 {
            print("Processed \(frameCount) frames")
        }
    }

    writerInput.markAsFinished()
    await writer.finishWriting()

    guard reader.status == .completed, writer.status == .completed else {
        throw ConversionError.message(reader.error?.localizedDescription ?? writer.error?.localizedDescription ?? "Conversion did not finish.")
    }

    print("Created \(outputURL.path) with \(frameCount) frames at \(dimensions.width)x\(dimensions.height)")
}

guard CommandLine.arguments.count == 3 else {
    fputs("Usage: ascii_video input.mp4 output.mp4\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

do {
    try await convert(inputURL: inputURL, outputURL: outputURL)
} catch {
    fputs("Error: \(error)\n", stderr)
    exit(1)
}
