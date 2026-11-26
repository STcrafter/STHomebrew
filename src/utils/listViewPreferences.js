import { getSortOptions } from './sorting.js';

export const LIST_VIEW_STORAGE_KEY = 'listViewPreferences';

export const defaultListViewState = {
  search: '',
  filters: {},
  sortField: 'name',
  sortDirection: 'asc',
  showFavorites: false,
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeFilterState(state) {
  if (!isPlainObject(state)) return null;

  const result = {};
  for (const key of ['include', 'exclude']) {
    const values = state[key];
    if (values === undefined) {
      result[key] = [];
    } else if (Array.isArray(values)) {
      result[key] = values.filter((value) => typeof value === 'string');
    } else {
      return null;
    }
  }

  if (result.include.length === 0 && result.exclude.length === 0) return null;
  return result;
}

export function normalizeListViewState(value, category) {
  const result = { ...defaultListViewState };
  if (!isPlainObject(value)) return result;

  if (typeof value.search === 'string') result.search = value.search;
  if (typeof value.showFavorites === 'boolean') result.showFavorites = value.showFavorites;
  if (value.sortDirection === 'asc' || value.sortDirection === 'desc') {
    result.sortDirection = value.sortDirection;
  }

  const sortFields = getSortOptions(category).map((option) => option.field);
  if (sortFields.includes(value.sortField)) result.sortField = value.sortField;

  if (isPlainObject(value.filters)) {
    const filters = {};
    for (const [field, state] of Object.entries(value.filters)) {
      const normalized = normalizeFilterState(state);
      if (normalized) filters[field] = normalized;
    }
    result.filters = filters;
  }

  return result;
}

export function loadListViewPreferences(storage = globalThis.localStorage) {
  if (!storage || typeof storage.getItem !== 'function') return {};

  let raw;
  try {
    raw = storage.getItem(LIST_VIEW_STORAGE_KEY);
  } catch {
    return {};
  }
  if (raw == null) return {};

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!isPlainObject(parsed)) return {};

  const preferences = {};
  for (const [category, value] of Object.entries(parsed)) {
    preferences[category] = normalizeListViewState(value, category);
  }
  return preferences;
}

export function saveListViewPreferences(preferences, storage = globalThis.localStorage) {
  if (!storage || typeof storage.setItem !== 'function') return;
  try {
    storage.setItem(LIST_VIEW_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Storage can be unavailable or full; the list still works in memory.
  }
}
