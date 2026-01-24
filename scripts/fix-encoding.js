const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BACKUP_DIR = path.join(ROOT, 'docs', 'audits', 'backup');

const EXCLUDED_DIRS = new Set([
  'node_modules', '.next', 'dist', 'build', '.git', '.turbo', '.cache', 'coverage',
  '.playwright', 'test-results', 'playwright-report', '.vscode'
]);

const EXCLUDED_PATH_PREFIXES = [
  'docs/audits/backup/',
];

const BINARY_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svgz', '.ico',
  '.pdf', '.woff', '.woff2', '.ttf', '.eot', '.zip', '.gz',
  '.tar', '.7z', '.rar', '.mp4', '.mp3', '.mov', '.avi',
  '.exe', '.dll', '.bin'
]);

const CONFIG_EXTS = new Set([
  '.json', '.yml', '.yaml', '.env', '.ini', '.toml', '.properties'
]);

const TEXT_EXT_HINTS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.jsonc', '.yml', '.yaml',
  '.md', '.txt', '.css', '.scss', '.html', '.sh', '.ps1', '.env', '.env.example'
]);

const SMART_QUOTES_MAP = {
  '\u2018': "'",
  '\u2019': "'",
  '\u201C': '"',
  '\u201D': '"'
};

const isEnvFile = (filePath) => {
  const base = path.basename(filePath);
  return base === '.env' || base.startsWith('.env.');
};

const isTextLike = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (TEXT_EXT_HINTS.has(ext)) return true;
  if (isEnvFile(filePath)) return true;
  return false;
};

const isBinaryExt = (filePath) => BINARY_EXTS.has(path.extname(filePath).toLowerCase());

const hasNullByte = (buf) => {
  const limit = Math.min(buf.length, 8192);
  for (let i = 0; i < limit; i += 1) {
    if (buf[i] === 0) return true;
  }
  return false;
};

const detectUtf8Bom = (buf) => buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;

const normalizeSmartQuotes = (text) =>
  text.replace(/[\u2018\u2019\u201C\u201D]/g, (m) => SMART_QUOTES_MAP[m] || m);

const stripHiddenChars = (text) => text.replace(/[\u00A0\u200B\uFEFF]/g, (m) => (m === '\u00A0' ? ' ' : ''));

const normalizeEolForShell = (text) => text.replace(/\r\n/g, '\n');
const normalizeEolForPs1 = (text) => text.replace(/\r?\n/g, '\r\n');
const normalizeEolForMarkdown = (text) => text.replace(/\r\n/g, '\n');

const shouldFixSmartQuotes = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG_EXTS.has(ext) || isEnvFile(filePath);
};

const shouldStripHidden = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG_EXTS.has(ext) || isEnvFile(filePath) || ext === '.ps1' || ext === '.sh';
};

const walk = (dir, files) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walk(fullPath, files);
      continue;
    }
    if (!entry.isFile()) continue;
    if (isBinaryExt(fullPath)) continue;

    const buf = fs.readFileSync(fullPath);
    if (!isTextLike(fullPath) && hasNullByte(buf)) {
      continue;
    }
    const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
    if (EXCLUDED_PATH_PREFIXES.some((prefix) => relPath.startsWith(prefix))) {
      continue;
    }
    files.push(fullPath);
  }
};

const writeBackup = (filePath, data) => {
  const rel = path.relative(ROOT, filePath);
  const target = path.join(BACKUP_DIR, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, data);
};

const fixFile = (filePath, write) => {
  const buf = fs.readFileSync(filePath);
  let text = buf.toString('utf8');
  let changed = false;

  if (detectUtf8Bom(buf)) {
    text = text.replace(/^\uFEFF/, '');
    changed = true;
  }

  if (shouldStripHidden(filePath)) {
    const next = stripHiddenChars(text);
    if (next !== text) {
      text = next;
      changed = true;
    }
  }

  if (shouldFixSmartQuotes(filePath)) {
    const next = normalizeSmartQuotes(text);
    if (next !== text) {
      text = next;
      changed = true;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.sh') {
    const next = normalizeEolForShell(text);
    if (next !== text) {
      text = next;
      changed = true;
    }
  }

  if (ext === '.ps1') {
    const next = normalizeEolForPs1(text);
    if (next !== text) {
      text = next;
      changed = true;
    }
  }

  if (ext === '.md') {
    const next = normalizeEolForMarkdown(text);
    if (next !== text) {
      text = next;
      changed = true;
    }
  }

  if (!changed) return { filePath, changed: false };

  if (write) {
    writeBackup(filePath, buf);
    fs.writeFileSync(filePath, text, 'utf8');
  }

  return { filePath, changed: true };
};

const main = () => {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const dryRun = args.includes('--dry-run') || !write;

  const files = [];
  walk(ROOT, files);
  files.sort();

  const changes = [];
  files.forEach((filePath) => {
    const result = fixFile(filePath, write && !dryRun);
    if (result.changed) {
      changes.push(path.relative(ROOT, filePath).replace(/\\/g, '/'));
    }
  });

  console.log(`Scanned: ${files.length}`);
  console.log(`Changes: ${changes.length}`);
  if (changes.length > 0) {
    changes.slice(0, 50).forEach((p) => console.log(`- ${p}`));
    if (changes.length > 50) {
      console.log(`... and ${changes.length - 50} more`);
    }
  }

  if (dryRun) {
    console.log('Dry run. Use --write to apply changes.');
  }
};

main();
