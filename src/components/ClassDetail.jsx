import { useState } from 'react';
import styles from './ClassDetail.module.css';

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

  // Безопасное получение массивов
  const features = Array.isArray(classData.features) ? classData.features : [];
  const subclasses = Array.isArray(classData.subclasses) ? classData.subclasses : [];

  // Группировка способностей по уровням
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

  // Рендер способностей с группами по уровням
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
          // Инициализируем состояние для уровня, если его нет
          if (openSections[sectionKey] === undefined) {
            openSections[sectionKey] = true;
          }
          
          return (
            <div key={level} className={styles.levelGroup}>
              <div 
                className={styles.levelHeader}
                onClick={() => toggleSection(sectionKey)}
              >
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
    // Объединяем, сортируем по уровню
    const combined = [...features, ...subclassFeatures];
    return combined.sort((a, b) => (a.level || 0) - (b.level || 0));
  };

  // Безопасное получение строк
  const primaryAbility = classData.primary_ability || '—';
  const savingThrows = Array.isArray(classData.saving_throws) ? classData.saving_throws : [];
  const hitDie = classData.hit_die || '—';
  const proficiencies = classData.proficiencies || {};
  const equipment = classData.equipment || '';

  // Безопасный рендер владений
  const renderProficiencies = () => {
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
  };

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
        <div><strong>Основная характеристика:</strong> {primaryAbility}</div>
        <div><strong>Спасброски:</strong> {savingThrows.length > 0 ? savingThrows.join(', ') : '—'}</div>
        <div><strong>Кость хитов:</strong> {hitDie}</div>
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
        {displayFeatures().length > 0 ? (
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
                  <td>{feature.level || '—'}</td>
                  <td>{feature.name || 'Без названия'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.emptyMessage}>Нет данных для таблицы</p>
        )}
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
      {equipment && (
        <div className={styles.section}>
          <div className={styles.sectionHeader} onClick={() => toggleSection('equipment')}>
            <h3>Снаряжение</h3>
            <span>{openSections.equipment ? '−' : '+'}</span>
          </div>
          {openSections.equipment && (
            <div className={styles.sectionContent}>
              <p>{equipment}</p>
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
