import { categories } from '../config/categories.js';

const baseOptions = [{ field: 'name', label: 'По алфавиту' }];

export function getSortOptions(category) {
  const extras = categories[category]?.sort ?? [];
  return [...baseOptions, ...extras];
}

export function toggleSortDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}

function stringKey(value) {
  return String(value ?? '').toLowerCase();
}

function primaryKey(item, sortField) {
  if (sortField === 'level' || sortField === 'challenge_rating') {
    return Number(item[sortField] ?? 0);
  }
  if (sortField === 'classes') {
    const classes = Array.isArray(item.classes) ? item.classes.map(stringKey) : [];
    if (classes.length === 0) return '';
    return classes.reduce((min, current) => (min.localeCompare(current) <= 0 ? min : current));
  }
  return stringKey(item[sortField]);
}

export function sortItems(items, sortField, sortDirection) {
  const direction = sortDirection === 'desc' ? -1 : 1;
  const hasSecondaryName = sortField === 'level' || sortField === 'school' || sortField === 'classes';

  return [...items].sort((a, b) => {
    const keyA = primaryKey(a, sortField);
    const keyB = primaryKey(b, sortField);
    const primary = typeof keyA === 'number' ? keyA - keyB : keyA.localeCompare(keyB);
    if (primary !== 0) return primary * direction;
    if (!hasSecondaryName) return 0;
    return stringKey(a.name).localeCompare(stringKey(b.name));
  });
}
