import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('App lazy-loads all four pages behind Suspense', () => {
  const source = fs.readFileSync('src/App.jsx', 'utf8');
  assert.match(source, /\blazy\b/);
  assert.match(source, /\bSuspense\b/);
  assert.equal((source.match(/import\(\s*['"]\.\/pages\/[A-Za-z]+['"]\s*\)/g) || []).length, 4);
  assert.ok(!/import\s+\w+\s+from\s+['"]\.\/pages\//.test(source));
});

test('vite config does not merge data modules into one chunk', () => {
  const source = fs.readFileSync('vite.config.js', 'utf8');
  assert.ok(!source.includes('/src/data/'));
});
