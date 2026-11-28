import styles from '../../pages/ItemDetail.module.css';
import Markdown from '../Markdown';

export default function FeatDetail({ item }) {
  return (
    <>
      <div className={styles.featMeta}>
        {item.prerequisites && <div><strong>Требования:</strong> {item.prerequisites}</div>}
      </div>
      <div className={styles.description}>
        <h3>Описание</h3>
        <Markdown content={item.description} />
      </div>
    </>
  );
}
