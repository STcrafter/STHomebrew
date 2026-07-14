import { useParams, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { data } from '../data';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import styles from './CategoryList.module.css';

const categoryLabels = {
  monsters: 'Монстры',
  spells: 'Заклинания',
  classes: 'Классы',
  races: 'Расы',
  items: 'Предметы',
  feats: 'Черты',
};

export default function CategoryList() {
  const { category } = useParams();
  const items = data[category] || [];

  console.log('Items for', category, ':', items);

  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');

  const filterOptions = useMemo(() => {
    if (!items.length) {
      console.log('No items, returning empty options');
      return {};
    }

    let filterFields = [];
    if (category === 'monsters') {
      filterFields = ['habitat', 'challenge_rating', 'type'];
    } else if (category === 'spells') {
      filterFields = ['classes', 'level', 'school', 'concentration'];
    } else if (category === 'items') {
      filterFields = ['rarity', 'type', 'attunement'];
    } else {
      return {};
    }

    console.log('Filter fields for', category, ':', filterFields);

    const options = {};
    filterFields.forEach(field => {
      const values = new Set();
      items.forEach(item => {
        const val = item[field];
        if (Array.isArray(val)) {
          val.forEach(v => values.add(v));
        } else if (val !== undefined && val !== null) {
          values.add(String(val));
        }
      });
      if (values.size > 0) {
        options[field] = Array.from(values).sort();
      }
    });

    console.log('Generated filterOptions:', options);
    return options;
  }, [items, category]);

  // ... остальной код без изменений (фильтрация, рендер)

  // ===== Фильтрация и поиск =====
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Поиск по имени
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Фильтры
      for (const [key, selectedValues] of Object.entries(filters)) {
        if (!selectedValues || selectedValues.length === 0) continue;
        const itemVal = item[key];
        if (Array.isArray(itemVal)) {
          // Если поле - массив (habitat), проверяем пересечение
          if (!itemVal.some(v => selectedValues.includes(String(v)))) {
            return false;
          }
        } else {
          // Для чисел и строк
          if (!selectedValues.includes(String(itemVal))) {
            return false;
          }
        }
      }
      return true;
    });
  }, [items, search, filters]);

  const handleFilterChange = (field, selected) => {
    setFilters(prev => ({ ...prev, [field]: selected }));
  };

  const handleSearch = (query) => {
    setSearch(query);
  };

  return (
    <div className={styles.page}>
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
          <SearchBar onSearch={handleSearch} placeholder="Поиск по названию..." />

          <div className={styles.grid}>
            {filteredItems.map(item => (
              <Link to={`/category/${category}/${item.id}`} key={item.id} className={styles.card}>
                <div className={styles.cardImage}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className={styles.placeholder}>🎲</div>
                  )}
                </div>
                <h3>{item.name}</h3>
                {/* Краткая информация для превью */}
                {category === 'monsters' && (
                  <div className={styles.meta}>
                    {item.challenge_rating !== undefined && (
                      <span>ОП {item.challenge_rating}</span>
                    )}
                    {item.habitat && item.habitat.length > 0 && (
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
                    <span>Уровней: {Object.keys(item.features_by_level).length}</span>
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
