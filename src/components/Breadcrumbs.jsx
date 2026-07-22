import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const categoryLabels = {
  monsters: 'Монстры',
  spells: 'Заклинания',
  classes: 'Классы',
  subclasses: 'Подклассы',
  races: 'Расы',
  items: 'Предметы',
  feats: 'Черты',
  homerules: 'Домашние правила',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Убираем 'STHomebrew' и 'category' из пути
  const filtered = pathnames.filter(p => p !== 'STHomebrew' && p !== 'category');

  if (filtered.length === 0) return null;

  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/" className={styles.crumb}>Главная</Link>
      {filtered.map((crumb, index) => {
        const pathTo = `/${pathnames.slice(0, pathnames.indexOf(crumb) + 1).join('/')}`;
        const isLast = index === filtered.length - 1;
        const label = categoryLabels[crumb] || decodeURIComponent(crumb);
        return (
          <span key={crumb}>
            <span className={styles.separator}> / </span>
            {isLast ? (
              <span className={styles.current}>{label}</span>
            ) : (
              <Link to={pathTo} className={styles.crumb}>{label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}