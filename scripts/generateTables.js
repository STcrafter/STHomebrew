import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tablesDir = path.join(__dirname, '../src/data/tables');
const outputFile = path.join(__dirname, '../src/data/tables.js');

if (!fs.existsSync(tablesDir)) {
  fs.mkdirSync(tablesDir, { recursive: true });
}

function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseRow = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(line => parseRow(line));
  return { headers, rows };
}

const files = fs.readdirSync(tablesDir).filter(f => f.endsWith('.csv'));
const tables = {};

files.forEach(file => {
  const filePath = path.join(tablesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { headers, rows } = parseCSV(content);
  if (headers.length === 0 || rows.length === 0) {
    console.warn(`Файл ${file} не содержит данных, пропускаем`);
    return;
  }
  const tableId = path.basename(file, '.csv');
  tables[tableId] = { headers, rows };
  console.log(`✅ Добавлена таблица: ${tableId} (${rows.length} строк, ${headers.length} колонок)`);
});

const output = `export const tables = ${JSON.stringify(tables, null, 2)};`;
fs.writeFileSync(outputFile, output);
console.log(`✅ Generated tables.js from ${files.length} CSV files`);