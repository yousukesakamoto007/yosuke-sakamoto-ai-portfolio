import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { build, listFiles, output, publicFiles } from './build-pages.mjs';

build();
const base = new URL('https://yousukesakamoto007.github.io/yosuke-sakamoto-ai-portfolio/');
const content = file => readFileSync(join(output, file), 'utf8');

test('deployment contains only reviewed static runtime files', () => {
  assert.deepEqual(listFiles(output), [...publicFiles, '.nojekyll'].sort());
  for (const file of publicFiles) assert.ok(statSync(join(output, file)).size > 0);
  assert.ok(publicFiles.reduce((bytes, file) => bytes + statSync(join(output, file)).size, 0) < 1_000_000);
});

test('links and assets resolve within the GitHub Pages project subpath', () => {
  for (const file of publicFiles.filter(file => file.endsWith('.html'))) {
    for (const [, reference] of content(file).matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
      if (reference.startsWith('#') || /^https:\/\//.test(reference)) continue;
      assert.ok(!reference.startsWith('/'), `Root-relative URL in ${file}: ${reference}`);
      const target = new URL(reference, new URL(file, base));
      assert.equal(target.origin, base.origin);
      assert.ok(target.pathname.startsWith(base.pathname), `Escapes project: ${reference}`);
      const relative = decodeURIComponent(target.pathname.slice(base.pathname.length));
      const local = join(output, relative.endsWith('/') ? `${relative}index.html` : relative);
      assert.ok(existsSync(local), `Missing target in ${file}: ${reference}`);
    }
  }
});

test('existing hosted reservation and backend applications remain linked unchanged', () => {
  const index = content('index.html');
  assert.match(index, /href="https:\/\/yohaku-cafe-reservation\.sukekyu82\.chatgpt\.site"/);
  assert.match(index, /href="https:\/\/sakamoto-relay-ops\.sukekyu82\.chatgpt\.site\/"/);
  assert.match(index, /href="\.\/projects\/fx-trade-analytics\/"/);
  assert.match(index, /href="\.\/projects\/remote-job-triage-demo\/"/);
  assert.equal((index.match(/class="project"/g) || []).length, 4);
  assert.ok(index.includes('href="./engineering/relay/"'));
});

test('published bytes contain no common secrets, local file paths or private data files', () => {
  for (const file of publicFiles) {
    const text = content(file);
    assert.doesNotMatch(text, /(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/, file);
    assert.doesNotMatch(text, /(?:C:[\\/]Users[\\/]|file:\/\/|127\.0\.0\.1|localhost:\d)/i, file);
    assert.doesNotMatch(text, /(?:raw_cache\.json|applied\.json|\.env(?:\.[A-Za-z0-9_-]+)?(?![A-Za-z0-9_])|credential\.password)/, file);
  }
});

test('demo boundaries are clear and no remote upload endpoint is introduced', () => {
  assert.match(content('index.html'), /CSVはブラウザ内で処理/);
  const jobs = content('projects/remote-job-triage-demo/index.html');
  assert.match(jobs, /匿名サンプル/);
  assert.doesNotMatch(jobs, /\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/);
  const app = content('projects/fx-trade-analytics/app.js');
  assert.doesNotMatch(app, /\bfetch\s*\(\s*["'`]https?:|XMLHttpRequest|navigator\.sendBeacon/);
});

test('Relay case study publishes only sanitized, dated verification evidence', () => {
  const report = JSON.parse(content('engineering/relay/verification-report.json'));
  assert.deepEqual(Object.keys(report).sort(), ['schemaVersion','generatedAt','sourceFingerprint','environment','total','passed','failed','suites','scope','exclusions'].sort());
  assert.equal(report.schemaVersion, 1);
  assert.match(report.sourceFingerprint, /^[a-f0-9]{64}$/);
  assert.ok(Number.isFinite(Date.parse(report.generatedAt)));
  assert.equal(report.passed, report.total);
  assert.equal(report.failed, 0);
  assert.equal(report.total, report.suites.reduce((sum, suite) => sum + suite.count, 0));
  assert.deepEqual(Object.keys(report.environment).sort(), ['node','sqlite']);
  assert.match(content('engineering/relay/index.html'), /本番データへの試験は実行しません/);
  assert.match(content('engineering/relay/index.html'), /原本は非公開/);
});
