import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const localResumePdf = path.join(root, 'dist/assets/zhou-saihan-ux-designer.pdf');

async function readEnvValue(filename, key) {
  try {
    const content = await fs.readFile(path.join(root, filename), 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      if (trimmed.slice(0, index).trim() !== key) continue;
      return trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return '';
}

const resumePdfUrl =
  process.env.VITE_RESUME_PDF_URL ||
  (await readEnvValue('.env.production.local', 'VITE_RESUME_PDF_URL')) ||
  (await readEnvValue('.env.production', 'VITE_RESUME_PDF_URL')) ||
  (await readEnvValue('.env.local', 'VITE_RESUME_PDF_URL')) ||
  (await readEnvValue('.env', 'VITE_RESUME_PDF_URL'));

if (!/^https?:\/\//.test(resumePdfUrl)) {
  console.log('OSS pruning skipped: VITE_RESUME_PDF_URL is not set to an external URL.');
  process.exit(0);
}

try {
  await fs.unlink(localResumePdf);
  console.log('Removed local resume PDF from dist because VITE_RESUME_PDF_URL is external.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
