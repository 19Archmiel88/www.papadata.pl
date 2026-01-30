const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REPORT_JSON = path.join(ROOT, 'docs', 'audits', 'encoding-audit.json');
const REPORT_MD = path.join(ROOT, 'docs', 'audits', 'encoding-audit.md');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  '.turbo',
  '.cache',
  'coverage',
  '.playwright',
  'test-results',
  'playwright-report',
  '.vscode',
]);

const EXCLUDED_PATH_PREFIXES = ['docs/audits/backup/'];

const BINARY_EXTS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svgz',
  '.ico',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.zip',
  '.gz',
  '.tar',
  '.7z',
  '.rar',
  '.mp4',
  '.mp3',
  '.mov',
  '.avi',
  '.exe',
  '.dll',
  '.bin',
]);

const CONFIG_EXTS = new Set(['.json', '.yml', '.yaml', '.env', '.ini', '.toml', '.properties']);

const TEXT_EXT_HINTS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.jsonc',
  '.yml',
  '.yaml',
  '.md',
  '.txt',
  '.css',
  '.scss',
  '.html',
  '.sh',
  '.ps1',
  '.env',
  '.env.example',
]);

const SMART_QUOTES = /[\u2018\u2019\u201C\u201D]/g;
const NBSP = /\u00A0/g;
const ZWSP = /\u200B/g;
const BOM_CHAR = /\uFEFF/g;

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

const readFileBuffer = (filePath) => fs.readFileSync(filePath);

const detectBom = (buf) => {
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    return 'UTF-8 BOM';
  }
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) {
    return 'UTF-16 LE BOM';
  }
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) {
    return 'UTF-16 BE BOM';
  }
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xfe && buf[2] === 0x00 && buf[3] === 0x00) {
    return 'UTF-32 LE BOM';
  }
  if (buf.length >= 4 && buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0xfe && buf[3] === 0xff) {
    return 'UTF-32 BE BOM';
  }
  return null;
};

const toLines = (text) => text.split(/\n/);

const findLinePositions = (text, regex) => {
  const lines = toLines(text);
  const hits = [];
  lines.forEach((line, index) => {
    if (regex.test(line)) {
      hits.push(index + 1);
    }
  });
  return hits;
};

const hasMixedEol = (text) => {
  const hasCRLF = text.includes('\r\n');
  if (!hasCRLF) return false;
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '\n' && text[i - 1] !== '\r') {
      return true;
    }
  }
  return false;
};

const hasLFOnly = (text) => text.includes('\n') && !text.includes('\r\n');

const collectIssues = (filePath, buf) => {
  const issues = [];
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const bomType = detectBom(buf);
  if (bomType) {
    issues.push({
      path: relPath,
      type: 'BOM',
      details: bomType,
      recommendation: 'Remove BOM for UTF-8 text files.',
    });
  }

  if (bomType && (bomType.startsWith('UTF-16') || bomType.startsWith('UTF-32'))) {
    issues.push({
      path: relPath,
      type: 'Encoding',
      details: bomType,
      recommendation: 'Convert to UTF-8 (without BOM).',
    });
  }

  const text = buf.toString('utf8');

  const bomInMiddle = findLinePositions(text, BOM_CHAR);
  if (bomInMiddle.length > 0) {
    issues.push({
      path: relPath,
      type: 'HiddenChar',
      details: `BOM character (U+FEFF) at lines: ${bomInMiddle.join(', ')}`,
      recommendation: 'Remove BOM characters inside file.',
    });
  }

  const nbspLines = findLinePositions(text, NBSP);
  if (nbspLines.length > 0) {
    issues.push({
      path: relPath,
      type: 'HiddenChar',
      details: `NBSP (U+00A0) at lines: ${nbspLines.join(', ')}`,
      recommendation: 'Replace NBSP with regular spaces.',
    });
  }

  const zwspLines = findLinePositions(text, ZWSP);
  if (zwspLines.length > 0) {
    issues.push({
      path: relPath,
      type: 'HiddenChar',
      details: `Zero-width space (U+200B) at lines: ${zwspLines.join(', ')}`,
      recommendation: 'Remove zero-width spaces.',
    });
  }

  const ext = path.extname(filePath).toLowerCase();
  const isConfig = CONFIG_EXTS.has(ext) || isEnvFile(filePath);
  if (isConfig && SMART_QUOTES.test(text)) {
    const smartLines = findLinePositions(text, SMART_QUOTES);
    issues.push({
      path: relPath,
      type: 'SmartQuotes',
      details: `Smart quotes at lines: ${smartLines.join(', ')}`,
      recommendation: 'Replace smart quotes with ASCII quotes.',
    });
  }

  if (hasMixedEol(text)) {
    issues.push({
      path: relPath,
      type: 'EOL',
      details: 'Mixed CRLF/LF line endings',
      recommendation: 'Normalize line endings.',
    });
  }

  if (ext === '.sh' && text.includes('\r\n')) {
    issues.push({
      path: relPath,
      type: 'EOL',
      details: 'CRLF in .sh file',
      recommendation: 'Convert to LF for shell scripts.',
    });
  }

  if (ext === '.json') {
    try {
      JSON.parse(text.replace(/^\uFEFF/, ''));
    } catch (err) {
      issues.push({
        path: relPath,
        type: 'JSON',
        details: `Invalid JSON: ${err.message}`,
        recommendation: 'Fix JSON syntax / encoding issues.',
      });
    }
  }

  if (isEnvFile(filePath)) {
    if (SMART_QUOTES.test(text)) {
      issues.push({
        path: relPath,
        type: 'Env',
        details: 'Smart quotes found in env file',
        recommendation: 'Use straight ASCII quotes or no quotes.',
      });
    }
  }

  return issues;
};

const walk = (dir, results) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walk(fullPath, results);
      continue;
    }

    if (!entry.isFile()) continue;
    const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
    if (EXCLUDED_PATH_PREFIXES.some((prefix) => relPath.startsWith(prefix))) {
      continue;
    }
    const ext = path.extname(fullPath).toLowerCase();
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    if (isBinaryExt(fullPath)) continue;

    const buf = readFileBuffer(fullPath);
    if (!isTextLike(fullPath) && hasNullByte(buf)) {
      continue;
    }

    results.scanned.push(relPath);
    const issues = collectIssues(fullPath, buf);
    results.issues.push(...issues);
  }
};

const main = () => {
  const results = { scanned: [], issues: [] };
  walk(ROOT, results);

  results.scanned.sort();
  results.issues.sort((a, b) =>
    a.path === b.path ? a.type.localeCompare(b.type) : a.path.localeCompare(b.path)
  );

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        scannedCount: results.scanned.length,
        issueCount: results.issues.length,
        issues: results.issues,
      },
      null,
      2
    )
  );

  const header = [
    '# Encoding Audit',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Scanned files: ${results.scanned.length}`,
    `Issues: ${results.issues.length}`,
    '',
    '| Path | Type | Details | Recommendation |',
    '| --- | --- | --- | --- |',
  ];

  const rows = results.issues.map((issue) => {
    return `| ${issue.path} | ${issue.type} | ${issue.details} | ${issue.recommendation} |`;
  });

  const content = header.concat(rows).join('\n') + '\n';
  fs.writeFileSync(REPORT_MD, content, 'utf8');

  const top20 = results.issues.slice(0, 20);
  console.log(`Scanned: ${results.scanned.length}`);
  console.log(`Issues: ${results.issues.length}`);
  if (top20.length > 0) {
    console.log('Top 20 issues:');
    top20.forEach((issue) => {
      console.log(`- ${issue.path} | ${issue.type} | ${issue.details}`);
    });
  }
};

main();
