import { spawn } from 'node:child_process';
import { existsSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, '..');
const repoRoot = resolve(appRoot, '..', '..');
const viteCli = resolve(appRoot, 'node_modules', 'vite', 'bin', 'vite.js');
const forwardedArgs = process.argv.slice(2);
const isWindows = process.platform === 'win32';

const archToPkg = {
  x64: 'win32-x64',
  arm64: 'win32-arm64',
  ia32: 'win32-ia32',
};

const findEsbuildBinary = () => {
  const direct = join(repoRoot, 'node_modules', 'esbuild', 'esbuild.exe');
  if (existsSync(direct)) return direct;

  const pnpmRoot = join(repoRoot, 'node_modules', '.pnpm');
  if (!existsSync(pnpmRoot)) return null;

  const entries = readdirSync(pnpmRoot, { withFileTypes: true });
  const platformPkg = archToPkg[process.arch];

  if (platformPkg) {
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (!entry.name.startsWith(`@esbuild+${platformPkg}@`)) continue;
      const candidate = join(
        pnpmRoot,
        entry.name,
        'node_modules',
        '@esbuild',
        platformPkg,
        'esbuild.exe',
      );
      if (existsSync(candidate)) return candidate;
    }
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith('esbuild@')) continue;
    const candidate = join(
      pnpmRoot,
      entry.name,
      'node_modules',
      'esbuild',
      'esbuild.exe',
    );
    if (existsSync(candidate)) return candidate;
  }

  return null;
};

const checkTmpDelete = () => {
  const tmpFile = join(repoRoot, `_tmp_vite_${Date.now()}.tmp`);
  try {
    writeFileSync(tmpFile, 'ok');
    unlinkSync(tmpFile);
    return true;
  } catch (err) {
    console.warn(
      `Windows delete permission issue in repo root. ` +
        `Run "pnpm run diagnose:windows" and verify ACL/AV exclusions. (${err?.code ?? err})`,
    );
    return false;
  }
};

const env = { ...process.env };
if (isWindows) {
  checkTmpDelete();
  if (!env.ESBUILD_BINARY_PATH) {
    const esbuildPath = findEsbuildBinary();
    if (esbuildPath) {
      env.ESBUILD_BINARY_PATH = esbuildPath;
    }
  }
}

const useNode = existsSync(viteCli);
const command = useNode ? process.execPath : 'pnpm';
const args = useNode ? [viteCli, ...forwardedArgs] : ['exec', 'vite', ...forwardedArgs];

const child = spawn(command, args, {
  cwd: appRoot,
  stdio: 'inherit',
  shell: isWindows,
  env,
});

child.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code ?? 1);
});
