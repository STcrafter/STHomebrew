import styles from '../../pages/ItemDetail.module.css';
import StatBlock from '../StatBlock';
import Markdown from '../Markdown';

export default function MonsterDetail({ item }) {
  return (
    <>
      {item.image && (
        <div className={styles.imageWrapper}>
          <img src={item.image} alt={item.name} className={styles.detailImage} width="600" height="400" />
        </div>
      )}
      <div className={styles.description}>
        <h3>Описание</h3>
        <Markdown content={item.description} />
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
}
