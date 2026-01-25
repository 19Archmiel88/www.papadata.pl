import { spawn } from 'node:child_process';
import {
  existsSync,
  readdirSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
  readFileSync,
} from 'node:fs';
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

const resolveEsbuildPackage = (viteEntry) => {
  if (!viteEntry || !existsSync(viteEntry)) return null;
  try {
    const realViteCli = realpathSync(viteEntry);
    const vitePackageRoot = resolve(realViteCli, '..', '..');
    const viteNodeModules = resolve(vitePackageRoot, '..');
    const esbuildRoot = resolve(viteNodeModules, 'esbuild');
    const pkgPath = resolve(esbuildRoot, 'package.json');
    if (!existsSync(pkgPath)) return null;
    return {
      pkgPath,
      esbuildRoot: realpathSync(esbuildRoot),
    };
  } catch {
    return null;
  }
};

const resolveEsbuildVersion = (viteEntry) => {
  const info = resolveEsbuildPackage(viteEntry);
  if (!info) return null;
  try {
    const raw = readFileSync(info.pkgPath, 'utf8');
    const parsed = JSON.parse(raw);
    return typeof parsed?.version === 'string' ? parsed.version : null;
  } catch {
    return null;
  }
};

const resolveEsbuildBinary = (viteEntry) => {
  const info = resolveEsbuildPackage(viteEntry);
  if (!info) return null;
  const esbuildDepsRoot = resolve(info.esbuildRoot, '..');
  const binPath = join(
    esbuildDepsRoot,
    '@esbuild',
    'win32-x64',
    'esbuild.exe',
  );
  return existsSync(binPath) ? binPath : null;
};

const findEsbuildBinary = (preferredVersion) => {
  const direct = join(repoRoot, 'node_modules', 'esbuild', 'esbuild.exe');
  if (existsSync(direct)) return direct;

  const pnpmRoot = join(repoRoot, 'node_modules', '.pnpm');
  if (!existsSync(pnpmRoot)) return null;

  const entries = readdirSync(pnpmRoot, { withFileTypes: true });
  const platformPkg = archToPkg[process.arch];

  if (platformPkg && preferredVersion) {
    const preferredPrefix = `@esbuild+${platformPkg}@${preferredVersion}`;
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (!entry.name.startsWith(preferredPrefix)) continue;
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

  if (preferredVersion) {
    const preferredPrefix = `esbuild@${preferredVersion}`;
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (!entry.name.startsWith(preferredPrefix)) continue;
      const candidate = join(
        pnpmRoot,
        entry.name,
        'node_modules',
        'esbuild',
        'esbuild.exe',
      );
      if (existsSync(candidate)) return candidate;
    }
  }

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
    const esbuildPath =
      resolveEsbuildBinary(viteCli) ??
      findEsbuildBinary(resolveEsbuildVersion(viteCli));
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
