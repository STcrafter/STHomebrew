import React from 'react';
import { tables } from '../data/tables.js';

/**
 * Русские склонения: ['запись', 'записи', 'записей'].
 */
export const pluralizeRu = (count, forms) => {
  const n = Math.abs(Number(count)) % 100;
  const last = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
};

/**
 * Форматирует значение Challenge Rating для отображения
 * 0.125 → 1/8
 * 0.25 → 1/4
 * 0.5 → 1/2
 * 1 → 1
 * 2 → 2
 * и т.д.
 */
export const formatChallengeRating = (cr) => {
  if (cr === undefined || cr === null) return '—';
  
  const num = Number(cr);
  if (isNaN(num)) return String(cr);

  // Дробные значения
  if (num === 0.125) return '1/8';
  if (num === 0.25) return '1/4';
  if (num === 0.5) return '1/2';

  // Целые числа и остальные
  return String(num);
};
/**
 * Возвращает бонус мастерства для заданного CR
 */
export const getProficiencyBonusForCR = (cr) => {
  const num = Number(cr);
  if (isNaN(num)) return 2;
  if (num <= 4) return 2;
  if (num <= 8) return 3;
  if (num <= 12) return 4;
  if (num <= 16) return 5;
  if (num <= 20) return 6;
  if (num <= 24) return 7;
  if (num <= 28) return 8;
  if (num <= 30) return 9;
  return 2; // fallback
};

/**
 * Возвращает опыт (XP) для заданного CR
 */
export const getXPForCR = (cr) => {
  const xpTable = {
    0: 10,
    0.125: 25,
    0.25: 50,
    0.5: 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900,
    11: 7200,
    12: 8400,
    13: 10000,
    14: 11500,
    15: 13000,
    16: 15000,
    17: 18000,
    18: 20000,
    19: 22000,
    20: 25000,
    21: 33000,
    22: 41000,
    23: 50000,
    24: 62000,
    25: 75000,
    26: 90000,
    27: 105000,
    28: 120000,
    29: 135000,
    30: 155000,
  };
  return xpTable[cr] !== undefined ? xpTable[cr] : 0;
};

/**
 * Форматирует строку ОП с бонусом мастерства и опытом
 */
export const formatCRWithDetails = (cr) => {
  if (cr === undefined || cr === null) return '—';
  const display = formatChallengeRating(cr);
  const pb = getProficiencyBonusForCR(cr);
  const xp = getXPForCR(cr);
  return `${display} (+${pb} БМ, ${xp} XP)`;
};

/**
 * Возвращает цвет для индикатора опасности
 */
export const getDangerColor = (cr) => {
  const num = Number(cr);
  if (isNaN(num)) return '#6c757d';
  if (num < 1) return '#28a745';   // зелёный
  if (num <= 4) return '#ffc107';  // жёлтый
  if (num <= 10) return '#fd7e14'; // оранжевый
  if (num <= 15) return '#dc3545'; // красный
  if (num <= 20) return '#9b1d4c'; // тёмно-красный
  return '#6f2da8';               // фиолетовый
};

/**
 * Генерирует стандартное описание легендарных действий
 * @param {string} name - имя существа
 * @param {number} uses - количество использований
 * @param {number|null} lairUses - количество использований в логове (опционально)
 * @returns {string} полное описание
 */
export const generateLegendaryDescription = (name, uses, lairUses = null) => {
  if (!uses) return '';
  const base = `Использований легендарных действий: ${uses}`;
  const lairPart = lairUses ? ` (${lairUses} в логове)` : '';
  const actionPart = `Сразу после хода другого существа ${name} может потратить 1 использование, чтобы выполнить одно из следующих действий.`;
  const restorePart = `${name} восстанавливает все потраченные использования в начале своего хода.`;
  return `${base}${lairPart}. ${actionPart} ${restorePart}`;
};

/**
 * Разбивает текст на строки, заменяя \n на <br />. React сам экранирует текст.
 */
const renderTextLines = (text, keyPrefix) => text.split('\n').flatMap((line, index) => {
  const nodes = [];
  if (index > 0) {
    nodes.push(React.createElement('br', { key: `${keyPrefix}-br-${index}` }));
  }
  if (line) nodes.push(line);
  return nodes;
});

/**
 * Токенизирует один абзац: [tooltip: текст] → маркер, **жирный** → <strong>.
 * Текст подсказки остаётся обычным текстом атрибута data-tip.
 */
const renderParagraphText = (text, keyPrefix) => {
  const nodes = [];
  const tooltipRegex = /\[tooltip:([^\]]*)\]/g;
  let lastIndex = 0;
  let match;
  let segmentIndex = 0;

  const renderChunk = (chunk, keyBase) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    let boldLast = 0;
    let boldMatch;
    let piece = 0;

    while ((boldMatch = boldRegex.exec(chunk)) !== null) {
      const key = `${keyBase}-${piece++}`;
      if (boldMatch.index > boldLast) {
        nodes.push(...renderTextLines(chunk.slice(boldLast, boldMatch.index), `${key}-t`));
      }
      nodes.push(React.createElement(
        'strong',
        { key: `${key}-strong` },
        ...renderTextLines(boldMatch[1], `${key}-s`)
      ));
      boldLast = boldMatch.index + boldMatch[0].length;
    }
    if (boldLast < chunk.length) {
      nodes.push(...renderTextLines(chunk.slice(boldLast), `${keyBase}-${piece}-t`));
    }
  };

  while ((match = tooltipRegex.exec(text)) !== null) {
    renderChunk(text.slice(lastIndex, match.index), `${keyPrefix}-s${segmentIndex++}`);
    nodes.push(React.createElement(
      'span',
      {
        key: `${keyPrefix}-tooltip-${segmentIndex++}`,
        className: 'formatted-tooltip',
        tabIndex: 0,
        'data-tip': match[1].trim(),
      },
      'i'
    ));
    lastIndex = match.index + match[0].length;
  }
  renderChunk(text.slice(lastIndex), `${keyPrefix}-s${segmentIndex}`);
  return nodes;
};

/**
 * Собирает абзацы из текста с Markdown-подобной разметкой.
 * Поддерживает **жирный**, [tooltip: текст], \n\n и \n → <br />.
 * prefixNode добавляется в начало первого абзаца.
 */
const renderParagraphs = (text, keyPrefix, prefixNode = null) => {
  if (!text) return null;
  return text.split(/\n\n+/).map((paragraph, idx) =>
    React.createElement(
      'p',
      { key: `${keyPrefix}-p${idx}`, className: 'formatted-paragraph' },
      idx === 0 ? prefixNode : null,
      ...renderParagraphText(paragraph, `${keyPrefix}-p${idx}`)
    )
  );
};

const renderTable = (headers, rows, idx) => {
  const table = React.createElement(
    'table',
    { key: `table-${idx}`, className: 'formatted-table' },
    [
      React.createElement(
        'thead',
        { key: 'thead' },
        React.createElement(
          'tr',
          {},
          headers.map((header, i) =>
            React.createElement('th', { key: i }, header)
          )
        )
      ),
      React.createElement(
        'tbody',
        { key: 'tbody' },
        rows.map((row, i) =>
          React.createElement(
            'tr',
            { key: i },
            row.map((cell, j) =>
              React.createElement('td', { key: j }, cell)
            )
          )
        )
      )
    ]
  );
  return React.createElement('div', {
    key: `table-wrapper-${idx}`,
    className: 'formatted-table-wrapper',
  }, table);
};

export const renderFormattedText = (text, prefixNode = null) => {
  if (!text) return null;

  const tableRefRegex = /\[table:([^\]]+)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = tableRefRegex.exec(text)) !== null) {
    const tableId = match[1].trim();
    const before = text.slice(lastIndex, match.index);
    if (before.trim()) {
      parts.push({ type: 'text', content: before });
    }
    parts.push({ type: 'table-ref', id: tableId });
    lastIndex = match.index + match[0].length;
  }

  const after = text.slice(lastIndex);
  if (after.trim()) {
    parts.push({ type: 'text', content: after });
  }

  if (parts.every(p => p.type === 'text')) {
    return renderParagraphs(text, 'p', prefixNode);
  }

  let prefixUsed = false;
  return parts.flatMap((part, idx) => {
    if (part.type === 'table-ref') {
      const tableData = tables[part.id];
      if (tableData && tableData.headers && tableData.rows) {
        return renderTable(tableData.headers, tableData.rows, idx);
      } else {
        return React.createElement(
          'p',
          { key: `error-${idx}`, className: 'table-error' },
          `⚠️ Таблица «${part.id}» не найдена`
        );
      }
    } else {
      const prefix = prefixUsed ? null : prefixNode;
      prefixUsed = true;
      return renderParagraphs(part.content, `part-${idx}`, prefix);
    }
  });
};

/**
 * Рендерит особенность: название жирным курсивом + форматированное описание.
 * Название подставляется в первый абзац описания.
 */
export const renderFormattedFeature = (name, description) => {
  if (!name && !description) return null;

  // Если описания нет — выводим только название (React экранирует текст сам)
  if (!description) {
    return React.createElement('div', {
      className: 'formatted-feature',
    }, React.createElement('em', null,
      React.createElement('strong', null, `${name}.`)
    ));
  }

  // Разделяем описание на абзацы, в первый подставляем название
  const paragraphs = description.split(/\n\n+/);
  const firstParagraph = `<em><strong>${name}.</strong></em> ${paragraphs[0]}`;
  const rest = paragraphs.slice(1);
  const combined = [firstParagraph, ...rest].join('\n\n');

  return React.createElement(
    'div',
    { className: 'formatted-feature' },
    ...renderFormattedText(combined)
  );
};