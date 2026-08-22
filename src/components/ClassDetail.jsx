import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './ClassDetail.module.css';

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
  const tables = Array.isArray(classData.tables) ? classData.tables : [];

  const handleFeatureClick = (level) => {
    if (!openSections.features) {
      setOpenSections(prev => ({ ...prev, features: true }));
    }
    const levelKey = `level_${level}`;
    setOpenSections(prev => ({ ...prev, [levelKey]: true }));
    setTimeout(() => {
      const el = document.getElementById(`level-${level}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const displayFeatures = useMemo(() => {
    const baseFeatures = features.map(f => ({ ...f, isSubclass: false }));
    if (!selectedSubclass) {
      return baseFeatures;
    }
    const subclass = subclasses.find(s => s.name === selectedSubclass);
    if (!subclass) return baseFeatures;
    const subclassFeatures = (subclass.features || []).map(f => ({ ...f, isSubclass: true }));
    return [...baseFeatures, ...subclassFeatures].sort((a, b) => (a.level || 0) - (b.level || 0));
  }, [features, subclasses, selectedSubclass]);

  const getFeaturesForLevel = (level) => {
    return displayFeatures.filter(f => Number(f.level) === Number(level));
  };

  const groupFeaturesByLevel = () => {
    const groups = {};
    displayFeatures.forEach(f => {
      const level = f.level || 0;
      if (!groups[level]) groups[level] = [];
      groups[level].push(f);
    });
    return Object.keys(groups).sort((a, b) => Number(a) - Number(b));
  };

  const renderFeatures = () => {
    const levels = groupFeaturesByLevel();
    if (levels.length === 0) {
      return <p className={styles.emptyMessage}>Нет способностей для отображения</p>;
    }
    return (
      <div className={styles.featuresContainer}>
        <h3>Способности</h3>
        {levels.map(level => {
          const levelFeatures = displayFeatures.filter(f => Number(f.level) === Number(level));
          const sectionKey = `level_${level}`;
          if (openSections[sectionKey] === undefined) {
            openSections[sectionKey] = true;
          }
          return (
            <div key={level} id={`level-${level}`} className={styles.levelGroup}>
              <div className={styles.levelHeader} onClick={() => toggleSection(sectionKey)}>
                <span>{level} уровень</span>
                <span>{openSections[sectionKey] ? '−' : '+'}</span>
              </div>
              {openSections[sectionKey] && (
                <div className={styles.levelContent}>
                  {levelFeatures.map((feature, idx) => (
                    <div key={idx} className={`${styles.featureItem} ${feature.isSubclass ? styles.subclassFeature : ''}`}>
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

  const getTableRow = (level) => {
    return classTable.find(row => Number(row.level) === Number(level));
  };

  const extraColumns = () => {
    if (classTable.length === 0) return [];
    const firstRow = classTable[0];
    return Object.keys(firstRow).filter(key => key !== 'level');
  };

  const renderStandardTable = () => {
    const levels = Array.from({ length: 20 }, (_, i) => i + 1);
    const extraCols = extraColumns();
    return (
      <table key={selectedSubclass || 'base'}>
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
              <tr
                key={level}
                onClick={() => handleFeatureClick(level)}
                className={styles.tableRowClickable}
              >
                <td>{level}</td>
                <td>
                  {features.length > 0 ? (
                    features.map((f, idx) => (
                      <span key={idx} className={f.isSubclass ? styles.subclassFeatureInTable : ''}>
                        {f.name}
                        {idx < features.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  ) : (
                    '—'
                  )}
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

  const renderCustomTables = () => {
    if (tables.length === 0) return null;
    return tables.map((table, index) => (
      <div key={index} className={styles.customTable}>
        <h4>{table.title || `Таблица ${index + 1}`}</h4>
        <table>
          <thead>
            <tr>
              {table.headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderProficiencies = () => {
    const prof = classData.proficiencies || {};
    if (Object.keys(prof).length === 0) {
      return <p className={styles.emptyMessage}>Нет данных о владениях</p>;
    }
    return (
      <>
        {prof.armor && Array.isArray(prof.armor) && (
          <div><strong>Доспехи:</strong> {prof.armor.join(', ')}</div>
        )}
        {prof.weapons && Array.isArray(prof.weapons) && (
          <div><strong>Оружие:</strong> {prof.weapons.join(', ')}</div>
        )}
        {prof.tools && Array.isArray(prof.tools) && (
          <div><strong>Инструменты:</strong> {prof.tools.join(', ')}</div>
        )}
        {prof.saving_throws && Array.isArray(prof.saving_throws) && (
          <div><strong>Спасброски:</strong> {prof.saving_throws.join(', ')}</div>
        )}
        {prof.skills && (
          <div>
            <strong>Навыки:</strong>
            {prof.skills.choices
              ? ` выберите ${prof.skills.choices} из: ${prof.skills.options?.join(', ') || ''}`
              : (Array.isArray(prof.skills) ? prof.skills.join(', ') : '—')
            }
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.classPage}>
      {/* Картинка, название, описание */}
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

      {/* Подклассы */}
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

      {/* ===== ТАБЛИЦЫ — ТОЛЬКО ОДИН РАЗ ===== */}
      {tables.length === 0 ? (
        <div className={styles.classTable}>
          <h3>Таблица классов</h3>
          {renderStandardTable()}
        </div>
      ) : (
        <div className={styles.customTables}>
          <h3>Таблицы</h3>
          {renderCustomTables()}
        </div>
      )}
      {/* ===== Прислужники (миньоны) ===== */}
{Array.isArray(classData.minions) && classData.minions.length > 0 && (
  <div className={styles.minionsSection}>
    <h3>Прислужники</h3>
    <div className={styles.minionsGrid}>
      {classData.minions.map((minion, index) => (
        <div key={index} className={styles.minionCard}>
          {minion.image && (
            <img src={minion.image} alt={minion.name} className={styles.minionImage} />
          )}
          <div className={styles.minionContent}>
            <h4>{minion.name}</h4>
            <p>{minion.description}</p>
            {minion.statblock_id ? (
              <Link to={`/category/monsters/${minion.statblock_id}`} className={styles.minionLink}>
                → Открыть статблок
              </Link>
            ) : (
              <span className={styles.minionNoLink}>Статблок не задан</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
      {/* Владения */}
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

      {/* Снаряжение */}
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

      {/* Способности — только описания, без таблиц */}
      <div className={styles.section}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('features')}>
          <h3>Способности</h3>
          <span>{openSections.features ? '−' : '+'}</span>
        </div>
        {openSections.features && (
          <div className={styles.sectionContent}>
            {renderFeatures()}   {/* <-- только renderFeatures(), без таблиц */}
          </div>
        )}
      </div>
    </div>
  );
}