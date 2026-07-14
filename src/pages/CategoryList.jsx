import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
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

  // Состояния фильтров и поиска
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');

  // Состояния сортировки
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' или 'desc'

  // Сброс сортировки при смене категории
  useEffect(() => {
    setSortField('name');
    setSortDirection('asc');
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
  } else {
    return {};
  }

  const options = {};
  filterFields.forEach(field => {
    const values = new Set();
    items.forEach(item => {
      let val = item[field];
      if (val === undefined || val === null) return;
      
      // Преобразуем булевы значения в читаемый вид
      if (typeof val === 'boolean') {
        val = val ? 'Да' : 'Нет';
      }
      // Если это массив, добавляем каждый элемент
      if (Array.isArray(val)) {
        val.forEach(v => {
          // Если элемент тоже булевый (маловероятно, но на всякий случай)
          const strVal = typeof v === 'boolean' ? (v ? 'Да' : 'Нет') : String(v);
          values.add(strVal);
        });
      } else {
        values.add(String(val));
      }
    });
    if (values.size > 0) {
      // Для числовых полей (challenge_rating, level) сортируем по возрастанию чисел
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
      // Поиск по имени
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Фильтры
      for (const [key, selectedValues] of Object.entries(filters)) {
        if (!selectedValues || selectedValues.length === 0) continue;
        const itemVal = item[key];
        if (Array.isArray(itemVal)) {
          if (!itemVal.some(v => selectedValues.includes(String(v)))) {
            return false;
          }
        } else {
          if (!selectedValues.includes(String(itemVal))) {
            return false;
          }
        }
      }
      return true;
    });

    // Сортировка
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
  }, [items, search, filters, sortField, sortDirection]);

  const handleFilterChange = (field, selected) => {
    setFilters(prev => ({ ...prev, [field]: selected }));
  };

  const handleSearch = (query) => {
    setSearch(query);
  };

  // Обработчики сортировки
  const handleSortFieldChange = (field) => {
    if (sortField === field) {
      // Если уже выбрано это поле, инвертируем направление
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Иначе меняем поле и ставим сортировку по возрастанию
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Определяем доступные поля сортировки для категории
  const sortOptions = [];
  sortOptions.push({ field: 'name', label: 'По алфавиту' });
  if (category === 'monsters') {
    sortOptions.push({ field: 'challenge_rating', label: 'По опасности' });
  }

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
            </div>
          </div>

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
