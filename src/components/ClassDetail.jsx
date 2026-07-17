import { useState } from 'react';
import styles from './ClassDetail.module.css';

export default function ClassDetail({ classData }) {
  const [selectedSubclass, setSelectedSubclass] = useState(null);
  const [openSections, setOpenSections] = useState({
    features: true,
    proficiencies: false,
    equipment: false,
  });

  if (!classData) return null;

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const features = classData.features || [];
  const subclasses = classData.subclasses || [];

  // Группируем способности по уровням для вкладок
  const groupFeaturesByLevel = (featuresArray) => {
    const groups = {};
    featuresArray.forEach(f => {
      const level = f.level || 0;
      if (!groups[level]) groups[level] = [];
      groups[level].push(f);
    });
    // Сортируем уровни по возрастанию
    return Object.keys(groups).sort((a, b) => Number(a) - Number(b));
  };

  const renderFeatures = (featuresArray, title) => {
    const levels = groupFeaturesByLevel(featuresArray);
    return (
      <div className={styles.featuresContainer}>
        <h3>{title || 'Способности'}</h3>
        {levels.map(level => (
          <div key={level} className={styles.levelGroup}>
            <div 
              className={styles.levelHeader}
              onClick={() => toggleSection(`level_${level}`)}
            >
              <span>{level} уровень</span>
              <span>{openSections[`level_${level}`] !== false ? '−' : '+'}</span>
            </div>
            {openSections[`level_${level}`] !== false && (
              <div className={styles.levelContent}>
                {featuresArray.filter(f => f.level === Number(level)).map((feature, idx) => (
                  <div key={idx} className={styles.featureItem}>
                    <div className={styles.featureName}>{feature.name}</div>
                    <div className={styles.featureDescription}>{feature.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Определяем, какие способности показывать (классовые + подклассовые, если выбран)
  const displayFeatures = () => {
    if (!selectedSubclass) {
      return features;
    }
    // Если выбран подкласс, показываем способности класса + подкласса (отсортированные по уровню)
    const subclassFeatures = subclasses.find(s => s.name === selectedSubclass)?.features || [];
    return [...features, ...subclassFeatures];
  };

  return (
    <div className={styles.classPage}>
      {/* Заголовок и картинка */}
      {classData.image && (
        <div className={styles.imageWrapper}>
          <img src={classData.image} alt={classData.name} className={styles.classImage} />
        </div>
      )}
      <h1 className={styles.className}>{classData.name}</h1>
      <div className={styles.classDescription}>
        <p>{classData.description}</p>
      </div>

      {/* Основные параметры */}
      <div className={styles.classStats}>
        <div><strong>Основная характеристика:</strong> {classData.primary_ability}</div>
        <div><strong>Спасброски:</strong> {classData.saving_throws?.join(', ') || '—'}</div>
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
              {subclasses.find(s => s.name === selectedSubclass)?.description}
            </div>
          )}
        </div>
      )}

      {/* Таблица классов */}
      <div className={styles.classTable}>
        <h3>Таблица классов</h3>
        <table>
          <thead>
            <tr>
              <th>Уровень</th>
              <th>Особенности</th>
            </tr>
          </thead>
          <tbody>
            {displayFeatures().map((feature, idx) => (
              <tr key={idx}>
                <td>{feature.level}</td>
                <td>{feature.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Владения (сворачиваемая секция) */}
      {classData.proficiencies && (
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('proficiencies')}>
            <h3>Владения</h3>
            <span>{openSections.proficiencies ? '−' : '+'}</span>
          </div>
          {openSections.proficiencies && (
            <div className={styles.sectionContent}>
              {classData.proficiencies.armor && (
                <div><strong>Доспехи:</strong> {classData.proficiencies.armor.join(', ')}</div>
              )}
              {classData.proficiencies.weapons && (
                <div><strong>Оружие:</strong> {classData.proficiencies.weapons.join(', ')}</div>
              )}
              {classData.proficiencies.tools && (
                <div><strong>Инструменты:</strong> {classData.proficiencies.tools.join(', ')}</div>
              )}
              {classData.proficiencies.saving_throws && (
                <div><strong>Спасброски:</strong> {classData.proficiencies.saving_throws.join(', ')}</div>
              )}
              {classData.proficiencies.skills && (
                <div>
                  <strong>Навыки:</strong> 
                  {classData.proficiencies.skills.choices 
                    ? ` выберите ${classData.proficiencies.skills.choices} из: ${classData.proficiencies.skills.options.join(', ')}`
                    : classData.proficiencies.skills.join(', ')
                  }
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
