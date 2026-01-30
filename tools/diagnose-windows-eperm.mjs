import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const isWindows = process.platform === 'win32';

const log = (label, value) => {
  // eslint-disable-next-line no-console
  console.log(`${label}: ${value}`);
};

const archToPkg = {
  x64: 'win32-x64',
  arm64: 'win32-arm64',
  ia32: 'win32-ia32',
};

const findEsbuildBinary = () => {
  const direct = join(root, 'node_modules', 'esbuild', 'esbuild.exe');
  if (existsSync(direct)) return direct;

  const pnpmRoot = join(root, 'node_modules', '.pnpm');
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
        'esbuild.exe'
      );
      if (existsSync(candidate)) return candidate;
    }
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith('esbuild@')) continue;
    const candidate = join(pnpmRoot, entry.name, 'node_modules', 'esbuild', 'esbuild.exe');
    if (existsSync(candidate)) return candidate;
  }

  return null;
};

if (!isWindows) {
  log('status', 'skip (non-windows)');
  process.exit(0);
}

log('cwd', root);
log('node', process.version);
log('arch', process.arch);

const tmpFile = join(root, `_tmp_codex_${Date.now()}.tmp`);
try {
  writeFileSync(tmpFile, 'ep');
  log('tmp_create', 'ok');
} catch (err) {
  log('tmp_create', `fail (${err?.code ?? err})`);
}

try {
  unlinkSync(tmpFile);
  log('tmp_delete', 'ok');
} catch (err) {
  log('tmp_delete', `fail (${err?.code ?? err})`);
}

const esbuildBinary = findEsbuildBinary();
if (!esbuildBinary) {
  log('esbuild_binary', 'not found');
  process.exit(0);
}

log('esbuild_binary', esbuildBinary);
const result = spawnSync(esbuildBinary, ['--version'], { windowsHide: true });
if (result.error) {
  log('esbuild_exec', `fail (${result.error?.code ?? result.error})`);
} else if (typeof result.status === 'number' && result.status !== 0) {
  log('esbuild_exec', `exit ${result.status}`);
} else {
  log('esbuild_exec', 'ok');
}

if (result.stderr?.length) {
  const snippet = result.stderr.toString().trim().split(/\r?\n/).slice(0, 3).join(' | ');
  if (snippet) log('esbuild_stderr', snippet);
}
