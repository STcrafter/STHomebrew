import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect, useRef } from 'react';
import { data } from '../data';
import { VirtuosoGrid } from 'react-virtuoso';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import FavoriteButton from '../components/FavoriteButton';
import Breadcrumbs from '../components/Breadcrumbs';
import CardMeta from '../components/CardMeta';
import { useFavorites } from '../context/FavoritesContext';
import styles from './CategoryList.module.css';
import { pluralizeRu } from '../utils/helpers';
import { getSortOptions, sortItems, toggleSortDirection } from '../utils/sorting';
import { defaultListViewState, loadListViewPreferences, saveListViewPreferences } from '../utils/listViewPreferences';
import { isItemVisible } from '../utils/itemVisibility';
import { categories } from '../config/categories';

const EMPTY_ITEMS = [];

export default function CategoryList() {
  const { category } = useParams();
  const items = data[category] ?? EMPTY_ITEMS;
  const { isFavorite } = useFavorites();
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  const [preferences, setPreferences] = useState(() => loadListViewPreferences());
  const view = preferences[category] ?? defaultListViewState;
  const { search, filters, sortField, sortDirection, showFavorites } = view;

  const updateCurrentView = (updater) => {
    setPreferences(prev => ({
      ...prev,
      [category]: updater(prev[category] ?? defaultListViewState),
    }));
  };

  useEffect(() => {
    saveListViewPreferences(preferences);
  }, [preferences]);

  // Отслеживаем высоту шапки, чтобы липкая панель поиска не перекрывала её
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateOffset = () => {
      document.documentElement.style.setProperty('--sticky-offset', `${header.offsetHeight}px`);
    };

    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const categoryConfig = categories[category];

  // Генерация опций для фильтров
  const filterOptions = useMemo(() => {
    if (!items.length) return {};

    const filterFields = categoryConfig?.filters ?? [];
    if (filterFields.length === 0) return {};

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
  }, [items, categoryConfig]);

  // Фильтрация и поиск
  const filteredItems = useMemo(() => {
    let result = items.filter(item => {
      if (!isItemVisible(item)) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;

      for (const [key, filter] of Object.entries(filters)) {
        if (!filter) continue;
        const { include = [], exclude = [] } = filter;
        if (include.length === 0 && exclude.length === 0) continue;

        const itemVal = item[key];
        let values = [];
        if (typeof itemVal === 'boolean') {
          values = [itemVal ? 'Да' : 'Нет'];
        } else if (Array.isArray(itemVal)) {
          values = itemVal.map(v => String(v));
        } else if (itemVal !== undefined && itemVal !== null) {
          values = [String(itemVal)];
        }

        // Исключающие фильтры: если значение в списке исключений — отбрасываем
        if (exclude.some(ex => values.includes(ex))) return false;

        // Включающие фильтры: если есть список включения, значение должно в него попадать
        if (include.length > 0 && !include.some(inc => values.includes(inc))) return false;
      }

      if (showFavorites && !isFavorite(item.id)) return false;
      return true;
    });

    return sortItems(result, sortField, sortDirection);
  }, [items, search, filters, sortField, sortDirection, showFavorites, isFavorite]);

  // initialItemCount нужен только серверному рендеру. В браузере он переводит
  // Virtuoso в режим ожидания прокрутки: короткие списки остаются пустыми,
  // если пользователь не прокрутил страницу.
  const initialItemCount = typeof window === 'undefined' ? filteredItems.length : undefined;

  useEffect(() => {
    gridRef.current?.scrollToIndex({ index: 0, align: 'start' });
  }, [category, search, filters, sortField, sortDirection, showFavorites]);

  const handleFilterChange = (field, selected) => {
    updateCurrentView((current) => {
      const nextFilters = { ...current.filters };
      if (selected === null) delete nextFilters[field];
      else nextFilters[field] = selected;
      return { ...current, filters: nextFilters };
    });
  };

  const handleSearch = (query) => {
    updateCurrentView(current => ({ ...current, search: query }));
  };

  const renderItem = (item) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Link to={`/category/${category}/${item.id}`} className={styles.cardLink}>
          <h3 title={item.name}>{item.name}</h3>
        </Link>
        <FavoriteButton id={item.id} />
      </div>
      <CardMeta category={category} item={item} styles={styles} />
    </div>
  );

  return (
    <div className={styles.page} id="main-content">
      <Breadcrumbs />
      <div className={styles.header} ref={headerRef}>
        <Link to="/" className={styles.back}>← На главную</Link>
        <h1>{categoryConfig?.label || category}</h1>
        <span className={styles.count} aria-live="polite">
          {filteredItems.length} {pluralizeRu(filteredItems.length, ['запись', 'записи', 'записей'])}
        </span>
      </div>

      <div className={styles.content}>
        {Object.keys(filterOptions).length > 0 && (
          <aside className={styles.filterPanel}>
            <FilterPanel options={filterOptions} selected={filters} onFilterChange={handleFilterChange} labels={categoryConfig?.fieldLabels ?? {}}/>
          </aside>
        )}

        <main className={styles.list}>
          <div className={styles.toolbar}>
            <SearchBar value={search} onSearch={handleSearch} placeholder="Поиск по названию…" />
            <div className={styles.sortControls}>
              <span className={styles.sortLabel}>Сортировать:</span>
              <select
                className={styles.sortSelect}
                value={sortField}
                onChange={(e) => {
                  const sortField = e.target.value;
                  updateCurrentView(current => ({ ...current, sortField, sortDirection: 'asc' }));
                }}
                aria-label="Тип сортировки"
              >
                {getSortOptions(category).map(opt => (
                  <option key={opt.field} value={opt.field}>{opt.label}</option>
                ))}
              </select>
              <button
                type="button"
                className={styles.directionButton}
                onClick={() => updateCurrentView(current => ({
                  ...current,
                  sortDirection: toggleSortDirection(current.sortDirection),
                }))}
                title={sortDirection === 'asc' ? 'По убыванию' : 'По возрастанию'}
                aria-label={sortDirection === 'asc' ? 'Сортировать по убыванию' : 'Сортировать по возрастанию'}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
              <label
                className={`${styles.favoritesFilter} ${showFavorites ? styles.favoritesActive : ''}`}
              >
                <input
                  type="checkbox"
                  className={styles.favoritesInput}
                  checked={showFavorites}
                  onChange={() => updateCurrentView(current => ({
                    ...current,
                    showFavorites: !current.showFavorites,
                  }))}
                />
                <span className={styles.favoritesBox} aria-hidden="true">
                  {showFavorites && '✓'}
                </span>
                ⭐ Только избранное
              </label>
            </div>
          </div>

          <VirtuosoGrid
            ref={gridRef}
            useWindowScroll
            data={filteredItems}
            {...(initialItemCount === undefined ? {} : { initialItemCount })}
            style={{ height: '100vh' }}
            computeItemKey={(_, item) => item.id}
            itemContent={(_, item) => renderItem(item)}
            listClassName={styles.grid}
            itemClassName={styles.gridItem}
          />

          {filteredItems.length === 0 && (
            <div className={styles.empty}>Ничего не найдено</div>
          )}
        </main>
      </div>
    </div>
  );
}