import { spawn } from 'node:child_process';
import { existsSync, unlinkSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const npmLock = resolve(root, 'package-lock.json');
const npmShrinkwrap = resolve(root, 'npm-shrinkwrap.json');
const isWindows = process.platform === 'win32';

const run = (cmd, args) =>
  new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(cmd, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', rejectPromise);
    child.on('close', (code) => {
      if (code === 0) return resolvePromise();
      rejectPromise(new Error(`${cmd} ${args.join(' ')} failed (${code}).`));
    });
  });

const fail = (msg) => {
  // eslint-disable-next-line no-console
  console.error(msg);
  process.exit(1);
};

const checkTmpDelete = () => {
  const tmpFile = resolve(root, `_tmp_pnpm_${Date.now()}.tmp`);
  try {
    writeFileSync(tmpFile, 'ok');
    unlinkSync(tmpFile);
  } catch (err) {
    fail(
      [
        'Windows delete permissions look blocked in repo root.',
        'Fix ACL/AV exclusions and rerun "pnpm run diagnose:windows".',
        `Error: ${err?.code ?? err}`,
      ].join('\n')
    );
  }
};

if (existsSync(npmLock) || existsSync(npmShrinkwrap)) {
  fail(
    [
      'Found npm lockfile in a pnpm repo.',
      'Remove it and use pnpm-lock.yaml only:',
      '- package-lock.json',
      '- npm-shrinkwrap.json',
    ].join('\n')
  );
}

if (isWindows) {
  checkTmpDelete();
}

try {
  // Deterministic install – fail if pnpm-lock.yaml is out of sync
  await run('pnpm', ['install', '--frozen-lockfile']);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error(`pnpm install failed. Error: ${err?.message ?? err}`);
  process.exit(1);
}
