import { useParams, Link } from 'react-router-dom';
import { data } from '../data';
import styles from './ItemDetail.module.css';
import FavoriteButton from '../components/FavoriteButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { isItemVisible } from '../utils/itemVisibility';
import { categoryViews } from '../config/categoryViews';

export default function ItemDetail() {
  const { category, id } = useParams();
  const items = data[category] || [];
  const item = items.find(it => it.id === id);
  // Навигация Prev/Next (по алфавиту)
  const sortedItems = [...items]
    .filter(isItemVisible)
    .sort((a, b) => a.name.localeCompare(b.name));
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

  const Detail = categoryViews[category]?.Detail;

  return (
    <div className={styles.page} id="main-content">
      <Breadcrumbs />
      <div className={styles.header}>
        <Link to={`/category/${category}`} className={styles.back}>← К списку</Link>
        <h1>{item.name}</h1>
        <FavoriteButton id={item.id} className={styles.favoriteIcon} />
      </div>
      <div className={styles.content}>
        {Detail ? <Detail key={item.id} item={item} /> : <p>Нет данных для этой категории</p>}
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