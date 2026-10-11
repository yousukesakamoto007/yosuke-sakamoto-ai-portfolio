import { copyFileSync, existsSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const output = join(root, '_site');

// This is intentionally an allowlist, not a copy of the repository or private sources.
export const publicFiles = Object.freeze([
  'index.html',
  'engineering/relay/index.html',
  'engineering/relay/verification-report.json',
  'projects/fx-trade-analytics/index.html',
  'projects/fx-trade-analytics/app.js',
  'projects/fx-trade-analytics/analytics-core.js',
  'projects/fx-trade-analytics/styles.css',
  'projects/fx-trade-analytics/sample-trades.csv',
  'projects/remote-job-triage-demo/index.html',
]);

export function listFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not allowed: ${relative}`);
    if (entry.isDirectory()) return listFiles(join(directory, entry.name), relative);
    if (!entry.isFile()) throw new Error(`Not a regular file: ${relative}`);
    return [relative];
  }).sort();
}

export function build() {
  const allowed = new Set([...publicFiles, '.nojekyll']);
  if (existsSync(output)) {
    if (!lstatSync(output).isDirectory() || lstatSync(output).isSymbolicLink()) {
      throw new Error('Output must be a regular local directory');
    }
    for (const file of listFiles(output)) {
      if (!allowed.has(file)) throw new Error(`Unexpected output file; inspect manually: ${file}`);
    }
  }
  for (const file of publicFiles) {
    let current = root;
    for (const segment of file.split('/')) {
      current = join(current, segment);
      if (lstatSync(current).isSymbolicLink()) throw new Error(`Source symlink rejected: ${file}`);
    }
    if (!lstatSync(current).isFile()) throw new Error(`Expected source file: ${file}`);
    const destination = join(output, file);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(current, destination);
  }
  writeFileSync(join(output, '.nojekyll'), '');
  console.log(`Built ${allowed.size} explicitly approved public files in _site/`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) build();
