import { Link } from 'react-router-dom';
import styles from './Home.module.css';

// Список категорий с названиями, иконками и цветами
const categories = [
  { id: 'monsters', label: 'Монстры', icon: '🐉', color: '#4d6bfe' },
  { id: 'spells', label: 'Заклинания', icon: '✨', color: '#7c3aed' },
  { id: 'classes', label: 'Классы', icon: '⚔️', color: '#ea580c' },
  { id: 'subclasses', label: 'Подклассы', icon: '🛡️', color: '#b45309' }, // Новая
  { id: 'races', label: 'Расы', icon: '🧝', color: '#059669' },
  { id: 'items', label: 'Предметы', icon: '🧪', color: '#d97706' }, // Изменено с 🏺 на 🧪
  { id: 'feats', label: 'Черты', icon: '💪', color: '#dc2626' },
  { id: 'homerules', label: 'Домашние правила', icon: '📜', color: '#6366f1' }, // Новая
];

export default function Home() {
  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h1>🏰 Homebrew D&D</h1>
        <p>Выберите категорию для просмотра</p>
      </header>
      <div className={styles.grid}>
        {categories.map((cat) => (
          <Link to={`/category/${cat.id}`} key={cat.id} className={styles.card}>
            <div className={styles.icon} style={{ backgroundColor: cat.color }}>
              {cat.icon}
            </div>
            <h2>{cat.label}</h2>
          </Link>
        ))}
        <footer className={styles.footer}>
  <Link to="/constructor" className={styles.constructorLink}>
    🛠️ Конструктор объектов
  </Link>
</footer>
      </div>
    </div>
  );
}
