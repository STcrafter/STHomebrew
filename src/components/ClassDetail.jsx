import { useState } from 'react';
import styles from './ClassDetail.module.css';

// Словарь перевода названий колонок
const columnLabels = {
  level: 'Уровень',
  proficiency_bonus: 'Бонус мастерства',
  dances: 'Танцы',
  dance_die: 'Кость танца',
};

export default function ClassDetail({ classData }) {
  const [selectedSubclass, setSelectedSubclass] = useState(null);
  const [openSections, setOpenSections] = useState({
    features: true,
    proficiencies: false,
    equipment: false,
  });

  if (!classData) return <div>Данные класса не найдены</div>;

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const features = Array.isArray(classData.features) ? classData.features : [];
  const subclasses = Array.isArray(classData.subclasses) ? classData.subclasses : [];
  const classTable = Array.isArray(classData.class_table) ? classData.class_table : [];

  // Группировка способностей по уровням для вкладки "Способности"
  const groupFeaturesByLevel = (featuresArray) => {
    if (!Array.isArray(featuresArray) || featuresArray.length === 0) return [];
    const groups = {};
    featuresArray.forEach(f => {
      const level = f.level || 0;
      if (!groups[level]) groups[level] = [];
      groups[level].push(f);
    });
    return Object.keys(groups).sort((a, b) => Number(a) - Number(b));
  };

  const renderFeatures = (featuresArray, title) => {
    if (!Array.isArray(featuresArray) || featuresArray.length === 0) {
      return <p className={styles.emptyMessage}>Нет способностей для отображения</p>;
    }
    const levels = groupFeaturesByLevel(featuresArray);
    return (
      <div className={styles.featuresContainer}>
        <h3>{title || 'Способности'}</h3>
        {levels.map(level => {
          const levelFeatures = featuresArray.filter(f => Number(f.level) === Number(level));
          const sectionKey = `level_${level}`;
          if (openSections[sectionKey] === undefined) {
            openSections[sectionKey] = true;
          }
          return (
            <div key={level} className={styles.levelGroup}>
              <div className={styles.levelHeader} onClick={() => toggleSection(sectionKey)}>
                <span>{level} уровень</span>
                <span>{openSections[sectionKey] ? '−' : '+'}</span>
              </div>
              {openSections[sectionKey] && (
                <div className={styles.levelContent}>
                  {levelFeatures.map((feature, idx) => (
                    <div key={idx} className={styles.featureItem}>
                      <div className={styles.featureName}>{feature.name || 'Без названия'}</div>
                      <div className={styles.featureDescription}>{feature.description || 'Описание отсутствует'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Определяем, какие способности показывать (классовые + подклассовые, если выбран)
  const displayFeatures = () => {
    if (!selectedSubclass) {
      return features;
    }
    const subclass = subclasses.find(s => s.name === selectedSubclass);
    const subclassFeatures = subclass?.features || [];
    const combined = [...features, ...subclassFeatures];
    return combined.sort((a, b) => (a.level || 0) - (b.level || 0));
  };

  // Получаем список уникальных уровней для таблицы
  const tableLevels = () => {
    if (classTable.length > 0) {
      // Если есть class_table, используем уровни из неё (обычно 1–20)
      return classTable.map(row => row.level).sort((a, b) => a - b);
    } else {
      // Иначе берём уровни из особенностей
      const levels = new Set();
      displayFeatures().forEach(f => levels.add(f.level || 0));
      return Array.from(levels).sort((a, b) => a - b);
    }
  };

  // Получаем особенности для конкретного уровня (для отображения в таблице)
  const getFeaturesForLevel = (level) => {
    return displayFeatures().filter(f => Number(f.level) === Number(level));
  };

  // Получаем данные из class_table для уровня
  const getTableRow = (level) => {
    return classTable.find(row => Number(row.level) === Number(level));
  };

  // Определяем колонки для таблицы (кроме level)
  const extraColumns = () => {
    if (classTable.length === 0) return [];
    const firstRow = classTable[0];
    return Object.keys(firstRow).filter(key => key !== 'level');
  };

  const renderTable = () => {
    const levels = tableLevels();
    if (levels.length === 0) {
      return <p className={styles.emptyMessage}>Нет данных для таблицы</p>;
    }

    const extraCols = extraColumns();

    return (
      <table>
        <thead>
          <tr>
            <th>Уровень</th>
            <th>Особенности</th>
            {extraCols.map(col => (
              <th key={col}>{columnLabels[col] || col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {levels.map(level => {
            const features = getFeaturesForLevel(level);
            const rowData = getTableRow(level);
            return (
              <tr key={level}>
                <td>{level}</td>
                <td>
                  {features.length > 0 ? features.map(f => f.name).join(', ') : '—'}
                </td>
                {extraCols.map(col => (
                  <td key={col}>{rowData ? rowData[col] : '—'}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  // ... остальной код (рендер владений, снаряжения и т.д.) без изменений ...

  return (
    <div className={styles.classPage}>
      {/* Заголовок и картинка */}
      {classData.image && (
        <div className={styles.imageWrapper}>
          <img
            src={classData.image}
            alt={classData.name || 'Класс'}
            className={styles.classImage}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}
      <h1 className={styles.className}>{classData.name || 'Без названия'}</h1>
      <div className={styles.classDescription}>
        <p>{classData.description || 'Описание отсутствует'}</p>
      </div>

      {/* Основные параметры */}
      <div className={styles.classStats}>
        <div><strong>Основная характеристика:</strong> {classData.primary_ability || '—'}</div>
        <div><strong>Спасброски:</strong> {Array.isArray(classData.saving_throws) ? classData.saving_throws.join(', ') : '—'}</div>
        <div><strong>Кость хитов:</strong> {classData.hit_die || '—'}</div>
      </div>

      {/* Выпадающий список подклассов */}
      {subclasses.length > 0 && (
        <div className={styles.subclassSelector}>
          <label>Подкласс:</label>
          <select
            value={selectedSubclass || ''}
            onChange={(e) => setSelectedSubclass(e.target.value || null)}
          >
            <option value="">Без подкласса</option>
            {subclasses.map((sub, idx) => (
              <option key={idx} value={sub.name}>{sub.name}</option>
            ))}
          </select>
          {selectedSubclass && (
            <div className={styles.subclassDescription}>
              {subclasses.find(s => s.name === selectedSubclass)?.description || 'Описание подкласса отсутствует'}
            </div>
          )}
        </div>
      )}

      {/* Таблица классов */}
      <div className={styles.classTable}>
        <h3>Таблица классов</h3>
        {renderTable()}
      </div>

      {/* Владения (сворачиваемая секция) */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('proficiencies')}>
          <h3>Владения</h3>
          <span>{openSections.proficiencies ? '−' : '+'}</span>
        </div>
        {openSections.proficiencies && (
          <div className={styles.sectionContent}>
            {renderProficiencies()}
          </div>
        )}
      </div>

      {/* Снаряжение (сворачиваемая секция) */}
      {classData.equipment && (
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('equipment')}>
            <h3>Снаряжение</h3>
            <span>{openSections.equipment ? '−' : '+'}</span>
          </div>
          {openSections.equipment && (
            <div className={styles.sectionContent}>
              <p>{classData.equipment}</p>
            </div>
          )}
        </div>
      )}

      {/* Способности (сворачиваемая секция) */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('features')}>
          <h3>Способности</h3>
          <span>{openSections.features ? '−' : '+'}</span>
        </div>
        {openSections.features && (
          <div className={styles.sectionContent}>
            {renderFeatures(displayFeatures(), 'Способности')}
          </div>
        )}
      </div>
    </div>
  );
}

// Функция renderProficiencies (остаётся как была)
function renderProficiencies(proficiencies) {
  if (!proficiencies || Object.keys(proficiencies).length === 0) {
    return <p className={styles.emptyMessage}>Нет данных о владениях</p>;
  }
  return (
    <>
      {proficiencies.armor && Array.isArray(proficiencies.armor) && (
        <div><strong>Доспехи:</strong> {proficiencies.armor.join(', ')}</div>
      )}
      {proficiencies.weapons && Array.isArray(proficiencies.weapons) && (
        <div><strong>Оружие:</strong> {proficiencies.weapons.join(', ')}</div>
      )}
      {proficiencies.tools && Array.isArray(proficiencies.tools) && (
        <div><strong>Инструменты:</strong> {proficiencies.tools.join(', ')}</div>
      )}
      {proficiencies.saving_throws && Array.isArray(proficiencies.saving_throws) && (
        <div><strong>Спасброски:</strong> {proficiencies.saving_throws.join(', ')}</div>
      )}
      {proficiencies.skills && (
        <div>
          <strong>Навыки:</strong>
          {proficiencies.skills.choices
            ? ` выберите ${proficiencies.skills.choices} из: ${proficiencies.skills.options?.join(', ') || ''}`
            : (Array.isArray(proficiencies.skills) ? proficiencies.skills.join(', ') : '—')
          }
        </div>
      )}
    </>
  );
}
