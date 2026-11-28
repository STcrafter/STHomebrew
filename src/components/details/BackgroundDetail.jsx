import styles from '../../pages/ItemDetail.module.css';
import Markdown from '../Markdown';

export default function BackgroundDetail({ item }) {
  return (
    <>
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

      {item.feat && (
        <div className={styles.backgroundBlock}>
          <h3>Черта</h3>
          <p>
            <strong>{typeof item.feat === 'string' ? item.feat : item.feat.name}</strong>
          </p>
        </div>
      )}

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

      <div className={styles.description}>
        <h3>Описание</h3>
        <Markdown content={item.description} />
      </div>
    </>
  );
}
