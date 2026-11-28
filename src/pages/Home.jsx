import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { categories } from '../config/categories';

export default function Home() {
  return (
    <div className={styles.home} id="main-content">
      <header className={styles.header}>
        <h1>🏰 Homebrew D&D</h1>
        <p>Выберите категорию для просмотра</p>
      </header>
      <div className={styles.grid}>
        {Object.entries(categories).map(([id, cat]) => (
          <Link to={`/category/${id}`} key={id} className={styles.card}>
            <div className={styles.icon} style={{ backgroundColor: cat.color }}>
              {cat.icon}
            </div>
            <h2>{cat.label}</h2>
          </Link>
        ))}
      </div>
      <footer className={styles.footer}>
        <Link to="/constructor" className={styles.constructorLink}>
          Конструктор объектов →
        </Link>
      </footer>
    </div>
  );
}
