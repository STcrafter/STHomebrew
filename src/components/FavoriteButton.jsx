import { useFavorites } from '../context/FavoritesContext';
import styles from './FavoriteButton.module.css';

export default function FavoriteButton({ id, className }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  return (
    <button
      className={`${styles.favoriteButton} ${favorite ? styles.active : ''} ${className || ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
      }}
      aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      {favorite ? '★' : '☆'}
    </button>
  );
}