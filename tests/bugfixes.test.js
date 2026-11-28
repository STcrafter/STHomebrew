import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';
import { data } from '../src/data/index.js';
import { tables } from '../src/data/tables.js';
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

async function renderRoute(server, modulePath, routePath, location) {
  const mod = await server.ssrLoadModule(modulePath);
  const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
  const Component = mod.default;
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

test('every [table:id] reference in data resolves to a generated table', () => {
  const refs = new Set();
  const walk = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    for (const child of Object.values(value)) {
      if (typeof child === 'string') {
        for (const match of child.matchAll(/\[table:([^\]]+)\]/g)) refs.add(match[1].trim());
      } else {
        walk(child);
      }
    }
  };
  Object.values(data).forEach(walk);
  const missing = [...refs].filter((id) => !tables[id]);
  assert.deepEqual(missing, [], `unresolved table refs: ${missing.join(', ')}`);
});

test('every image path in data points to a file in public', () => {
  const paths = [];
  const walk = (value) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (key === 'image' && typeof child === 'string') paths.push(child);
      else walk(child);
    }
  };
  Object.values(data).forEach(walk);
  const root = path.resolve('public');
  const broken = paths.filter((value) => {
    if (/^https?:\/\//.test(value)) return false;
    const relative = value.replace(/^\/STHomebrew(?=\/)/, '');
    return !fs.existsSync(path.join(root, relative));
  });
  assert.deepEqual(broken, [], `missing images: ${broken.join(', ')}`);
});

test('favorites provider survives corrupt localStorage JSON', async () => {
  await withServer(async (server) => {
    globalThis.localStorage = { getItem: () => '{bad json', setItem: () => {} };
    const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
    const html = renderToStaticMarkup(
      React.createElement(FavoritesProvider, null, React.createElement('p', null, 'ok'))
    );
    assert.match(html, /ok/);
  });
});

test('previous/next links skip monsters marked hidden', async () => {
  await withServer(async (server) => {
    const { data: serverData } = await server.ssrLoadModule('/src/data/index.js');
    const sorted = [...serverData.monsters].sort((a, b) => a.name.localeCompare(b.name));
    const current = sorted[5];
    const hiddenNeighbour = sorted[6];
    const modifiedMonsters = serverData.monsters.map((item) =>
      item.id === hiddenNeighbour.id ? { ...item, hidden: true } : item
    );
    await primeStore(server, { monsters: modifiedMonsters });

    const html = await renderRoute(
      server,
      '/src/pages/ItemDetail.jsx',
      '/category/:category/:id',
      `/category/monsters/${current.id}`
    );
    assert.ok(!html.includes(`href="/category/monsters/${hiddenNeighbour.id}"`), 'link to hidden monster must not be rendered');

    const hiddenHtml = await renderRoute(
      server,
      '/src/pages/ItemDetail.jsx',
      '/category/:category/:id',
      `/category/monsters/${hiddenNeighbour.id}`
    );
    assert.ok(
      !hiddenHtml.includes(`href="/category/monsters/${sorted[0].id}"`),
      'hidden item page must not link to the first visible monster'
    );
  });
});

test('home page links to the constructor', async () => {
  await withServer(async (server) => {
    const html = await renderRoute(server, '/src/pages/Home.jsx', '/', '/');
    assert.match(html, /href="\/constructor"/);
  });
});

test('constructor offers a category for every data category', async () => {
  await withServer(async (server) => {
    const html = await renderRoute(server, '/src/pages/Constructor.jsx', '/constructor', '/constructor');
    const options = html.match(/<option /g) || [];
    assert.equal(options.length, Object.keys(data).length);
  });
});

test('class detail page renders exactly one h1', async () => {
  await withServer(async (server) => {
    const className = data.classes[0].name;
    const html = await renderRoute(
      server,
      '/src/pages/ItemDetail.jsx',
      '/category/:category/:id',
      `/category/classes/${data.classes[0].id}`
    );
    assert.ok(html.includes(className));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
  });
});
