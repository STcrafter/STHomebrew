import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server;
let Markdown;

before(async () => {
  server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  Markdown = (await server.ssrLoadModule('/src/components/Markdown.jsx')).default;
});

after(async () => {
  await server.close();
});

const renderMarkdown = (content, featureName) =>
  renderToStaticMarkup(React.createElement(Markdown, { content, featureName }));

test('markdown escapes HTML instead of injecting raw markup', async () => {
  const html = renderMarkdown('<img src=x onerror=alert(1)> **жирный**');
  assert.ok(!html.includes('<img'));
  assert.match(html, /&lt;img/);
  assert.match(html, /<strong>жирный<\/strong>/);
});

test('feature name is escaped and rendered as bold italic', () => {
  const html = renderMarkdown(null, '<b>x</b>');
  assert.ok(!html.includes('<b>x</b>'));
  assert.match(html, /&lt;b&gt;x&lt;\/b&gt;/);
  assert.match(html, /<em><strong>/);
});

test('feature name is followed by an explicit space', () => {
  const html = renderMarkdown('Текст', 'Название');
  assert.match(html, /<em><strong>Название\.<\/strong><\/em> Текст/);
});

test('feature name stays on the first line of a multi-line paragraph', () => {
  const html = renderMarkdown('Первая\nВторая', 'Название');
  assert.match(html, /<em><strong>Название\.<\/strong><\/em> Первая<br\/>Вторая/);
});

test('feature name is inserted before a first non-paragraph block', () => {
  const html = renderMarkdown('# Заголовок', 'Название');
  assert.ok(html.indexOf('Название.') < html.indexOf('<h2'));
  assert.match(html, /<h2[^>]*>Заголовок<\/h2>/);
});

test('feature name is inserted before a first tableRef block', () => {
  const html = renderMarkdown('[table:mind_domain_spells]', 'Название');
  assert.ok(html.indexOf('<table') !== -1);
  assert.ok(html.indexOf('Название.') < html.indexOf('<table'));
});

test('feature name heads a description that starts with a table', () => {
  const html = renderMarkdown('[table:mind_domain_spells]\n\nПосле', 'Название');
  assert.ok(html.indexOf('<table') !== -1);
  assert.ok(html.indexOf('Название.') < html.indexOf('<table'));
});

test('feature name heads a description that starts with a heading', () => {
  const html = renderMarkdown('# Заголовок\n\nТекст', 'Название');
  assert.ok(html.indexOf('Название.') < html.indexOf('<h2'));
});

test('feature name alone does not add a second dot', () => {
  const html = renderMarkdown('Текст', 'Название.');
  assert.ok(!html.includes('Название..'));
});

test('whitespace-only feature name produces no lone dot', () => {
  const html = renderMarkdown('Текст', '   ');
  assert.ok(!html.includes('<em>'));
  assert.ok(!html.includes('>.'));
});

test('non-string feature name is coerced without throwing', () => {
  const html = renderMarkdown('Текст', 42);
  assert.match(html, /<em><strong>42\.<\/strong><\/em> Текст/);
});

test('inline table reference renders as a sibling of paragraphs', () => {
  const html = renderMarkdown('до [table:ruinbound_mutations] после');
  assert.match(html, /<p[^>]*>до<\/p>/);
  assert.match(html, /<table[\s\S]*<\/table>/);
  assert.match(html, /<p[^>]*>после<\/p>/);
  assert.ok(!html.includes('[table:'));
  assert.doesNotMatch(html, /<p[^>]*>\s*<div/);
});

test('missing table id uses a warning without changing the registry', () => {
  const html = renderMarkdown('[table:__missing__]');
  assert.match(html, /__missing__/);
  assert.match(html, /не найдена/);
});

test('tooltip renders as a data-tip marker', () => {
  const html = renderMarkdown('[tooltip: Подсказка]');
  assert.match(html, /data-tip="Подсказка"/);
  assert.ok(!html.includes('[tooltip:'));
});
