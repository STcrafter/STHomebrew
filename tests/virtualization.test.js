import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server.js';
import { createServer } from 'vite';
import { JSDOM } from 'jsdom';
import { data } from '../src/data/index.js';

const visibleMonsterCount = data.monsters.filter((item) => item.hidden !== true).length;

async function withServer(fn) {
  const savedStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });
  try {
    return await fn(server);
  } finally {
    await server.close();
    if (savedStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedStorage;
  }
}

async function loadCategory(server) {
  const { default: CategoryList } = await server.ssrLoadModule('/src/pages/CategoryList.jsx');
  const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
  return { CategoryList, FavoritesProvider };
}

function setupDom() {
  const saved = {};
  const keys = [
    'window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node',
    'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'ResizeObserver',
    'IS_REACT_ACT_ENVIRONMENT',
  ];
  keys.forEach((key) => { saved[key] = globalThis[key]; });

  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/category/monsters',
    pretendToBeVisual: true,
  });

  const defineGlobal = (key, value) => {
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  };
  defineGlobal('window', dom.window);
  defineGlobal('document', dom.window.document);
  defineGlobal('navigator', dom.window.navigator);
  defineGlobal('HTMLElement', dom.window.HTMLElement);
  defineGlobal('Element', dom.window.Element);
  defineGlobal('Node', dom.window.Node);
  defineGlobal('getComputedStyle', dom.window.getComputedStyle.bind(dom.window));
  defineGlobal('requestAnimationFrame', dom.window.requestAnimationFrame.bind(dom.window));
  defineGlobal('cancelAnimationFrame', dom.window.cancelAnimationFrame.bind(dom.window));
  defineGlobal('IS_REACT_ACT_ENVIRONMENT', true);

  Object.defineProperty(dom.window, 'innerWidth', { value: 1200, configurable: true });
  Object.defineProperty(dom.window, 'innerHeight', { value: 600, configurable: true });
  Object.defineProperty(dom.window, 'scrollY', { value: 0, writable: true, configurable: true });
  dom.window.scrollTo = (options) => {
    const top = typeof options === 'number' ? options : (options?.top ?? 0);
    dom.window.scrollY = top;
    dom.window.dispatchEvent(new dom.window.Event('scroll'));
  };
  for (const element of [dom.window.document.documentElement, dom.window.document.body]) {
    Object.defineProperty(element, 'clientHeight', { value: 600, configurable: true });
    Object.defineProperty(element, 'scrollHeight', { value: 52800, configurable: true });
    Object.defineProperty(element, 'offsetHeight', { value: 600, configurable: true });
    Object.defineProperty(element, 'clientWidth', { value: 1200, configurable: true });
    Object.defineProperty(element, 'scrollWidth', { value: 1200, configurable: true });
  }

  class TestResizeObserver {
    constructor(callback) { this.callback = callback; }
    observe(target) {
      this.callback([{ target, contentRect: { width: 1200, height: 600 } }], this);
    }
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = TestResizeObserver;
  dom.window.ResizeObserver = TestResizeObserver;

  dom.window.Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return {
      x: 0, y: 0, top: 0, left: 0, right: 1200, bottom: 600,
      width: 1200, height: 600, toJSON() { return {}; },
    };
  };

  return () => {
    dom.window.close();
    keys.forEach((key) => {
      if (saved[key] === undefined) delete globalThis[key];
      else globalThis[key] = saved[key];
    });
  };
}

function countMonsterLinks(html) {
  return (html.match(/href="\/category\/monsters\/[^"]+"/g) || []).length;
}

test('browser rendering keeps only visible monster cards in the DOM', async () => {
  const restoreDom = setupDom();
  try {
    await withServer(async (server) => {
    const { CategoryList, FavoritesProvider } = await loadCategory(server);
    const { VirtuosoGridMockContext } = await import('react-virtuoso');
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
            { initialEntries: ['/category/monsters'] },
            React.createElement(
              VirtuosoGridMockContext.Provider,
              {
                value: {
                  itemHeight: 120,
                  itemWidth: 200,
                  viewportHeight: 600,
                  viewportWidth: 1200,
                },
              },
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
          )
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      });

      const rendered = countMonsterLinks(container.innerHTML);
      assert.ok(rendered > 0, 'at least one monster card should be rendered');
      assert.ok(
        rendered < visibleMonsterCount,
        `expected a virtualized subset, got ${rendered} of ${visibleMonsterCount} cards`
      );
    } finally {
      await act(async () => { root.unmount(); });
      container.remove();
    }
    });
  } finally {
    restoreDom();
  }
});

test('changing sort returns the virtualized grid to the first card', async () => {
  const restoreDom = setupDom();
  try {
    await withServer(async (server) => {
    const { CategoryList, FavoritesProvider } = await loadCategory(server);
    const { VirtuosoGridMockContext } = await import('react-virtuoso');
    const { createRoot } = await import('react-dom/client');
    const { act } = await import('react');

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const firstIndex = () => Number(container.querySelector('[data-index]')?.getAttribute('data-index') ?? -1);

    try {
      await act(async () => {
        root.render(
          React.createElement(
            VirtuosoGridMockContext.Provider,
            {
              value: {
                itemHeight: 120,
                itemWidth: 200,
                viewportHeight: 600,
                viewportWidth: 1200,
              },
            },
            React.createElement(
              MemoryRouter,
              { initialEntries: ['/category/monsters'] },
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
          )
        );
      });
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
      });

      window.scrollY = 2400;
      await act(async () => {
        window.dispatchEvent(new window.Event('scroll'));
        await new Promise((resolve) => setTimeout(resolve, 300));
      });
      const scrolledIndex = firstIndex();
      assert.ok(scrolledIndex > 0, `expected scrolling to move the window, first index was ${scrolledIndex}`);

      const sortButton = container.querySelector('button[aria-label="Сортировать по убыванию"]');
      assert.ok(sortButton, 'expected sort direction button');
      await act(async () => {
        sortButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
        await new Promise((resolve) => setTimeout(resolve, 300));
      });

      assert.equal(firstIndex(), 0, 'changing sort should reset the virtualized grid to the first card');
    } finally {
      await act(async () => { root.unmount(); });
      container.remove();
    }
    });
  } finally {
    restoreDom();
  }
});

test('server rendering still includes every monster card', async () => {
  await withServer(async (server) => {
    const { CategoryList, FavoritesProvider } = await loadCategory(server);
    const html = renderToStaticMarkup(
      React.createElement(
        StaticRouter,
        { location: '/category/monsters' },
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
    assert.equal(countMonsterLinks(html), visibleMonsterCount);
  });
});
