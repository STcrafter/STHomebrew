import { useState } from 'react';
import styles from './FilterPanel.module.css';
import { fieldLabels } from '../utils/fieldLabels';

export default function FilterPanel({ options, selected = {}, onFilterChange, labels = {} }) {
  const [openSections, setOpenSections] = useState({});
  const mergedLabels = { ...fieldLabels, ...labels }; 

  const toggleSection = (field) => {
    setOpenSections(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Циклическое переключение: выкл → включить → исключить → выкл
  const handleCheckboxChange = (field, value) => {
    const current = selected[field] || { include: [], exclude: [] };
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
  };
  const getState = (field, val) => {
    const state = selected[field] || { include: [], exclude: [] };
    if ((state.include || []).includes(val)) return 'include';
    if ((state.exclude || []).includes(val)) return 'exclude';
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
            <button
              type="button"
              className={styles.sectionHeader}
              aria-expanded={Boolean(openSections[field])}
              aria-controls={`filter-${field}`}
              onClick={() => toggleSection(field)}
            >
              <span>{mergedLabels[field] || field}</span>
              <span aria-hidden="true">{openSections[field] ? '−' : '+'}</span>
            </button>
            {openSections[field] && (
              <div id={`filter-${field}`} className={styles.sectionContent}>
                {displayValues.map((val) => {
                  const state = getState(field, String(val));
                  const stateLabel = state === 'include' ? 'включено' : state === 'exclude' ? 'исключено' : 'не выбрано';
                  return (
                    <button
                      key={val}
                      type="button"
                      className={`${styles.checkbox} ${styles[state]}`}
                      aria-label={`${val}: ${stateLabel}`}
                      onClick={() => handleCheckboxChange(field, String(val))}
                    >
                      <span className={styles.checkboxBox} aria-hidden="true">
                        {state === 'include' && '✓'}
                        {state === 'exclude' && '✕'}
                      </span>
                      {val}
                    </button>
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
