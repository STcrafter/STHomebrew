/**
 * Разбор markdown-подобной разметки страниц (например, домашних правил).
 *
 * Поддерживается:
 * - заголовки трёх уровней: `#`, `##`, `###`
 * - абзацы через пустую строку, перенос строки внутри абзаца через `\n`
 * - `**жирный**`, `*курсив*`, `***жирный курсив***`
 * - pipe-таблицы в стиле markdown
 * - ссылки `[table:id]` на общие таблицы из data/tables.js
 * - `[tooltip: текст]` — подсказка
 *
 * Модуль не зависит от React — только разбор текста в структуры данных.
 */

export const INLINE_RE = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|\[tooltip:[^\]]*\])/g;

const HEADING_RE = /^(#{1,3})\s+(.+)$/;
const TABLE_REF_RE = /^\[table:([^\]]+)\]$/;
const TABLE_SEPARATOR_RE = /^\|[\s:|-]+\|$/;
const TOOLTIP_PREFIX = '[tooltip:';

/**
 * Разбирает инлайновую разметку в массив токенов:
 * { type: 'text' | 'bold' | 'italic' | 'bolditalic' | 'tooltip', value }
 */
export const parseInline = (text) => {
  const source = String(text ?? '');
  const tokens = [];
  let lastIndex = 0;
  let match;

  INLINE_RE.lastIndex = 0;
  while ((match = INLINE_RE.exec(source)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: source.slice(lastIndex, match.index) });
    }

    const token = match[0];
    if (token.startsWith('***')) {
      tokens.push({ type: 'bolditalic', value: token.slice(3, -3) });
    } else if (token.startsWith('**')) {
      tokens.push({ type: 'bold', value: token.slice(2, -2) });
    } else if (token.startsWith('*')) {
      tokens.push({ type: 'italic', value: token.slice(1, -1) });
    } else {
      tokens.push({ type: 'tooltip', value: token.slice(TOOLTIP_PREFIX.length, -1).trim() });
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < source.length) {
    tokens.push({ type: 'text', value: source.slice(lastIndex) });
  }

  return tokens;
};

/** Разбивает строку pipe-таблицы на ячейки */
export const splitTableRow = (line) =>
  String(line)
    .trim()
    .replace(/^\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((cell) => cell.trim());

/**
 * Разбирает текст на блоки:
 * - { type: 'heading', level, text }
 * - { type: 'paragraph', text }
 * - { type: 'table', headers, rows }
 * - { type: 'tableRef', id }
 */
export const parseMarkdown = (text) => {
  const lines = String(text ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    const value = paragraph.join('\n').trim();
    if (value) blocks.push({ type: 'paragraph', text: value });
    paragraph = [];
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    // Пустая строка — граница абзаца
    if (!line) {
      flushParagraph();
      i += 1;
      continue;
    }

    // Заголовок: #, ##, ###
    const heading = HEADING_RE.exec(line);
    if (heading) {
      flushParagraph();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      i += 1;
      continue;
    }

    // Ссылка на общую таблицу
    const tableRef = TABLE_REF_RE.exec(line);
    if (tableRef) {
      flushParagraph();
      blocks.push({ type: 'tableRef', id: tableRef[1].trim() });
      i += 1;
      continue;
    }

    // Pipe-таблица: строка | a | b | и следующая строка-разделитель | --- | --- |
    const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
    if (line.startsWith('|') && TABLE_SEPARATOR_RE.test(nextLine)) {
      flushParagraph();
      const headers = splitTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitTableRow(lines[i].trim()));
        i += 1;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    paragraph.push(line);
    i += 1;
  }

  flushParagraph();
  return blocks;
};