import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { data } from '../src/data/index.js';

const script = fileURLToPath(new URL('../scripts/checkBundles.js', import.meta.url));

function upperEscaped(value) {
  return [...value].map((char) => {
    const code = char.codePointAt(0);
    return code > 127 ? `\\u${code.toString(16).toUpperCase().padStart(4, '0')}` : char;
  }).join('');
}

test('bundle check rejects uppercase-escaped monster names in an entry chunk', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sthomebrew-check-bundles-'));
  try {
    fs.mkdirSync(path.join(dir, 'dist', 'assets'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'dist', 'index.html'),
      '<script type="module" src="/STHomebrew/assets/index.js"></script>'
    );
    fs.writeFileSync(
      path.join(dir, 'dist', 'assets', 'index.js'),
      `const leaked = "${upperEscaped(data.monsters[0].name)}";\n`
    );
    fs.writeFileSync(path.join(dir, 'dist', 'assets', 'monsters.js'), data.monsters[0].name);

    const result = spawnSync(process.execPath, [script], { cwd: dir, encoding: 'utf8' });
    assert.notEqual(result.status, 0, `bundle check unexpectedly passed: ${result.stdout}`);
    assert.match(result.stderr, /monster data leaked into an entry chunk/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
