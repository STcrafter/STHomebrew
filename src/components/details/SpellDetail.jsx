import styles from '../../pages/ItemDetail.module.css';
import StatBlock from '../StatBlock';
import Markdown from '../Markdown';
import { resolveStatblocks } from '../../utils/statblocks';

export default function SpellDetail({ item }) {
  const statblocks = resolveStatblocks(item.statblocks);

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
        <Markdown content={item.description} />
        {item.higher_levels && (
          <>
            <h3>На более высоких уровнях</h3>
            <Markdown content={item.higher_levels} />
          </>
        )}
      </div>
      {statblocks.length > 0 && (
        <div className={styles.statblocks}>
          {statblocks.map((block, index) => (
            <div key={block.id ?? index} className={styles.statblockItem}>
              {block.missing ? (
                <p className={styles.statblockError} role="alert">⚠️ Статблок «{block.id}» не найден</p>
              ) : (
                <StatBlock monster={block} compact />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
