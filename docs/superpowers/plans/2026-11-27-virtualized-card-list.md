# План: виртуализация списка карточек

Цель: заменить полный рендер карточек в `CategoryList` на виртуализированный_grid, сохранив внешний вид, фильтры и SSR-совместимость. Дизайн: `docs/superpowers/specs/2026-11-27-virtualized-card-list-design.md`.

## Шаг 1 — RED-тест реального поведения
- Добавить DOM-тест в `tests/virtualization.test.js`:
  - поднять Vite `createServer` и загрузить `CategoryList.jsx` через `ssrLoadModule` (так уже делают другие тесты, CSS-импорты не мешают);
  - в jsdom отрендерить компонент для `/category/monsters` в `MemoryRouter` + `FavoritesProvider`;
  - сэмулировать видимую область (ResizeObserver / getBoundingClientRect) и проверить, что в DOM меньше 88 карточек, при этом остаются доступны должны быть только видимые записи;
  - отдельно сохранить SSR-проверку: `renderToStaticMarkup` должен содержать все карточки (`ssr={filteredItems.length}`).
- Запустить только этот тест и убедиться, что он падает по причине «нет виртуализации» (в DOM 88 карточек), а не из-за опечатки.

## Шаг 2 — подготовка зависимостей
- Установить `react-virtuoso` в `dependencies`, `jsdom` в `devDependencies` через `npm install`, чтобы обновились `package.json` и `package-lock.json`.
- Повторить RED-тест: он должен по-прежнему падать, теперь уже на отсутствии виртуализированного контейнера.

## Шаг 3 — GREEN: минимальная реализация
- В `src/pages/CategoryList.jsx`:
  - импортировать `VirtuosoGrid`, `useWindowScroll` из `react-virtuoso`;
  - вынести рендер одной карточки в функцию/компонент `renderItem(item)`;
  - заменить `<div className={styles.grid}>{filteredItems.map(...)}</div>` на:
    `<VirtuosoGrid useWindowScroll data={filteredItems} initialItemCount={initialItemCount} style={{ height: '100vh' }} itemContent={(index, item) => renderItem(item)} listClassName={styles.grid} itemClassName={styles.gridItem} computeItemKey={(index, item) => item.id} />`, где `initialItemCount` — состояние, равное `filteredItems.length` на первом рендере и сбрасываемое в `undefined` в `useEffect` после монтирования.
  - оставить блок «Ничего не найдено» вне Virtuoso.
- В `src/pages/CategoryList.module.css` добавить минимальный `.gridItem` (обёртка элемента сетки Virtuoso), не меняя `.grid`, `.card` и media-запросы.
- Запустить новый тест и весь `npm test`; добиться зелёного результата.

## Шаг 4 — сброс прокрутки при смене набора данных
- Добавить RED-тест: после изменения категории/поиска виртуализированный список возвращается к началу (проверять через ref/`scrollTo` или отсутствие старых карточек в DOM).
- Реализовать через `useRef` на Virtuoso и `scrollToIndex({ index: 0 })` в `useEffect` с зависимостями от `category`, `search`, `filters`, `sortField`, `sortDirection`, `showFavorites`.
- Прогнать тесты.

## Шаг 5 — верификация и уборка
- Полный последовательный прогон: `node --test --test-timeout=60000`, затем отдельно `npm run build` (не параллельно!).
- Проверить сборку на отсутствие предупреждения о размере чанков.
- Проверить в реальном браузере через Playwright: открыть `/category/monsters`, прокрутить, убедиться, что число `.card` в DOM много меньше 88 и карточки меняются при скролле.
- `git diff --check`; удалить временные файлы/процессы, если появятся.
