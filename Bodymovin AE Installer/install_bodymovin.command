#!/bin/zsh
set -e

SOURCE_DIR="$(cd "$(dirname "$0")" && pwd)/bodymovin"
TARGET_DIR="$HOME/Library/Application Support/Adobe/CEP/extensions/bodymovin"

echo "Installing Bodymovin for After Effects..."

if [[ ! -f "$SOURCE_DIR/CSXS/manifest.xml" ]]; then
  echo "Bodymovin files were not found next to this installer."
  echo "Expected: $SOURCE_DIR"
  exit 1
fi

mkdir -p "$(dirname "$TARGET_DIR")"
rm -rf "$TARGET_DIR"
cp -R "$SOURCE_DIR" "$TARGET_DIR"

for version in {4..20}; do
  defaults write "com.adobe.CSXS.$version" PlayerDebugMode 1 >/dev/null 2>&1 || true
done

echo ""
echo "Done. Restart After Effects, then open:"
echo "Window > Extensions > bodymovin"
echo ""
echo "In After Effects, also enable:"
echo "Preferences > Scripting & Expressions > Allow Scripts to Write Files and Access Network"
echo ""
read "?Press Return to close this window."
