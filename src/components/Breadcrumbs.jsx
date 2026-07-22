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

  if (pathnames.length === 0) return null;

  const isHomebrewBase = pathnames[0] === 'STHomebrew' && pathnames.length > 1;
  const startIndex = isHomebrewBase ? 1 : 0;
  const crumbs = isHomebrewBase ? pathnames.slice(1) : pathnames;

  return (
    <nav className={styles.breadcrumbs}>
      <Link to="/" className={styles.crumb}>Главная</Link>
      {crumbs.map((crumb, index) => {
        const pathTo = `/${pathnames.slice(0, startIndex + index + 1).join('/')}`;
        const isLast = index === crumbs.length - 1;
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