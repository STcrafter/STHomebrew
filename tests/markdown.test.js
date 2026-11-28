import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdown } from '../src/utils/markdown.js';

test('inline table reference splits text into three blocks', () => {
  assert.deepEqual(parseMarkdown('до [table:ruinbound_mutations] после'), [
    { type: 'paragraph', text: 'до' },
    { type: 'tableRef', id: 'ruinbound_mutations' },
    { type: 'paragraph', text: 'после' },
  ]);
});

test('bold label directly before a table reference stays in a paragraph', () => {
  const blocks = parseMarkdown('**Мутации обреченного** [table:ruinbound_mutations]');
  assert.deepEqual(blocks, [
    { type: 'paragraph', text: '**Мутации обреченного**' },
    { type: 'tableRef', id: 'ruinbound_mutations' },
  ]);
});

test('several table references on one line are all parsed', () => {
  assert.deepEqual(parseMarkdown('[table:first] между [table:second]'), [
    { type: 'tableRef', id: 'first' },
    { type: 'paragraph', text: 'между' },
    { type: 'tableRef', id: 'second' },
  ]);
});

test('a standalone table reference produces no paragraph block', () => {
  assert.deepEqual(parseMarkdown('[table:spells]'), [
    { type: 'tableRef', id: 'spells' },
  ]);
});

test('heading and pipe-table rows are checked before inline references', () => {
  assert.deepEqual(parseMarkdown('# Заголовок [table:x]'), [
    { type: 'heading', level: 1, text: 'Заголовок [table:x]' },
  ]);
  assert.deepEqual(parseMarkdown('| A | B |\n| --- | --- |\n| x [table:y] | z |'), [
    { type: 'table', headers: ['A', 'B'], rows: [['x [table:y]', 'z']] },
  ]);
});
