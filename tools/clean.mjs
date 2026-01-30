import { rm, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const cleanDirNames = new Set([
  'dist',
  'build',
  'coverage',
  'playwright-report',
  'test-results',
  '.vite',
  '.turbo',
  '.cache',
  '.eslintcache',
  '.playwright',
]);

const skipDirNames = new Set(['node_modules', '.git']);

const isCompiledSharedSrc = (filePath) => {
  const normalized = filePath.replace(/\\/g, '/');
  if (!normalized.includes('/libs/shared/src/')) return false;
  return ['.js', '.d.ts', '.map'].some((ext) => normalized.endsWith(ext));
};

const shouldDeleteFile = (fileName) =>
  fileName.endsWith('.log') || fileName.endsWith('.tmp') || fileName.endsWith('.tsbuildinfo');

const removePath = async (targetPath) => {
  await rm(targetPath, { recursive: true, force: true });
};

const walkAndClean = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (skipDirNames.has(entry.name)) return;
        if (cleanDirNames.has(entry.name)) {
          await removePath(fullPath);
          return;
        }
        await walkAndClean(fullPath);
        return;
      }
      if (!entry.isFile()) return;
      if (shouldDeleteFile(entry.name) || isCompiledSharedSrc(fullPath)) {
        await removePath(fullPath);
      }
    })
  );
};

const main = async () => {
  await walkAndClean(repoRoot);
  const remainingStats = await stat(repoRoot).catch(() => null);
  if (!remainingStats) {
    throw new Error('Repo root not found after cleanup.');
  }
};

main().catch((error) => {
  console.error('Clean failed.', error);
  process.exitCode = 1;
});
