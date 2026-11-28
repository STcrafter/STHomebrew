import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { pluralizeRu } from '../src/utils/helpers.js';

const read = (file) => fs.readFileSync(file, 'utf8');

async function renderFormatted(input) {
  const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const { renderFormattedText } = await server.ssrLoadModule('/src/utils/helpers.js');
    return renderToStaticMarkup(React.createElement('div', null, renderFormattedText(input)));
  } finally {
    await server.close();
  }
}

test('Russian pluralization picks the correct form', () => {
  const forms = ['запись', 'записи', 'записей'];
  assert.equal(pluralizeRu(1, forms), 'запись');
  assert.equal(pluralizeRu(2, forms), 'записи');
  assert.equal(pluralizeRu(5, forms), 'записей');
  assert.equal(pluralizeRu(11, forms), 'записей');
  assert.equal(pluralizeRu(21, forms), 'запись');
});

test('formatted text escapes HTML instead of injecting raw markup', async () => {
  const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const { renderFormattedText } = await server.ssrLoadModule('/src/utils/helpers.js');
    const html = renderToStaticMarkup(
      React.createElement('div', null, renderFormattedText('<img src=x onerror=alert(1)> **жирный**'))
    );
    assert.ok(!html.includes('<img'), 'raw HTML must not be rendered');
    assert.match(html, /&lt;img/);
    assert.match(html, /<strong>жирный<\/strong>/);
  } finally {
    await server.close();
  }
});

test('formatted text renders a tooltip marker instead of raw markup', async () => {
  const html = await renderFormatted('Перед [tooltip: Подсказка] после');
  assert.match(html, /data-tip="Подсказка"/);
  assert.match(html, />i<\/span>/);
  assert.ok(!html.includes('[tooltip:'));
});

test('formatted text renders bold text next to a tooltip', async () => {
  const html = await renderFormatted('**жирный** [tooltip: Подсказка]');
  assert.match(html, /<strong>жирный<\/strong>/);
  assert.match(html, /data-tip="Подсказка"/);
});

test('tooltip text escapes HTML', async () => {
  const html = await renderFormatted('[tooltip:<img src=x onerror=alert(1)>]');
  assert.ok(!html.includes('<img'));
  assert.match(html, /&lt;img/);
});

test('formatted text keeps inline table references', async () => {
  const html = await renderFormatted('**Мутации** [table:ruinbound_mutations]');
  assert.match(html, /formatted-table/);
  assert.ok(!html.includes('[table:'));
});

test('formatted text preserves paragraphs and line breaks', async () => {
  const html = await renderFormatted('первая\nвторая\n\nтретья');
  assert.equal((html.match(/formatted-paragraph/g) || []).length, 2);
  assert.match(html, /<br\/>/);
  assert.match(html, /третья/);
});

test('feature names are escaped in generated markup', async () => {
  const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const { renderFormattedFeature } = await server.ssrLoadModule('/src/utils/helpers.js');
    const html = renderToStaticMarkup(React.createElement('div', null, renderFormattedFeature('<b>x</b>', null)));
    assert.ok(!html.includes('<b>x</b>'));
    assert.match(html, /&lt;b&gt;x&lt;\/b&gt;/);
  } finally {
    await server.close();
  }
});

test('feature description renders a tooltip', async () => {
  const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const { renderFormattedFeature } = await server.ssrLoadModule('/src/utils/helpers.js');
    const html = renderToStaticMarkup(
      React.createElement('div', null, renderFormattedFeature('Название', 'Описание [tooltip: Подсказка]'))
    );
    assert.match(html, /<em><strong>Название\.<\/strong><\/em>/);
    assert.match(html, /data-tip="Подсказка"/);
    assert.ok(!html.includes('[tooltip:'));
  } finally {
    await server.close();
  }
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

test('formatted tooltip has hover and focus styles', () => {
  const css = read('src/index.css');
  assert.match(css, /\.formatted-tooltip\s*\{/);
  assert.match(css, /content:\s*attr\(data-tip\)/);
  assert.match(css, /\.formatted-tooltip:hover[^{]*,\s*\.formatted-tooltip:focus/);
  assert.match(css, /\.formatted-tooltip:focus-visible/);
});

test('unused ClassTable component is removed', () => {
  assert.ok(!fs.existsSync('src/components/ClassTable.jsx'));
  assert.ok(!fs.existsSync('src/components/ClassTable.module.css'));
});
