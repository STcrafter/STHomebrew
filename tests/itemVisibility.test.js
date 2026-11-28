import test from 'node:test';
import assert from 'node:assert/strict';
import { isItemVisible } from '../src/utils/itemVisibility.js';

test('hidden items are invisible regardless of category', () => {
  assert.equal(isItemVisible({ id: 'a' }), true);
  assert.equal(isItemVisible({ id: 'b', hidden: true }), false);
  assert.equal(isItemVisible({ id: 'c', hidden: false }), true);
});
