import styles from '../../pages/ItemDetail.module.css';
import Markdown from '../Markdown';

export default function ItemContentDetail({ item }) {
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
        <Markdown content={item.description} />
      </div>
    </>
  );
}
