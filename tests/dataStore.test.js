import test from 'node:test';
import assert from 'node:assert/strict';
import { categories } from '../src/config/categories.js';
import { data } from '../src/data/index.js';
import { getById, getCategoryStore, getNeighbours, getVisible, loadCategory, loaders, primeCategory } from '../src/data/store.js';
import { isItemVisible } from '../src/utils/itemVisibility.js';

const items = [
  { id: 'visible-1', name: 'A' },
  { id: 'hidden-1', name: 'B', hidden: true },
];

test('getById uses a Map and still resolves hidden items', () => {
  const store = primeCategory('monsters', items);
  assert.equal(store.getById('visible-1'), items[0]);
  assert.equal(getById('monsters', 'hidden-1'), items[1]);
  assert.equal(store.getById('nope'), undefined);
});

test('getVisible is memoized and excludes hidden items', () => {
  const store = primeCategory('spells', items);
  assert.equal(store.getVisible(), store.getVisible());
  assert.deepEqual(store.getVisible().map((item) => item.id), ['visible-1']);
  assert.deepEqual(items.filter(isItemVisible).map((item) => item.id), ['visible-1']);
});

test('neighbours follow alphabetical visible order and skip hidden entries', () => {
  const store = primeCategory('races', [
    { id: 'b', name: 'Б' },
    { id: 'hidden', name: 'А', hidden: true },
    { id: 'a', name: 'А-видимый' },
  ]);
  assert.deepEqual(store.getNeighbours('a'), { prev: null, next: store.getById('b') });
  assert.deepEqual(store.getNeighbours('b'), { prev: store.getById('a'), next: null });
});

test('hidden item page has no neighbours', () => {
  const store = primeCategory('monsters', items);
  assert.deepEqual(store.getNeighbours('hidden-1'), { prev: null, next: null });
});

test('prime terminates a pending import', async () => {
  const pending = loadCategory('feats');
  primeCategory('feats', [{ id: 'fake', name: 'Fake' }]);
  await pending;
  assert.equal(getById('feats', 'fake').name, 'Fake');
});

test('loadCategory reuses the same promise and never imports a primed category', async () => {
  const first = loadCategory('classes');
  assert.equal(loadCategory('classes'), first);
  const store = primeCategory('classes', [{ id: 'fake', name: 'Fake' }]);
  assert.equal(getCategoryStore('classes'), store);
  assert.equal(getCategoryStore('classes').getById('fake').name, 'Fake');
});

test('unknown category resolves to an empty store', async () => {
  const store = await loadCategory('no_such_category');
  assert.deepEqual(store.getItems(), []);
  assert.deepEqual(store.getVisible(), []);
  assert.deepEqual(store.getNeighbours('x'), { prev: null, next: null });
  assert.deepEqual(getVisible('no_such_category'), []);
  assert.deepEqual(getNeighbours('no_such_category', 'x'), { prev: null, next: null });
  assert.deepEqual(getVisible(undefined), []);
});

test('getCategoryStore throws the exact cached pending promise', () => {
  const pending = loadCategory('backgrounds');
  let thrown;
  try {
    getCategoryStore('backgrounds');
  } catch (error) {
    thrown = error;
  }
  assert.equal(thrown, pending);
});

test('a primed category still loads through a promise', async () => {
  const store = primeCategory('items', [{ id: 'x', name: 'X' }]);
  const promise = loadCategory('items');
  assert.ok(promise instanceof Promise);
  assert.equal(await promise, store);
});

test('an ignored failed import does not become an unhandled rejection', async () => {
  const events = [];
  const onUnhandled = (error) => events.push(error);
  const original = loaders.homerules;
  process.on('unhandledRejection', onUnhandled);
  try {
    loaders.homerules = () => Promise.reject(new Error('boom'));
    loadCategory('homerules');
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(events.length, 0);
    assert.throws(() => getCategoryStore('homerules'), /boom/);
  } finally {
    loaders.homerules = original;
    process.off('unhandledRejection', onUnhandled);
  }
});

test('loader keys match the registry and the data aggregate', () => {
  assert.deepEqual(Object.keys(loaders).sort(), Object.keys(categories).sort());
  assert.deepEqual(Object.keys(loaders).sort(), Object.keys(data).sort());
});
