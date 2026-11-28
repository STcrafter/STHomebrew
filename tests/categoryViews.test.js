import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';

let server;
let savedLocalStorage;
let ItemDetail;
let FavoritesProvider;
let data;
let categoryViews;

before(async () => {
  savedLocalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
  });
  ({ default: ItemDetail } = await server.ssrLoadModule('/src/pages/ItemDetail.jsx'));
  ({ FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx'));
  ({ data } = await server.ssrLoadModule('/src/data/index.js'));
  ({ categoryViews } = await server.ssrLoadModule('/src/config/categoryViews.jsx'));
});

after(async () => {
  await server?.close();
  if (savedLocalStorage === undefined) delete globalThis.localStorage;
  else globalThis.localStorage = savedLocalStorage;
});

const renderDetail = (location) => renderToStaticMarkup(
  React.createElement(
    StaticRouter,
    { location },
    React.createElement(
      FavoritesProvider,
      null,
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/category/:category/:id',
          element: React.createElement(ItemDetail),
        }),
      ),
    ),
  ),
);

test('categoryViews covers every category with Detail function and no CardMeta key', () => {
  assert.deepEqual(Object.keys(categoryViews).sort(), Object.keys(data).sort());
  for (const [category, view] of Object.entries(categoryViews)) {
    assert.equal(typeof view.Detail, 'function', `${category} missing Detail function`);
    assert.ok(!('CardMeta' in view), `${category} should not have CardMeta`);
  }
});

test('detail route renders for every category', async (t) => {
  for (const [category, items] of Object.entries(data)) {
    const item = items.find((entry) => entry.hidden !== true);
    await t.test(`detail route renders for ${category}`, () => {
      const html = renderDetail(`/category/${category}/${item.id}`);
      assert.ok(html.includes(item.name), `${category} did not render item name`);
    });
  }
});
