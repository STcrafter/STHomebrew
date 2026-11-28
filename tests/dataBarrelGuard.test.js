import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readImportSpecifiers, resolvesToDataBarrel } from './helpers/dataBarrel.js';

test('barrel guard reads dynamic import specifiers', () => {
  assert.deepEqual(readImportSpecifiers("const store = import('../data/index.js');"), ['../data/index.js']);
});

test('data barrel guard catches explicit index.js imports from an absolute source path', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sthomebrew-barrel-guard-'));
  const originalCwd = process.cwd();
  try {
    const file = path.join(dir, 'src', 'pages', 'Example.jsx');
    process.chdir(dir);
    assert.equal(resolvesToDataBarrel(file, '../data/index.js'), true);
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
