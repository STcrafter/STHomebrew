import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tablesDir = path.join(__dirname, '../src/data/tables');
const outputFile = path.join(__dirname, '../src/data/tables.js');

// Создаём папку tables, если её нет
if (!fs.existsSync(tablesDir)) {
  fs.mkdirSync(tablesDir, { recursive: true });
}

const files = fs.readdirSync(tablesDir).filter(f => f.endsWith('.csv'));

const tables = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(tablesDir, file), 'utf-8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return;

  // Заголовки — первая строка
  const headers = lines[0].split(',').map(h => h.trim());
  // Строки данных — все остальные
  const rows = lines.slice(1).map(line =>
    line.split(',').map(cell => cell.trim())
  );

  const tableId = path.basename(file, '.csv');
  tables[tableId] = { headers, rows };
});

const output = `export const tables = ${JSON.stringify(tables, null, 2)};`;
fs.writeFileSync(outputFile, output);
console.log(`✅ Generated tables.js from ${files.length} CSV files`);