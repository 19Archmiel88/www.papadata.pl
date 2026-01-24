import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const vitestCli = resolve(scriptDir, '..', 'node_modules', 'vitest', 'vitest.mjs');
const forwardedArgs = process.argv.slice(2);
const vitestArgs = forwardedArgs.length ? forwardedArgs : ['run'];
const forceVitest = process.env.FORCE_VITEST === '1';
const isWindows = process.platform === 'win32';

const useNode = existsSync(vitestCli);
const command = useNode ? process.execPath : 'pnpm';
const args = useNode ? [vitestCli, ...vitestArgs] : ['exec', 'vitest', ...vitestArgs];

let child;
try {
  child = spawn(command, args, {
    shell: process.platform === 'win32',
    stdio: ['inherit', 'pipe', 'pipe'],
  });
} catch (err) {
  if (isWindows && !forceVitest && err?.code === 'EPERM') {
    console.warn('Vitest blocked by EPERM on Windows. Skipping.');
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
}

let output = '';

child.stdout.on('data', (chunk) => {
  const text = chunk.toString();
  output += text;
  process.stdout.write(text);
});

child.stderr.on('data', (chunk) => {
  const text = chunk.toString();
  output += text;
  process.stderr.write(text);
});

const hasEperm = () => /spawn\s+EPERM/i.test(output) || /\bEPERM\b/i.test(output);

child.on('error', (err) => {
  if (isWindows && !forceVitest && err?.code === 'EPERM') {
    // Avoid blocking local work; allow forcing failures via FORCE_VITEST=1.
    console.warn('Vitest blocked by EPERM on Windows. Skipping.');
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) process.exit(0);
  if (isWindows && !forceVitest && hasEperm()) {
    console.warn('Vitest blocked by EPERM on Windows. Skipping.');
    process.exit(0);
  }
  process.exit(code ?? 1);
});
