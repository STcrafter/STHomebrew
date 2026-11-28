import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pluralizeRu } from '../src/utils/helpers.js';

const read = (file) => fs.readFileSync(file, 'utf8');

test('Russian pluralization picks the correct form', () => {
  const forms = ['запись', 'записи', 'записей'];
  assert.equal(pluralizeRu(1, forms), 'запись');
  assert.equal(pluralizeRu(2, forms), 'записи');
  assert.equal(pluralizeRu(5, forms), 'записей');
  assert.equal(pluralizeRu(11, forms), 'записей');
  assert.equal(pluralizeRu(21, forms), 'запись');
});

test('category list uses pluralization helper', () => {
  const source = read('src/pages/CategoryList.jsx');
  assert.match(source, /pluralizeRu\(/);
  assert.ok(!source.includes('{filteredItems.length} записей'));
});

test('theme provider falls back to the preferred color scheme', () => {
  const source = read('src/context/ThemeContext.jsx');
  assert.match(source, /prefers-color-scheme/);
});

test('browser basename comes from Vite base URL', () => {
  const source = read('src/App.jsx');
  assert.match(source, /import\.meta\.env\.BASE_URL/);
  assert.ok(!source.includes("'/STHomebrew'"));
});

test('404 page is generated from index.html at build time', () => {
  assert.ok(!fs.existsSync('public/404.html'), 'stale public/404.html should be removed');
  const vite = read('vite.config.js');
  assert.match(vite, /404\.html/);
  const workflow = read('.github/workflows/deploy.yml');
  assert.ok(!workflow.includes('cp dist/index.html'));
});

test('deploy workflow uses npm ci without redundant table generation', () => {
  const workflow = read('.github/workflows/deploy.yml');
  assert.match(workflow, /npm ci/);
  assert.ok(!workflow.includes('npm install'));
  assert.equal((workflow.match(/generate-tables/g) || []).length, 1);
});

test('build output is ignored by git', () => {
  assert.match(read('.gitignore'), /^dist\/?$/m);
});

test('no transition: all in stylesheets', () => {
  const files = [
    'src/App.css',
    'src/components/FilterPanel.module.css',
    'src/pages/CategoryList.module.css',
    'src/pages/Constructor.module.css',
  ];
  files.forEach(file => {
    assert.ok(!/transition:\s*all/.test(read(file)), `${file} still uses transition: all`);
  });
});

test('unused ClassTable component is removed', () => {
  assert.ok(!fs.existsSync('src/components/ClassTable.jsx'));
  assert.ok(!fs.existsSync('src/components/ClassTable.module.css'));
});

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? sourceFiles(full) : [full];
});

test('no dangerouslySetInnerHTML anywhere in src', () => {
  const offenders = sourceFiles('src')
    .filter((file) => /\.(js|jsx)$/.test(file))
    .filter((file) => fs.readFileSync(file, 'utf8').includes('dangerouslySetInnerHTML'));
  assert.deepEqual(offenders, []);
});
