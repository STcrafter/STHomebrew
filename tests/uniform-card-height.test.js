import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('src/pages/CategoryList.module.css', 'utf8');

function rule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  assert.ok(match, `missing ${selector} rule in CategoryList.module.css`);
  return match[1];
}

test('virtualized grid items have a fixed height', () => {
  // VirtuosoGrid measures the first rendered item and uses that height for the
  // whole list. Variable-height cards make the scroll height change on scroll.
  assert.match(rule('.gridItem'), /height:\s*\d+px/);
  assert.match(rule('.card'), /height:\s*100%/);
  assert.match(rule('.card'), /overflow:\s*hidden/);
});

test('card text is clamped so it fits the fixed height', () => {
  assert.match(css, /-webkit-line-clamp:\s*\d+/);
  assert.match(rule('.meta'), /max-height:/);
  assert.match(rule('.meta span'), /text-overflow:\s*ellipsis/);
});
