import { useState } from 'react';
import styles from '../../pages/ItemDetail.module.css';
import Markdown from '../Markdown';

export default function RaceDetail({ item }) {
  const [openVariants, setOpenVariants] = useState({});

  return (
    <div className={styles.racePage}>
      {item.image && (
        <div className={styles.imageWrapper}>
          <img src={item.image} alt={item.name} className={styles.detailImage} width="600" height="400" />
        </div>
      )}

      <div className={styles.raceStats}>
        {item.creatureType && <div><strong>Тип:</strong> {item.creatureType}</div>}
        {item.size && <div><strong>Размер:</strong> {item.size}</div>}
        {item.speed && <div><strong>Скорость:</strong> {item.speed}</div>}
        {item.vision && <div><strong>Зрение:</strong> {item.vision}</div>}
      </div>

      <div className={styles.description}>
        <h3>Описание</h3>
        <Markdown content={item.description} />
      </div>

      {Array.isArray(item.commonFeatures) && item.commonFeatures.length > 0 && (
        <div className={styles.raceFeatures}>
          <h3>Общие особенности</h3>
          {item.commonFeatures.map((feat, i) => (
            <div key={i} className={styles.raceFeature}>
              <Markdown content={feat.description} featureName={feat.name} />
            </div>
          ))}
        </div>
      )}

      {Array.isArray(item.variants) && item.variants.length > 0 && (
        <div className={styles.variantsSection}>
          <h3>Варианты</h3>
          {item.variants.map((variant, i) => {
            const sectionKey = `variant_${variant.id || i}`;
            const isOpen = openVariants[sectionKey] === true;
            return (
              <div key={i} className={styles.variantGroup}>
                <button
                  type="button"
                  className={styles.variantHeader}
                  aria-expanded={isOpen}
                  aria-controls={`${sectionKey}-body`}
                  onClick={() =>
                    setOpenVariants((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
                  }
                >
                  <span>{variant.name}</span>
                  <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div id={`${sectionKey}-body`} className={styles.variantBody}>
                    {variant.description && (
                      <div className={styles.description}>
                        <Markdown content={variant.description} />
                      </div>
                    )}
                    {Array.isArray(variant.features) && variant.features.length > 0 && (
                      <div className={styles.raceFeatures}>
                        <h4>Особенности варианта</h4>
                        {variant.features.map((feat, j) => (
                          <div key={j} className={styles.raceFeature}>
                            <Markdown content={feat.description} featureName={feat.name} />
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
}
