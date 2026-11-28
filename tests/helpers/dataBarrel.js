import path from 'node:path';

export function readImportSpecifiers(source) {
  const pattern = /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
  return [...source.matchAll(pattern)].map((m) => m[1] ?? m[2]);
}

export function resolvesToDataBarrel(file, specifier) {
  const barrel = path.resolve('src/data/index.js').replace(/\\/g, '/');
  const resolved = path.resolve(path.dirname(file), specifier).replace(/\\/g, '/');
  return resolved === barrel || resolved === barrel.replace(/\/index\.js$/, '');
}
