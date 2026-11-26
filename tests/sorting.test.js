import test from 'node:test';
import assert from 'node:assert/strict';
import { getSortOptions, sortItems, toggleSortDirection } from '../src/utils/sorting.js';

const spells = [
  { name: 'Яблоко', level: 1, school: 'Эвокация', classes: ['Волшебник'] },
  { name: 'Бананы', level: 1, school: 'Некромантия', classes: ['Жрец', 'Волшебник'] },
  { name: 'Вишня', level: 2, school: 'Эвокация', classes: ['Жрец'] },
  { name: 'Груша', level: 10, school: 'Ограждение', classes: ['Друид'] },
  { name: 'Арбуз', level: 1, school: 'Некромантия', classes: [] },
];
const names = (items) => items.map((item) => item.name);

test('sorts levels numerically with names alphabetical inside a level', () => {
  const original = names(spells);
  assert.deepEqual(names(sortItems(spells, 'level', 'asc')), ['Арбуз', 'Бананы', 'Яблоко', 'Вишня', 'Груша']);
  assert.deepEqual(names(spells), original);
});

test('descending direction reverses groups but keeps names alphabetical', () => {
  assert.deepEqual(names(sortItems(spells, 'level', 'desc')), ['Груша', 'Вишня', 'Арбуз', 'Бананы', 'Яблоко']);
  assert.deepEqual(names(sortItems(spells, 'school', 'desc')), ['Вишня', 'Яблоко', 'Груша', 'Арбуз', 'Бананы']);
});

test('sorts schools alphabetically with names alphabetical inside a school', () => {
  assert.deepEqual(names(sortItems(spells, 'school', 'asc')), ['Арбуз', 'Бананы', 'Груша', 'Вишня', 'Яблоко']);
});

test('sorts by alphabetically first class', () => {
  assert.deepEqual(names(sortItems(spells, 'classes', 'asc')), ['Арбуз', 'Бананы', 'Яблоко', 'Груша', 'Вишня']);
});

test('does not throw on missing sort keys', () => {
  assert.doesNotThrow(() => sortItems([{ name: 'Без полей' }, { name: 'А' }], 'classes', 'asc'));
});

test('preserves name and challenge_rating sorting', () => {
  assert.deepEqual(names(sortItems([{ name: 'б' }, { name: 'А' }], 'name', 'asc')), ['А', 'б']);
  assert.deepEqual(
    names(sortItems([{ name: 'Б', challenge_rating: 1 }, { name: 'А', challenge_rating: 2 }], 'challenge_rating', 'asc')),
    ['Б', 'А'],
  );
});

test('getSortOptions returns category-specific options', () => {
  assert.deepEqual(getSortOptions('spells'), [
    { field: 'name', label: 'По алфавиту' },
    { field: 'level', label: 'По уровню' },
    { field: 'school', label: 'По школе' },
    { field: 'classes', label: 'По классу' },
  ]);
  assert.deepEqual(getSortOptions('monsters'), [
    { field: 'name', label: 'По алфавиту' },
    { field: 'challenge_rating', label: 'По опасности' },
  ]);
  assert.deepEqual(getSortOptions('items'), [{ field: 'name', label: 'По алфавиту' }]);
});

test('toggleSortDirection', () => {
  assert.equal(toggleSortDirection('asc'), 'desc');
  assert.equal(toggleSortDirection('desc'), 'asc');
});
