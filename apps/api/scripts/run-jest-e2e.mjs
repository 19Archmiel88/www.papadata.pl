import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

if (!process.env.APP_MODE) {
  process.env.APP_MODE = 'demo';
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, '..');
const jestCli = resolve(appRoot, 'node_modules', 'jest', 'bin', 'jest.js');

const forwardedArgs = process.argv.slice(2);
const baseArgs = ['--config', './test/jest-e2e.json'];
const isWindows = process.platform === 'win32';
const forceWorkers = process.env.FORCE_JEST_WORKERS === '1';

const jestArgs = [...baseArgs, ...forwardedArgs];
if (isWindows && !forceWorkers && !jestArgs.includes('--runInBand')) {
  jestArgs.push('--runInBand');
}

const useNode = existsSync(jestCli);
const command = useNode ? process.execPath : 'pnpm';
const args = useNode ? [jestCli, ...jestArgs] : ['exec', 'jest', ...jestArgs];

const child = spawn(command, args, {
  shell: isWindows,
  stdio: 'inherit',
  env: {
    ...process.env,
  },
});

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code ?? 1);
});
