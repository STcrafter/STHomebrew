import { useState } from 'react';
import styles from './FilterPanel.module.css';

// Словарь перевода названий полей
const fieldLabels = {
  habitat: 'Места обитания',
  challenge_rating: 'Уровень опасности (ОП)',
  category: 'Тип существа',
  classes: 'Классы',
  level: 'Уровень заклинания',
  school: 'Школа магии',
  concentration: 'Концентрация',
  rarity: 'Редкость',
  type: 'Тип предмета',
  attunement: 'Настройка',
  ability: 'Увеличиваемая характеристика',  // ← добавляем
};

export default function FilterPanel({ options, onFilterChange }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (field) => {
    setOpenSections(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Циклическое переключение: выкл → включить → исключить → выкл
  const handleCheckboxChange = (field, value) => {
    const current = options[field]?.selected || { include: [], exclude: [] };
    const include = current.include || [];
    const exclude = current.exclude || [];

    let newState;
    if (include.includes(value)) {
      // было включено → исключаем
      newState = { include: include.filter(v => v !== value), exclude: [...exclude, value] };
    } else if (exclude.includes(value)) {
      // было исключено → выключаем
      newState = { include, exclude: exclude.filter(v => v !== value) };
    } else {
      // было выключено → включаем
      newState = { include: [...include, value], exclude };
    }

    const isEmpty = newState.include.length === 0 && newState.exclude.length === 0;
    onFilterChange(field, isEmpty ? null : newState);
    if (options[field]) {
      options[field].selected = newState;
    }
  };
  const getState = (field, val) => {
    const selected = options[field]?.selected || { include: [], exclude: [] };
    if ((selected.include || []).includes(val)) return 'include';
    if ((selected.exclude || []).includes(val)) return 'exclude';
    return 'off';
  };

  return (
    <div className={styles.panel}>
      <h3>Фильтры</h3>
      {Object.entries(options).map(([field, values]) => {
        if (typeof values === 'object' && !Array.isArray(values)) return null;
        const displayValues = Array.isArray(values) ? values : [];
        if (displayValues.length === 0) return null;

        return (
          <div key={field} className={styles.section}>
            <div className={styles.sectionHeader} onClick={() => toggleSection(field)}>
              <span>{fieldLabels[field] || field}</span>
              <span>{openSections[field] ? '−' : '+'}</span>
            </div>
            {openSections[field] && (
              <div className={styles.sectionContent}>
                {displayValues.map((val) => {
                  const state = getState(field, String(val));
                  return (
                    <label
                      key={val}
                      className={`${styles.checkbox} ${styles[state]}`}
                      onClick={() => handleCheckboxChange(field, String(val))}
                    >
                      <span className={styles.checkboxBox}>
                        {state === 'include' && '✓'}
                        {state === 'exclude' && '✕'}
                      </span>
                      {val}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
