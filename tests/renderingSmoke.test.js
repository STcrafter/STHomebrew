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
});

after(async () => {
  await server.close();
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
        })
      )
    )
  )
);

test('inline table reference on a real race page renders as a table', () => {
  const html = renderDetail('/category/races/eberron_ruinbound');
  assert.match(html, /<table[\s\S]*<\/table>/);
  assert.ok(!html.includes('[table:'));
});

test('detail pages render for every category', async (t) => {
  for (const [category, items] of Object.entries(data)) {
    const item = items.find((entry) => entry.hidden !== true);
    await t.test(`detail page renders for ${category}`, () => {
      const html = renderDetail(`/category/${category}/${item.id}`);
      assert.ok(html.includes(item.name));
      assert.ok(!html.includes('&lt;em&gt;'));
      assert.ok(!html.includes('renderFormattedText is not defined'));
    });
  }
});
