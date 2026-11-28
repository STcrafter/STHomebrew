import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';
import { isItemVisible } from '../src/utils/itemVisibility.js';
import { primeStore } from './helpers/primeStore.js';

async function withSavedPreferences(preferences, run) {
  const savedLocalStorage = globalThis.localStorage;
  const stored = { listViewPreferences: JSON.stringify(preferences) };
  globalThis.localStorage = {
    getItem: (key) => stored[key] ?? null,
    setItem: (key, value) => { stored[key] = String(value); },
  };
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  await primeStore(server);
  try {
    await run(server);
  } finally {
    await server.close();
    if (savedLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedLocalStorage;
  }
}

async function renderList(server, location) {
  const { default: CategoryList } = await server.ssrLoadModule('/src/pages/CategoryList.jsx');
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
          React.createElement(Route, {
            path: '/category/:category',
            element: React.createElement(CategoryList),
          })
        )
      )
    )
  );
}

test('saved search and sort direction are restored in the spell list', async () => {
  await withSavedPreferences({
    spells: {
      search: 'Мгновенная',
      filters: {},
      sortField: 'level',
      sortDirection: 'desc',
      showFavorites: false,
    },
  }, async (server) => {
    const html = await renderList(server, '/category/spells');

    assert.match(html, /value="Мгновенная"/);
    assert.match(html, /aria-label="Сортировать по возрастанию"/);
    assert.match(html, /1 запись<\/span>/);
  });
});

test('saved filters apply only to their own category', async () => {
  await withSavedPreferences({
    spells: {
      search: '',
      filters: { level: { include: ['3'], exclude: [] } },
      sortField: 'name',
      sortDirection: 'asc',
      showFavorites: false,
    },
  }, async (server) => {
    const spellsHtml = await renderList(server, '/category/spells');
    const monstersHtml = await renderList(server, '/category/monsters');
    const { data } = await server.ssrLoadModule('/src/data/index.js');

    const level3 = data.spells.filter((entry) => entry.level === 3).length;
    const visibleMonsters = data.monsters.filter(isItemVisible).length;
    assert.match(spellsHtml, new RegExp(`${level3} записей`));
    assert.match(monstersHtml, new RegExp(`${visibleMonsters} записей`));
  });
});
