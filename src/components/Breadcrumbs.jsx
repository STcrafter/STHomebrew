import { Link, useLocation, useParams } from 'react-router-dom';
import { data } from '../data';
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
  const params = useParams();
  const { category, id } = params;
  const pathnames = location.pathname.split('/').filter(x => x);

  // Убираем 'STHomebrew' из пути
  const filtered = pathnames.filter(p => p !== 'STHomebrew');

  if (filtered.length === 0) return null;

  // Строим массив крошек
  const crumbs = [];
  crumbs.push({ label: 'Главная', path: '/' });

  // Если есть категория, добавляем её
  if (category) {
    const categoryLabel = categoryLabels[category] || category;
    crumbs.push({ label: categoryLabel, path: `/category/${category}` });
  }

  // Если есть id, добавляем объект (последний, без ссылки)
  if (id) {
    const items = data[category] || [];
    const item = items.find(it => it.id === id);
    const objectName = item ? item.name : id;
    crumbs.push({ label: objectName, path: null });
  }

  return (
    <nav className={styles.breadcrumbs}>
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={index}>
            {index > 0 && <span className={styles.separator}> / </span>}
            {isLast ? (
              <span className={styles.current}>{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className={styles.crumb}>{crumb.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}