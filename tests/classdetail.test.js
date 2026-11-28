import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import { MemoryRouter } from 'react-router-dom';

test('ClassDetail keeps hook order when data arrives after an empty render', async () => {
  const savedGlobals = {};
  const keys = ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'IS_REACT_ACT_ENVIRONMENT'];
  keys.forEach((key) => { savedGlobals[key] = globalThis[key]; });
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
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
    const { default: ClassDetail } = await server.ssrLoadModule('/src/components/ClassDetail.jsx');
    const { createRoot } = await import('react-dom/client');
    const { act } = await import('react');

    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const render = (classData) => React.createElement(
      MemoryRouter,
      null,
      React.createElement(ClassDetail, { classData })
    );
    try {
      await act(async () => { root.render(render(null)); });
      await act(async () => {
        root.render(render({ features: [], subclasses: [], class_table: [], tables: [] }));
      });
      assert.ok(!container.textContent.includes('Данные класса не найдены'));
    } finally {
      await act(async () => { root.unmount(); });
      container.remove();
    }
  } finally {
    await server.close();
    keys.forEach((key) => {
      if (savedGlobals[key] === undefined) delete globalThis[key];
      else define(key, savedGlobals[key]);
    });
  }
});
