import { statblocks } from '../data/statblocks.js';

const OMITTED_COMPACT_KEYS = [
  'description', 'image', 'legendary_actions', 'lair_actions',
  'lair_description', 'lore', 'habitat',
];

export function resolveStatblocks(entries = [], registry = statblocks) {
  if (!Array.isArray(entries)) return [];

  return entries.flatMap((entry) => {
    if (entry && typeof entry === 'object') return [{ ...entry }];
    if (typeof entry === 'string') {
      const found = registry[entry];
      return [found ? { ...found, id: entry } : { id: entry, missing: true }];
    }
    return [];
  });
}

export function compactStatblock(block) {
  const result = { ...block };
  for (const key of OMITTED_COMPACT_KEYS) {
    delete result[key];
  }
  return result;
}
