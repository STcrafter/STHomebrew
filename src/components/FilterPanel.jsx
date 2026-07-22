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

  const handleCheckboxChange = (field, value, checked) => {
    const current = options[field]?.selected || [];
    const newSelected = checked
      ? [...current, value]
      : current.filter(v => v !== value);
    onFilterChange(field, newSelected.length > 0 ? newSelected : null);
    if (options[field]) {
      options[field].selected = newSelected;
    }
  };

  return (
    <div className={styles.panel}>
      <h3>Фильтры</h3>
      {Object.entries(options).map(([field, values]) => {
        if (typeof values === 'object' && !Array.isArray(values)) return null;
        const selected = options[field]?.selected || [];
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
                {displayValues.map((val) => (
                  <label key={val} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={selected.includes(String(val))}
                      onChange={(e) => handleCheckboxChange(field, String(val), e.target.checked)}
                    />
                    {val}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
