import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';

test('missing spell statblock warning is announced as an alert', async () => {
  const savedLocalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  let spell;
  let pushed = false;
  try {
    const { default: ItemDetail } = await server.ssrLoadModule('/src/pages/ItemDetail.jsx');
    const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
    const { data } = await server.ssrLoadModule('/src/data/index.js');
    spell = data.spells.find((entry) => entry.id === 'spg_conj_3');
    spell.statblocks.push('toString');
    pushed = true;

    const html = renderToStaticMarkup(
      React.createElement(
        StaticRouter,
        { location: '/category/spells/spg_conj_3' },
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

    const warning = html.match(/<p[^>]*>[^<]*Статблок[^<]*<\/p>/);
    assert.ok(warning, 'expected a missing-statblock warning');
    assert.match(warning[0], /toString/);
    assert.match(warning[0], /role="alert"/);
  } finally {
    if (pushed) spell.statblocks.pop();
    await server.close();
    if (savedLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedLocalStorage;
  }
});
