import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { categories } from '../src/config/categories.js';
import { constructorSchemas } from '../src/config/constructorSchemas.js';
import { data } from '../src/data/index.js';

function readImportSpecifiers(source) {
  return [...source.matchAll(/(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g)].map((m) => m[1]);
}

test('category config keys match data and constructor schemas', () => {
  assert.deepEqual(Object.keys(categories).sort(), Object.keys(data).sort());
  assert.deepEqual(Object.keys(constructorSchemas).sort(), Object.keys(data).sort());
});

test('config files have no forbidden imports', () => {
  const configDir = path.resolve('src/config');
  for (const file of fs.readdirSync(configDir)) {
    const full = path.join(configDir, file);
    const source = fs.readFileSync(full, 'utf8');
    for (const spec of readImportSpecifiers(source)) {
      if (!spec.startsWith('.')) continue;
      const resolved = path.resolve(path.dirname(full), spec).replace(/\\/g, '/');
      assert.ok(!resolved.includes('/src/data'), `${file} imports data: ${spec}`);
      if (file === 'categories.js' || file === 'constructorSchemas.js') {
        assert.ok(!resolved.includes('/src/components'), `${file} imports components: ${spec}`);
        assert.ok(!resolved.includes('/src/pages'), `${file} imports pages: ${spec}`);
        assert.notEqual(spec, 'react');
      }
    }
  }
});
