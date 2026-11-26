import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveStatblocks, compactStatblock } from '../src/utils/statblocks.js';
import spells from '../src/data/spells.js';

test('spg_conj_3 exposes an inline statblock that compacts', () => {
  const spell = spells.find((entry) => entry.id === 'spg_conj_3');
  const [block] = resolveStatblocks(spell.statblocks);
  assert.equal(block.missing, undefined);
  assert.equal(block.name, 'Мгновенная баррикада');
  const compact = compactStatblock(block);
  assert.equal(compact.name, 'Мгновенная баррикада');
  assert.equal(compact.type, 'Предмет переменного размера');
  assert.equal(compact.armor_class, '12 + уровень заклинания');
  assert.equal(compact.hit_points, '10 × уровень заклинания');
  assert.deepEqual(compact.damage_immunities, ['Яд', 'Психика']);
  assert.equal(compact.actions[0].name, 'Взрывная разборка');
});

test('resolveStatblocks returns [] when spell has no statblocks', () => {
  assert.deepEqual(resolveStatblocks(undefined), []);
});

test('resolveStatblocks passes an inline object through', () => {
  const inline = { id: 'spirit', name: 'Дух', armor_class: 12 };
  assert.deepEqual(resolveStatblocks([inline]), [inline]);
});

test('resolveStatblocks resolves a string from the registry', () => {
  const registry = { skeleton: { name: 'Скелет', hit_points: 13 } };
  assert.deepEqual(resolveStatblocks(['skeleton'], registry), [
    { id: 'skeleton', name: 'Скелет', hit_points: 13 },
  ]);
});

test('resolveStatblocks preserves mixed order', () => {
  const registry = { skeleton: { name: 'Скелет' } };
  const inline = { id: 'spirit', name: 'Дух' };
  assert.deepEqual(resolveStatblocks(['skeleton', inline], registry), [
    { id: 'skeleton', name: 'Скелет' },
    inline,
  ]);
});

test('resolveStatblocks marks unknown ids as missing', () => {
  assert.deepEqual(resolveStatblocks(['nope'], {}), [{ id: 'nope', missing: true }]);
});

test('resolveStatblocks marks prototype-key ids as missing', () => {
  assert.deepEqual(resolveStatblocks(['toString'], {}), [
    { id: 'toString', missing: true },
  ]);
});

test('compactStatblock removes story sections and keeps combat fields', () => {
  const block = {
    id: 'barricade',
    name: 'Мгновенная баррикада',
    type: 'Предмет переменного размера',
    armor_class: '12 + уровень заклинания',
    hit_points: '10 × уровень заклинания',
    damage_immunities: ['Яд', 'Психика'],
    challenge_rating: 0,
    actions: [{ name: 'Взрывная разборка', description: '...' }],
    description: 'длинное описание',
    image: '/image.png',
    legendary_actions: { uses: 3 },
    lair_actions: { description: '...' },
    lair_description: { description: '...' },
    lore: { title: 'Предания' },
    habitat: ['Горы'],
  };
  const result = compactStatblock(block);
  assert.equal(result.name, 'Мгновенная баррикада');
  assert.equal(result.armor_class, '12 + уровень заклинания');
  assert.equal(result.challenge_rating, 0);
  assert.deepEqual(result.actions, block.actions);
  for (const key of [
    'description', 'image', 'legendary_actions', 'lair_actions',
    'lair_description', 'lore', 'habitat',
  ]) {
    assert.equal(key in result, false, `${key} должен быть удалён`);
  }
});
