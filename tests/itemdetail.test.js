import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';

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

test('race feature names render as bold italic, not escaped markup', async () => {
  const savedLocalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
  });
  try {
    const { default: ItemDetail } = await server.ssrLoadModule('/src/pages/ItemDetail.jsx');
    const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
    const html = renderToStaticMarkup(
      React.createElement(
        StaticRouter,
        { location: '/category/races/kelpling' },
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
    assert.match(html, /<em><strong>/);
    assert.ok(!html.includes('&lt;em&gt;'));
  } finally {
    await server.close();
    if (savedLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedLocalStorage;
  }
});

test('expanded variant features render as bold italic, not escaped markup', async () => {
  const savedLocalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const savedGlobals = {};
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'IS_REACT_ACT_ENVIRONMENT'];
  keys.forEach((key) => { savedGlobals[key] = globalThis[key]; });
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/category/races/aasimar',
  });
  const define = (key, value) =>
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  define('window', dom.window);
  define('document', dom.window.document);
  define('navigator', dom.window.navigator);
  define('HTMLElement', dom.window.HTMLElement);
  define('Element', dom.window.Element);
  define('Node', dom.window.Node);
  define('IS_REACT_ACT_ENVIRONMENT', true);

  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
  });
  try {
    const { default: ItemDetail } = await server.ssrLoadModule('/src/pages/ItemDetail.jsx');
    const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
    const { createRoot } = await import('react-dom/client');
    const { act } = await import('react');

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      await act(async () => {
        root.render(
          React.createElement(
            MemoryRouter,
            { initialEntries: ['/category/races/aasimar'] },
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
      });

      const toggle = container.querySelector('button[aria-controls="variant_fernian-body"]');
      assert.ok(toggle, 'expected the fernian variant toggle');
      await act(async () => {
        toggle.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
      });

      const body = container.querySelector('#variant_fernian-body');
      assert.ok(body, 'expected the expanded fernian variant body');
      assert.match(body.innerHTML, /<em><strong>/);
      assert.ok(!body.innerHTML.includes('&lt;em&gt;'));
    } finally {
      await act(async () => { root.unmount(); });
      container.remove();
    }
  } finally {
    await server.close();
    keys.forEach((key) => {
      if (savedGlobals[key] === undefined) delete globalThis[key];
      else globalThis[key] = savedGlobals[key];
    });
    if (savedLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedLocalStorage;
    dom.window.close();
  }
});

test('subclass detail renders a tooltip marker instead of raw markup', async () => {
  const savedLocalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
  });
  try {
    const { default: ItemDetail } = await server.ssrLoadModule('/src/pages/ItemDetail.jsx');
    const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
    const html = renderToStaticMarkup(
      React.createElement(
        StaticRouter,
        { location: '/category/subclasses/reliquarian' },
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
    assert.match(html, /data-tip=/);
    assert.match(html, /tabindex="0"/);
    assert.ok(!html.includes('[tooltip:'));
  } finally {
    await server.close();
    if (savedLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedLocalStorage;
  }
});
