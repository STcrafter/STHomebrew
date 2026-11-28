import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';
import { primeStore } from './helpers/primeStore.js';

async function withServer(fn) {
  const savedStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  await primeStore(server);
  try {
    return await fn(server);
  } finally {
    await server.close();
    if (savedStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedStorage;
  }
}

async function renderPage(server, modulePath, routePath, location) {
  const Component = (await server.ssrLoadModule(modulePath)).default;
  const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
  return renderToStaticMarkup(
    React.createElement(
      StaticRouter,
      { location },
      React.createElement(
        FavoritesProvider,
        null,
        React.createElement(
          Routes,
          null,
          React.createElement(Route, { path: routePath, element: React.createElement(Component) })
        )
      )
    )
  );
}

async function renderCategory(server, location) {
  return renderPage(server, '/src/pages/CategoryList.jsx', '/category/:category', location);
}

async function renderDetail(server, location) {
  return renderPage(server, '/src/pages/ItemDetail.jsx', '/category/:category/:id', location);
}

test('filter section toggles are buttons exposing aria-expanded', async () => {
  await withServer(async (server) => {
    const html = await renderCategory(server, '/category/monsters');
    assert.match(html, /<button[^>]*aria-expanded="false"[^>]*><span>Места обитания/);
  });
});

test('race variant toggles are buttons exposing aria-expanded', async () => {
  await withServer(async (server) => {
    const html = await renderDetail(server, '/category/races/aasimar');
    assert.match(html, /<button[^>]*aria-expanded="false"[^>]*>/);
  });
});

test('class detail section toggles are buttons exposing aria-expanded', async () => {
  await withServer(async (server) => {
    const html = await renderDetail(server, '/category/classes/class-dancer');
    assert.match(html, /<button[^>]*aria-expanded="true"[^>]*>/);
    assert.match(html, /<button[^>]*aria-expanded="false"[^>]*>/);
  });
});

test('favorites filter is a real checkbox with a label', async () => {
  await withServer(async (server) => {
    const html = await renderCategory(server, '/category/monsters');
    assert.match(html, /<input[^>]*type="checkbox"[^>]*>/);
  });
});

test('search input has an accessible name', async () => {
  await withServer(async (server) => {
    const html = await renderCategory(server, '/category/monsters');
    const input = html.match(/<input[^>]*type="text"[^>]*>/);
    assert.ok(input, 'expected search input');
    assert.match(input[0], /aria-label=/);
  });
});

test('favorite button is a sibling of the card link, not nested inside it', async () => {
  await withServer(async (server) => {
    const html = await renderCategory(server, '/category/monsters');
    assert.ok(!/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*<button/.test(html), 'button must not be inside a link');
  });
});

test('monster images declare intrinsic dimensions', async () => {
  await withServer(async (server) => {
    const html = await renderDetail(server, '/category/monsters/mme2026_1');
    const image = html.match(/<img[^>]*>/);
    assert.ok(image, 'expected an image');
    assert.match(image[0], /width=/);
    assert.match(image[0], /height=/);
  });
});

test('result count is announced politely', async () => {
  await withServer(async (server) => {
    const html = await renderCategory(server, '/category/monsters');
    const count = html.match(/<span[^>]*>[^<]*записей<\/span>/);
    assert.ok(count, 'expected result count');
    assert.match(count[0], /aria-live="polite"/);
  });
});

test('constructor controls have associated labels and explicit button types', async () => {
  await withServer(async (server) => {
    const html = await renderPage(server, '/src/pages/Constructor.jsx', '/constructor', '/constructor');
    const ids = [...html.matchAll(/<input[^>]*id="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(ids.length > 0);
    ids.forEach((id) => assert.match(html, new RegExp(`<label[^>]*for="${id}"`)));
    assert.ok(!/<button(?!\s[^>]*type=)/.test(html), 'every button needs an explicit type');
  });
});

test('index.html provides a skip link and page roots expose its target', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(html, /class="skip-link"[^>]*href="#main-content"|href="#main-content"[^>]*class="skip-link"/);
  for (const file of ['Home.jsx', 'CategoryList.jsx', 'ItemDetail.jsx', 'Constructor.jsx']) {
    const source = fs.readFileSync(`src/pages/${file}`, 'utf8');
    assert.match(source, /id="main-content"/, `${file} must expose #main-content`);
  }
});

test('dark theme sets color-scheme and focus styles use focus-visible', () => {
  const theme = fs.readFileSync('src/theme.css', 'utf8');
  assert.match(theme, /color-scheme:\s*dark/);
  const source = fs.readFileSync('src/index.css', 'utf8');
  assert.match(source, /:focus-visible/);
});

test('clipboard feedback is not an alert dialog', () => {
  const source = fs.readFileSync('src/pages/Constructor.jsx', 'utf8');
  assert.ok(!/\balert\(/.test(source));
  assert.match(source, /aria-live="polite"/);
});
