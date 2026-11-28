import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { data } from '../src/data/index.js';

const html = fs.readFileSync('dist/index.html', 'utf8');
const configuredBase = process.env.VITE_BASE_PATH || '/STHomebrew/';
const base = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
const entryFiles = [...html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)].map((match) => {
  const src = match[1].startsWith(base) ? match[1].slice(base.length) : match[1];
  return path.join('dist', src.replace(/^\/+/, ''));
});

assert.ok(entryFiles.length > 0, 'dist/index.html has no JavaScript entry');
for (const file of entryFiles) {
  assert.ok(fs.existsSync(file), `entry chunk is missing: ${file}`);
}

function escapedNeedle(value) {
  return [...value].map((char) => {
    const code = char.codePointAt(0);
    return code > 127 ? `\\u${code.toString(16).padStart(4, '0')}` : char;
  }).join('');
}

function chunkHasNeedle(source, needle) {
  const haystack = source.toLowerCase();
  return haystack.includes(needle.toLowerCase()) || haystack.includes(escapedNeedle(needle).toLowerCase());
}

const monsterNeedle = data.monsters[0].name;
const spellNeedle = data.spells[0].name;
const entryNames = new Set(entryFiles.map((file) => path.basename(file)));
const monsterChunks = [];
const spellChunks = [];
const mixedChunks = [];

for (const file of fs.readdirSync('dist/assets')) {
  if (!file.endsWith('.js')) continue;
  const source = fs.readFileSync(path.join('dist/assets', file), 'utf8');
  const hasMonster = chunkHasNeedle(source, monsterNeedle);
  const hasSpell = chunkHasNeedle(source, spellNeedle);
  if (hasMonster) monsterChunks.push(file);
  if (hasSpell) spellChunks.push(file);
  if (hasMonster && hasSpell) mixedChunks.push(file);
}

assert.equal(
  monsterChunks.filter((file) => entryNames.has(file)).length,
  0,
  `monster data leaked into an entry chunk: ${monsterChunks.filter((file) => entryNames.has(file)).join(', ')}`
);
assert.ok(monsterChunks.length > 0, 'no chunk contains the monster data needle');
assert.deepEqual(mixedChunks, [], `chunks containing both datasets: ${mixedChunks.join(', ')}`);

console.log(`entry chunks: ${[...entryNames].join(', ')}`);
console.log(`monster data chunks: ${monsterChunks.join(', ')}`);
console.log(`spell data chunks: ${spellChunks.join(', ')}`);
