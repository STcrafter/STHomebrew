import { useParams, Link } from 'react-router-dom';
import { data } from '../data';
import { useState } from 'react';
import styles from './ItemDetail.module.css';
import StatBlock from '../components/StatBlock';
import ClassDetail from '../components/ClassDetail';
import FavoriteButton from '../components/FavoriteButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { renderFormattedText, renderFormattedFeature } from '../utils/helpers';

export default function ItemDetail() {
  const { category, id } = useParams();
  const items = data[category] || [];
  const item = items.find(it => it.id === id);
  const [openVariants, setOpenVariants] = useState({});
  // Навигация Prev/Next (по алфавиту)
  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));
  const currentIndex = sortedItems.findIndex(i => i.id === id);
  const prevItem = currentIndex > 0 ? sortedItems[currentIndex - 1] : null;
  const nextItem = currentIndex < sortedItems.length - 1 ? sortedItems[currentIndex + 1] : null;

  if (!item) {
    return (
      <div className={styles.notFound}>
        <h2>Объект не найден</h2>
        <Link to={`/category/${category}`}>← Вернуться к списку</Link>
      </div>
    );
  }

  const renderDetails = () => {
    switch (category) {
      case 'monsters':
        return (
          <>
            {item.image && (
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} className={styles.detailImage} />
              </div>
            )}
            <div className={styles.description}>
              <h3>Описание</h3>
              {renderFormattedText(item.description)}
            </div>
            <StatBlock monster={item} />
            {item.tags && (
              <div className={styles.tags}>
                <h3>Теги</h3>
                <div className={styles.tagList}>
                  {item.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                </div>
              </div>
            )}
          </>
        );

      case 'spells':
        return (
          <>
            <div className={styles.spellMeta}>
              <div><strong>Уровень:</strong> {item.level}</div>
              <div><strong>Школа:</strong> {item.school}</div>
              <div><strong>Время произнесения:</strong> {item.casting_time}</div>
              <div><strong>Дистанция:</strong> {item.range}</div>
              <div><strong>Длительность:</strong> {item.duration}</div>
              <div><strong>Компоненты:</strong> {item.components}</div>
              <div><strong>Концентрация:</strong> {item.concentration ? 'Да' : 'Нет'}</div>
              <div><strong>Доступен классам:</strong> {item.classes.join(', ')}</div>
            </div>
            <div className={styles.description}>
              <h3>Описание</h3>
              {renderFormattedText(item.description)}
              {item.higher_levels && (
                <>
                  <h3>На более высоких уровнях</h3>
                  {renderFormattedText(item.higher_levels)}
                </>
              )}
            </div>
          </>
        );

      case 'classes':
        return (
          <div className={styles.classPageWrapper}>
            <ClassDetail classData={item} />
          </div>
        );

      case 'races':
  return (
    <div className={styles.racePage}>
      {/* Картинка */}
      {item.image && (
        <div className={styles.imageWrapper}>
          <img src={item.image} alt={item.name} className={styles.detailImage} />
        </div>
      )}

      {/* Базовые параметры расы */}
      <div className={styles.raceStats}>
        {item.creatureType && <div><strong>Тип:</strong> {item.creatureType}</div>}
        {item.size && <div><strong>Размер:</strong> {item.size}</div>}
        {item.speed && <div><strong>Скорость:</strong> {item.speed}</div>}
        {item.vision && <div><strong>Зрение:</strong> {item.vision}</div>}
      </div>

      {/* Общее описание */}
      <div className={styles.description}>
        <h3>Описание</h3>
        {renderFormattedText(item.description)}
      </div>

      {/* Общие особенности */}
      {Array.isArray(item.commonFeatures) && item.commonFeatures.length > 0 && (
        <div className={styles.raceFeatures}>
          <h3>Общие особенности</h3>
          {item.commonFeatures.map((feat, i) => (
            <div key={i} className={styles.raceFeature}>
              {renderFormattedFeature(feat.name, feat.description)}
            </div>
          ))}
        </div>
      )}

      {/* Варианты (подрасы) — раскрывающиеся блоки */}
      {Array.isArray(item.variants) && item.variants.length > 0 && (
        <div className={styles.variantsSection}>
          <h3>Варианты</h3>
          {item.variants.map((variant, i) => {
            const sectionKey = `variant_${variant.id || i}`;
            const isOpen = openVariants[sectionKey] === true;
            return (
              <div key={i} className={styles.variantGroup}>
                <div
                  className={styles.variantHeader}
                  onClick={() =>
                    setOpenVariants(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
                  }
                >
                  <span>{variant.name}</span>
                  <span>{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className={styles.variantBody}>
                    {variant.description && (
                      <div className={styles.description}>
                        {renderFormattedText(variant.description)}
                      </div>
                    )}
                    {Array.isArray(variant.features) && variant.features.length > 0 && (
                      <div className={styles.raceFeatures}>
                        <h4>Особенности варианта</h4>
                        {variant.features.map((feat, j) => (
                          <div key={j} className={styles.raceFeature}>
                            {renderFormattedFeature(feat.name, feat.description)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

      case 'items':
        return (
          <>
            <div className={styles.itemMeta}>
              <div><strong>Редкость:</strong> {item.rarity}</div>
              <div><strong>Тип:</strong> {item.type}</div>
              <div><strong>Настройка:</strong> {item.attunement ? 'Да' : 'Нет'}</div>
              {item.cost && <div><strong>Стоимость:</strong> {item.cost}</div>}
              {item.recommended_price && <div><strong>Рекомендуемая цена:</strong> {item.recommended_price}</div>}
            </div>
            <div className={styles.description}>
              <h3>Описание</h3>
              {renderFormattedText(item.description)}
            </div>
          </>
        );

      case 'feats':
        return (
          <>
            <div className={styles.featMeta}>
              {item.prerequisites && <div><strong>Требования:</strong> {item.prerequisites}</div>}
            </div>
            <div className={styles.description}>
              <h3>Описание</h3>
              {renderFormattedText(item.description)}
            </div>
          </>
        );

      case 'subclasses':
        return (
          <div className={styles.subclassPage}>
            <div className={styles.subclassDescription}>
              <h2>Описание подкласса</h2>
              {item.subtitle && <p className={styles.subclassSubtitle}>{item.subtitle}</p>}
              {renderFormattedText(item.description)}
            </div>
            {item.features && item.features.length > 0 && (
              <div className={styles.subclassFeatures}>
                <h2>Особенности</h2>
                {item.features.map((feature, idx) => (
                  <div key={idx} className={styles.subclassFeature}>
                    <h3 className={styles.featureTitle}>{feature.name}</h3>
                    <div className={styles.featureLevel}>
                      {feature.level} уровень {item.name}
                    </div>
                    <hr className={styles.featureDivider} />
                    <div className={styles.featureDescription}>
                      {renderFormattedText(feature.description)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'backgrounds':
  return (
    <>
      {/* Характеристики */}
      {Array.isArray(item.abilities) && item.abilities.length > 0 && (
        <div className={styles.backgroundBlock}>
          <h3>Характеристики</h3>
          <div className={styles.abilityChips}>
            {item.abilities.map((ab, i) => (
              <span key={i} className={styles.abilityChip}>{ab}</span>
            ))}
          </div>
        </div>
      )}

      {/* Черта */}
      {item.feat && (
        <div className={styles.backgroundBlock}>
          <h3>Черта</h3>
          <p>
            <strong>{typeof item.feat === 'string' ? item.feat : item.feat.name}</strong>
          </p>
        </div>
      )}

      {/* Владения */}
      {item.proficiencies && (
        <div className={styles.backgroundBlock}>
          <h3>Владения</h3>
          {Array.isArray(item.proficiencies.skills) && item.proficiencies.skills.length > 0 && (
            <div><strong>Навыки:</strong> {item.proficiencies.skills.join(', ')}</div>
          )}
          {Array.isArray(item.proficiencies.tools) && item.proficiencies.tools.length > 0 && (
            <div><strong>Инструменты:</strong> {item.proficiencies.tools.join(', ')}</div>
          )}
        </div>
      )}

      {/* Снаряжение */}
{item.equipment && (
  <div className={styles.backgroundBlock}>
    <h3>Снаряжение</h3>
    <p className={styles.equipmentLine}>
      <strong>Выберите А или Б:</strong>{' '}
      <span className={styles.equipmentOption}>
        А) {Array.isArray(item.equipment.optionA)
          ? item.equipment.optionA.join(', ')
          : item.equipment.optionA}
      </span>
      {item.equipment.optionB && (
        <>
          {' '}или{' '}
          <span className={styles.equipmentOption}>
            Б) {Array.isArray(item.equipment.optionB)
              ? item.equipment.optionB.join(', ')
              : item.equipment.optionB}
          </span>
        </>
      )}
    </p>
  </div>
)}

      {/* Описание */}
      <div className={styles.description}>
        <h3>Описание</h3>
        {renderFormattedText(item.description)}
      </div>
    </>
  );
      case 'homerules':
        return (
          <>
            <div className={styles.homeruleMeta}>
              <div><strong>Источник:</strong> {item.source}</div>
            </div>
            <div className={styles.description}>
              <h3>Описание правила</h3>
              {item.sections ? (
                <div className={styles.homeruleSections}>
                  {item.sections.map((section, idx) => {
                    switch (section.type) {
                      case 'heading':
                        return <h4 key={idx} className={styles.homeruleHeading}>{section.content}</h4>;
                      case 'paragraph':
                        return <p key={idx} className={styles.homeruleParagraph}>{section.content}</p>;
                      case 'table':
                        return (
                          <div key={idx} className={styles.homeruleTableWrapper}>
                            <table className={styles.homeruleTable}>
                              <thead>
                                <tr>
                                  {section.headers.map((header, i) => (
                                    <th key={i}>{header}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {section.rows.map((row, i) => (
                                  <tr key={i}>
                                    {row.map((cell, j) => (
                                      <td key={j}>{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              ) : (
                renderFormattedText(item.description)
              )}
            </div>
          </>
        );

      default:
        return <p>Нет данных для этой категории</p>;
    }
  };

  return (
    <div className={styles.page}>
      <Breadcrumbs />
      <div className={styles.header}>
        <Link to={`/category/${category}`} className={styles.back}>← К списку</Link>
        <h1>{item.name}</h1>
        <FavoriteButton id={item.id} className={styles.favoriteIcon} />
      </div>
      <div className={styles.content}>
        {renderDetails()}
      </div>
      <div className={styles.navigation}>
        {prevItem && (
          <Link to={`/category/${category}/${prevItem.id}`} className={styles.navLink}>
            ← {prevItem.name}
          </Link>
        )}
        {nextItem && (
          <Link to={`/category/${category}/${nextItem.id}`} className={styles.navLink}>
            {nextItem.name} →
          </Link>
        )}
      </div>
    </div>
  );
}