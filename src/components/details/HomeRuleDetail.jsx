import styles from '../../pages/ItemDetail.module.css';
import Markdown from '../Markdown';

export default function HomeRuleDetail({ item }) {
  return (
    <>
      <div className={styles.homeruleMeta}>
        <div><strong>Источник:</strong> {item.source}</div>
      </div>
      <div className={styles.description}>
        <Markdown content={item.content || item.description} />
      </div>
    </>
  );
}
