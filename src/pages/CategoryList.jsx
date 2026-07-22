import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { data } from '../data';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import FavoriteButton from '../components/FavoriteButton';
import Breadcrumbs from '../components/Breadcrumbs';
import { useFavorites } from '../context/FavoritesContext';
import styles from './CategoryList.module.css';
import { formatChallengeRating } from '../utils/helpers';

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

export default function CategoryList() {
  const { category } = useParams();
  const items = data[category] || [];
  const { isFavorite } = useFavorites();

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    setSortField('name');
    setSortDirection('asc');
    setShowFavorites(false);
  }, [category]);

  // Генерация опций для фильтров
  const filterOptions = useMemo(() => {
    if (!items.length) return {};

    let filterFields = [];
    if (category === 'monsters') {
      filterFields = ['habitat', 'challenge_rating', 'category'];
    } else if (category === 'spells') {
      filterFields = ['classes', 'level', 'school', 'concentration'];
    } else if (category === 'items') {
      filterFields = ['rarity', 'type', 'attunement'];
    } else if (category === 'subclasses') {
      filterFields = ['class'];
    } else if (category === 'feats') {
      filterFields = ['ability'];
    } else {
      return {};
    }

    const options = {};
    filterFields.forEach(field => {
      const values = new Set();
      items.forEach(item => {
        let val = item[field];
        if (val === undefined || val === null) return;
        if (typeof val === 'boolean') {
          val = val ? 'Да' : 'Нет';
        }
        if (Array.isArray(val)) {
          val.forEach(v => {
            const strVal = typeof v === 'boolean' ? (v ? 'Да' : 'Нет') : String(v);
            values.add(strVal);
          });
        } else {
          values.add(String(val));
        }
      });
      if (values.size > 0) {
        if (field === 'challenge_rating' || field === 'level') {
          options[field] = Array.from(values).sort((a, b) => Number(a) - Number(b));
        } else {
          options[field] = Array.from(values).sort();
        }
      }
    });
    return options;
  }, [items, category]);

  // Фильтрация и поиск
  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      for (const [key, selectedValues] of Object.entries(filters)) {
        if (!selectedValues || selectedValues.length === 0) continue;
        const itemVal = item[key];
        if (Array.isArray(itemVal)) {
          if (!itemVal.some(v => selectedValues.includes(String(v)))) return false;
        } else {
          if (!selectedValues.includes(String(itemVal))) return false;
        }
      }
      if (showFavorites && !isFavorite(item.id)) return false;
      return true;
    });

    if (sortField === 'name') {
      result.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    } else if (sortField === 'challenge_rating') {
      result.sort((a, b) => {
        const crA = a.challenge_rating ?? 0;
        const crB = b.challenge_rating ?? 0;
        return sortDirection === 'asc' ? crA - crB : crB - crA;
      });
    }
    return result;
  }, [items, search, filters, sortField, sortDirection, showFavorites, isFavorite]);

  const handleFilterChange = (field, selected) => {
    setFilters(prev => ({ ...prev, [field]: selected }));
  };

  const handleSearch = (query) => {
    setSearch(query);
  };

  const handleSortFieldChange = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortOptions = [];
  sortOptions.push({ field: 'name', label: 'По алфавиту' });
  if (category === 'monsters') {
    sortOptions.push({ field: 'challenge_rating', label: 'По опасности' });
  }

  return (
    <div className={styles.page}>
      <Breadcrumbs />
      <div className={styles.header}>
        <Link to="/" className={styles.back}>← На главную</Link>
        <h1>{categoryLabels[category] || category}</h1>
        <span className={styles.count}>{filteredItems.length} записей</span>
      </div>

      <div className={styles.content}>
        {Object.keys(filterOptions).length > 0 && (
          <aside className={styles.filterPanel}>
            <FilterPanel options={filterOptions} onFilterChange={handleFilterChange} />
          </aside>
        )}

        <main className={styles.list}>
          <div className={styles.toolbar}>
            <SearchBar onSearch={handleSearch} placeholder="Поиск по названию..." />
            <div className={styles.sortControls}>
              <span className={styles.sortLabel}>Сортировать:</span>
              {sortOptions.map(opt => (
                <button
                  key={opt.field}
                  className={`${styles.sortButton} ${sortField === opt.field ? styles.active : ''}`}
                  onClick={() => handleSortFieldChange(opt.field)}
                >
                  {opt.label}
                  {sortField === opt.field && (
                    <span className={styles.sortArrow}>
                      {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </button>
              ))}
              <label className={styles.favoritesFilter}>
                <input
                  type="checkbox"
                  checked={showFavorites}
                  onChange={(e) => setShowFavorites(e.target.checked)}
                />
                ⭐ Только избранное
              </label>
            </div>
          </div>

          <div className={styles.grid}>
            {filteredItems.map(item => (
              <Link to={`/category/${category}/${item.id}`} key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{item.name}</h3>
                  <FavoriteButton id={item.id} />
                </div>

                {category === 'monsters' && (
                  <div className={styles.meta}>
                    {item.challenge_rating !== undefined && (
                      <span>ОП {formatChallengeRating(item.challenge_rating)}</span>
                    )}
                    {Array.isArray(item.habitat) && item.habitat.length > 0 && (
                      <span>{item.habitat.slice(0, 2).join(', ')}</span>
                    )}
                  </div>
                )}
                {category === 'spells' && (
                  <div className={styles.meta}>
                    <span>{item.level} уровень</span>
                    <span>{item.school}</span>
                  </div>
                )}
                {category === 'items' && (
                  <div className={styles.meta}>
                    <span>{item.rarity}</span>
                    <span>{item.type}</span>
                  </div>
                )}
                {category === 'classes' && (
                  <div className={styles.meta}>
                    <span>Уровней: {
                      Array.isArray(item.features) 
                        ? new Set(item.features.map(f => f.level)).size 
                        : 0
                    }</span>
                  </div>
                )}
                {category === 'subclasses' && (
                  <div className={styles.meta}>
                    <span>{item.class}</span>
                    <span>Особенностей: {Array.isArray(item.features) ? item.features.length : 0}</span>
                  </div>
                )}
                {category === 'races' && (
                  <div className={styles.meta}>
                    <span>Особенностей: {item.features?.length || 0}</span>
                  </div>
                )}
                {category === 'feats' && (
                  <div className={styles.meta}>
                    <span>{item.prerequisites || 'Нет требований'}</span>
                  </div>
                )}
                {category === 'homerules' && (
                  <div className={styles.meta}>
                    <span>{item.source}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className={styles.empty}>Ничего не найдено</div>
          )}
        </main>
      </div>
    </div>
  );
}