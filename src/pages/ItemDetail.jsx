import { useParams, Link } from 'react-router-dom';
import styles from './ItemDetail.module.css';
import FavoriteButton from '../components/FavoriteButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { categoryViews } from '../config/categoryViews';
import { useCategoryData } from '../hooks/useCategoryData';

export default function ItemDetail() {
  const { category, id } = useParams();
  const { getById, getNeighbours } = useCategoryData(category);
  const item = getById(id);
  const { prev: prevItem, next: nextItem } = getNeighbours(id);

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