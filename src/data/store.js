import { isItemVisible } from '../utils/itemVisibility.js';

export const loaders = {
  monsters: () => import('./monsters.js'),
  spells: () => import('./spells.js'),
  classes: () => import('./classes.js'),
  subclasses: () => import('./subclasses.js'),
  races: () => import('./races.js'),
  backgrounds: () => import('./backgrounds.js'),
  items: () => import('./items.js'),
  feats: () => import('./feats.js'),
  homerules: () => import('./homerules.js'),
};

function buildStore(items = []) {
  const byId = new Map(items.map((item) => [item.id, item]));
  let visible;
  let sortedVisible;
  let visibleIndex;

  function getVisible() {
    if (!visible) visible = items.filter(isItemVisible);
    return visible;
  }

  function getSortedVisible() {
    if (!sortedVisible) {
      sortedVisible = getVisible().slice().sort((a, b) => a.name.localeCompare(b.name));
      visibleIndex = new Map(sortedVisible.map((item, index) => [item.id, index]));
    }
    return sortedVisible;
  }

  function getNeighbours(id) {
    const sorted = getSortedVisible();
    const index = visibleIndex.get(id);
    if (index === undefined) return { prev: null, next: null };
    return {
      prev: sorted[index - 1] ?? null,
      next: sorted[index + 1] ?? null,
    };
  }

  return {
    getItems: () => items,
    getById: (id) => byId.get(id),
    getVisible,
    getNeighbours,
  };
}

const emptyStore = buildStore([]);
const cache = new Map();

function hasLoader(category) {
  return Object.prototype.hasOwnProperty.call(loaders, category);
}

function getEntry(category) {
  if (!cache.has(category)) {
    cache.set(category, { status: 'idle', promise: null, store: null, error: null, primed: false });
  }
  return cache.get(category);
}

function settleUnknown(entry) {
  entry.status = 'ready';
  entry.store = emptyStore;
  entry.promise = Promise.resolve(emptyStore);
  return entry.promise;
}

export function loadCategory(category) {
  const entry = getEntry(category);

  if (entry.status === 'ready' && entry.store) {
    if (!entry.promise) entry.promise = Promise.resolve(entry.store);
    return entry.promise;
  }

  if (entry.status === 'failed') {
    if (!entry.promise) entry.promise = Promise.reject(entry.error);
    return entry.promise;
  }

  if (entry.promise) return entry.promise;
  if (!hasLoader(category)) return settleUnknown(entry);

  entry.status = 'pending';
  const promise = loaders[category]()
    .then((module) => {
      if (entry.primed) return entry.store;
      const store = buildStore(module.default);
      entry.store = store;
      entry.status = 'ready';
      return store;
    })
    .catch((error) => {
      if (entry.primed) return entry.store;
      entry.error = error;
      entry.status = 'failed';
      throw error;
    });

  promise.catch(() => {});
  entry.promise = promise;
  return promise;
}

export function primeCategory(category, items) {
  const entry = getEntry(category);
  const store = buildStore(items);
  entry.primed = true;
  entry.status = 'ready';
  entry.error = null;
  entry.store = store;
  entry.promise = Promise.resolve(store);
  return store;
}

export function getCategoryStore(category) {
  const entry = getEntry(category);
  if (entry.status === 'idle' || (entry.status === 'failed' && !entry.promise)) {
    loadCategory(category);
  }
  if (entry.status === 'pending') throw entry.promise;
  if (entry.status === 'failed') throw entry.error;
  return entry.store;
}

export function getItems(category) {
  return getCategoryStore(category).getItems();
}

export function getById(category, id) {
  return getCategoryStore(category).getById(id);
}

export function getVisible(category) {
  return getCategoryStore(category).getVisible();
}

export function getNeighbours(category, id) {
  return getCategoryStore(category).getNeighbours(id);
}
