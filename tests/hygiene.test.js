import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { pluralizeRu } from '../src/utils/helpers.js';
import { readImportSpecifiers, resolvesToDataBarrel } from './helpers/dataBarrel.js';

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

test('checks workflow uses npm ci with a single table generation', () => {
  const checks = read('.github/workflows/checks.yml');
  assert.match(checks, /npm ci/);
  assert.ok(!checks.includes('npm install'));
  assert.equal((checks.match(/generate-tables/g) || []).length, 1);
});

test('checks workflow generates tables before lint, tests and build', () => {
  const checks = read('.github/workflows/checks.yml');
  assert.match(checks, /generate-tables/);
  assert.match(checks, /npm (run )?lint/);
  assert.match(checks, /npm test/);
  assert.match(checks, /npm run build/);
  assert.match(checks, /npm run check:bundles/);
  const at = (pattern) => checks.search(pattern);
  assert.ok(at(/generate-tables/) < at(/npm (run )?lint/));
  assert.ok(at(/npm (run )?lint/) < at(/npm test/));
  assert.ok(at(/npm test/) < at(/npm run build/));
  assert.ok(at(/npm run build/) < at(/npm run check:bundles/));
});

test('deploy workflow does not build or generate tables itself', () => {
  const deploy = read('.github/workflows/deploy.yml');
  assert.match(deploy, /needs:/);
  assert.ok(!/npm run build/.test(deploy));
  assert.ok(!/generate-tables/.test(deploy));
  assert.match(deploy, /test -f dist\/index\.html/);
  assert.match(deploy, /test -f dist\/404\.html/);
});

test('ci workflow is triggered by pull requests', () => {
  assert.match(read('.github/workflows/ci.yml'), /pull_request/);
});

test('checks artifact is opt-in and retained for one day', () => {
  const checks = read('.github/workflows/checks.yml');
  const deploy = read('.github/workflows/deploy.yml');
  assert.match(checks, /default:\s*false/);
  assert.match(checks, /name:\s*dist/);
  assert.match(deploy, /name:\s*dist/);
  assert.match(checks, /retention-days:\s*1/);
});

test('reusable workflow wiring matches its callers', () => {
  const checks = yaml.load(read('.github/workflows/checks.yml'));
  const ci = yaml.load(read('.github/workflows/ci.yml'));
  const deploy = yaml.load(read('.github/workflows/deploy.yml'));
  const reuse = './.github/workflows/checks.yml';

  assert.equal(ci.jobs.checks.uses, reuse);
  assert.equal(deploy.jobs.checks.uses, reuse);
  assert.deepEqual(Object.keys(deploy.jobs.checks.with), Object.keys(checks.on.workflow_call.inputs));
  assert.equal(deploy.jobs.checks.with['upload-artifact'], true);
  assert.equal(deploy.jobs.deploy.needs, 'checks');
});

test('checks workflow uses a Node version supported by the locked test dependencies', () => {
  const checks = yaml.load(read('.github/workflows/checks.yml'));
  const setupNode = checks.jobs.checks.steps.find((step) => step.uses === 'actions/setup-node@v4');
  assert.equal(String(setupNode.with['node-version']), '24');
});

test('package.json exposes a lint script', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.match(pkg.scripts.lint, /eslint/);
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

test('markdown tooltip has hover and focus styles', () => {
  const css = read('src/components/Markdown.module.css');
  assert.match(css, /\.markdown \.tooltip\s*\{/);
  assert.match(css, /content:\s*attr\(data-tip\)/);
  assert.match(css, /\.markdown \.tooltip:hover[^{]*,\s*\.markdown \.tooltip:focus/);
  assert.match(css, /\.markdown \.tooltip:focus-visible/);
});

test('unused ClassTable component is removed', () => {
  assert.ok(!fs.existsSync('src/components/ClassTable.jsx'));
  assert.ok(!fs.existsSync('src/components/ClassTable.module.css'));
});

const sourceFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? sourceFiles(full) : [full];
});

test('runtime modules do not import the data barrel', () => {
  for (const file of sourceFiles('src')) {
    if (!/\.(js|jsx)$/.test(file)) continue;
    for (const spec of readImportSpecifiers(fs.readFileSync(file, 'utf8'))) {
      if (!spec.startsWith('.')) continue;
      assert.ok(
        !resolvesToDataBarrel(file, spec),
        `${file} imports the data barrel: ${spec}`
      );
    }
  }
});

test('no dangerouslySetInnerHTML anywhere in src', () => {
  const offenders = sourceFiles('src')
    .filter((file) => /\.(js|jsx)$/.test(file))
    .filter((file) => fs.readFileSync(file, 'utf8').includes('dangerouslySetInnerHTML'));
  assert.deepEqual(offenders, []);
});
