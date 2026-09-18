import { Fragment, useMemo } from 'react';
import { tables } from '../data/tables.js';
import { parseMarkdown, parseInline } from '../utils/markdown.js';
import styles from './Markdown.module.css';

/** Превращает токены инлайновой разметки в React-элементы */
const renderInline = (text, keyPrefix) =>
  parseInline(text).map((token, index) => {
    const key = `${keyPrefix}-${index}`;

    switch (token.type) {
      case 'bold':
        return <strong key={key}>{token.value}</strong>;
      case 'italic':
        return <em key={key}>{token.value}</em>;
      case 'bolditalic':
        return (
          <strong key={key}>
            <em>{token.value}</em>
          </strong>
        );
      case 'tooltip':
        return (
          <span key={key} className={styles.tooltip} tabIndex={0} data-tip={token.value}>
            i
          </span>
        );
      case 'text':
      default:
        return token.value;
    }
  });

const renderParagraph = (text, key) => {
  const lines = text.split('\n');
  return (
    <p key={key} className={styles.paragraph}>
      {lines.map((line, lineIndex) => (
        <Fragment key={`${key}-l${lineIndex}`}>
          {lineIndex > 0 && <br />}
          {renderInline(line, `${key}-l${lineIndex}`)}
        </Fragment>
      ))}
    </p>
  );
};

const renderTable = (headers, rows, key) => (
  <div key={key} className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={`${key}-h${i}`}>{renderInline(header, `${key}-h${i}`)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`${key}-r${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td key={`${key}-r${rowIndex}c${cellIndex}`}>
                {renderInline(cell, `${key}-r${rowIndex}c${cellIndex}`)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const renderBlock = (block, index) => {
  const key = `block-${index}`;

  switch (block.type) {
    case 'heading': {
      // # → h2, ## → h3, ### → h4 (h1 занят заголовком страницы)
      const Tag = `h${block.level + 1}`;
      return (
        <Tag key={key} className={styles[`heading${block.level}`]}>
          {renderInline(block.text, `${key}-text`)}
        </Tag>
      );
    }
    case 'tableRef': {
      const tableData = tables[block.id];
      if (!tableData || !tableData.headers || !tableData.rows) {
        return (
          <p key={key} className={styles.tableError}>
            {`⚠️ Таблица "${block.id}" не найдена`}
          </p>
        );
      }
      return renderTable(tableData.headers, tableData.rows, key);
    }
    case 'table':
      return renderTable(block.headers, block.rows, key);
    case 'paragraph':
    default:
      return renderParagraph(block.text, key);
  }
};

/**
 * Рендерит markdown-подобный текст страницы (например, хоумрула) как документ.
 * Возможности разметки описаны в src/utils/markdown.js
 */
export default function Markdown({ content, className = '' }) {
  const blocks = useMemo(() => parseMarkdown(content), [content]);

  if (blocks.length === 0) return null;

  return (
    <div className={`${styles.markdown} ${className}`.trim()}>
      {blocks.map(renderBlock)}
    </div>
  );
}