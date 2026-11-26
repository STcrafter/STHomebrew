import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LIST_VIEW_STORAGE_KEY,
  defaultListViewState,
  normalizeListViewState,
  loadListViewPreferences,
  saveListViewPreferences,
} from '../src/utils/listViewPreferences.js';

const fakeStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => { data[key] = String(value); },
  };
};

test('load returns empty preferences when storage is empty or corrupt', () => {
  assert.deepEqual(loadListViewPreferences(fakeStorage()), {});
  assert.deepEqual(loadListViewPreferences(fakeStorage({ [LIST_VIEW_STORAGE_KEY]: '{oops' })), {});
});

test('load normalizes a saved category state', () => {
  const storage = fakeStorage({
    [LIST_VIEW_STORAGE_KEY]: JSON.stringify({
      spells: {
        search: 'Мгновенная',
        filters: { level: { include: ['3'], exclude: [] } },
        sortField: 'level',
        sortDirection: 'desc',
        showFavorites: true,
      },
    }),
  });
  assert.deepEqual(loadListViewPreferences(storage).spells, {
    search: 'Мгновенная',
    filters: { level: { include: ['3'], exclude: [] } },
    sortField: 'level',
    sortDirection: 'desc',
    showFavorites: true,
  });
});

test('normalize rejects a sort field that is invalid for the category', () => {
  const result = normalizeListViewState({ sortField: 'challenge_rating' }, 'spells');
  assert.equal(result.sortField, 'name');
});

test('normalize drops malformed filters and invalid scalar values', () => {
  const result = normalizeListViewState({
    search: 42,
    filters: { level: { include: '3', exclude: [1, '2'] }, school: { include: ['Ограждение'] } },
    sortDirection: 'sideways',
    showFavorites: 'yes',
  }, 'spells');
  assert.deepEqual(result.filters, { school: { include: ['Ограждение'], exclude: [] } });
  assert.equal(result.search, '');
  assert.equal(result.sortDirection, 'asc');
  assert.equal(result.showFavorites, false);
  assert.deepEqual(Object.keys(result).sort(), Object.keys(defaultListViewState).sort());
});

test('save writes JSON under the shared key and survives a reload', () => {
  const storage = fakeStorage();
  const preferences = { spells: { ...defaultListViewState, sortField: 'level' } };
  saveListViewPreferences(preferences, storage);
  assert.equal(JSON.parse(storage.data[LIST_VIEW_STORAGE_KEY]).spells.sortField, 'level');
  assert.deepEqual(loadListViewPreferences(storage), preferences);
});
