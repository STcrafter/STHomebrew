# List View Preferences Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сохранить поиск, фильтры, сортировку и «Только избранное» каждого раздела между обновлениями страницы, карточками и переключением разделов.

**Architecture:** Чистый модуль работы с `localStorage` хранит настройки по категориям под одним ключом. `CategoryList` держит все настройки в одном состоянии и сохраняет их через `useEffect`; `SearchBar` и `FilterPanel` становятся управляемыми компонентами. Новых зависимостей нет.

**Tech Stack:** React 18, Vite 4, `node:test`, SSR-тесты через `vite.createServer` + `react-dom/server`.

**Spec:** `docs/superpowers/specs/2026-11-27-list-view-preferences-design.md`

## Global Constraints

- Разделы: `monsters`, `spells`, `classes`, `subclasses`, `races`, `backgrounds`, `items`, `feats`, `homerules`.
- Сохраняемые поля: `search`, `filters` (`{ include: string[], exclude: string[] }` по полю), `sortField`, `sortDirection`, `showFavorites`.
- Ключ `localStorage`: `listViewPreferences`, внутри объект `{ [category]: state }`.
- Значения по умолчанию: `search: ''`, `filters: {}`, `sortField: 'name'`, `sortDirection: 'asc'`, `showFavorites: false`.
- `sortField` допускается только из `getSortOptions(category)`; `sortDirection` — только `asc`/`desc`.
- Битые или неизвестные данные не должны ломать страницу: значения по умолчанию.
- Не добавлять URL-параметры, параметры ссылок и новые зависимости.
- Не сохранять раскрытие секций фильтров, прокрутку и не добавлять кнопку «Сбросить настройки».
- Существующий `useEffect`, который сбрасывает настройки при смене `category`, удалить.

## Review Focus

- Битый JSON в `localStorage` — приложение открывается с настройками по умолчанию, без исключения → Task 1, тест повреждённого хранилища.
- `sortField`, недопустимый для категории (например `challenge_rating` у `spells`) — заменяется на `name` → Task 1, тест нормализации.
- Фильтр с неверной формой (`include` не массив, числа вместо строк) — отбрасывается, остальные настройки сохраняются → Task 1, тест нормализации фильтров.
- Возврат из карточки и обновление страницы — поиск, направление сортировки и выбранный фильтр восстанавливаются → Task 2, SSR-тест с подготовленным `localStorage`.
- Переключение разделов — настройки spells не применяются к monsters и не затирают их → Task 2, SSR-тест двух категорий.

---

### Task 1: Чистое хранилище настроек списка

**Files:**
- Create: `src/utils/listViewPreferences.js`
- Create: `tests/listViewPreferences.test.js`

**Interfaces:**
- Consumes: `getSortOptions(category)` из `src/utils/sorting.js`.
- Produces:
  - `LIST_VIEW_STORAGE_KEY === 'listViewPreferences'`
  - `defaultListViewState` — `{ search: '', filters: {}, sortField: 'name', sortDirection: 'asc', showFavorites: false }`
  - `normalizeListViewState(value, category) -> ListViewState`
  - `loadListViewPreferences(storage = globalThis.localStorage) -> Record<string, ListViewState>`
  - `saveListViewPreferences(preferences, storage = globalThis.localStorage) -> void`

- [ ] **Step 1: Write the failing tests**

`tests/listViewPreferences.test.js` (use a fake storage object with `getItem`/`setItem` over a plain object):

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LIST_VIEW_STORAGE_KEY,
  defaultListViewState,
  normalizeListViewState,
  loadListViewPreferences,
  saveListViewPreferences,
} from '../src/utils/listViewPreferences.js';

const fakeStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => data[key] ?? null,
    setItem: (key, value) => { data[key] = String(value); },
  };
};

test('load returns empty preferences when storage is empty or corrupt', () => {
  assert.deepEqual(loadListViewPreferences(fakeStorage()), {});
  assert.deepEqual(loadListViewPreferences(fakeStorage({ [LIST_VIEW_STORAGE_KEY]: '{oops' })), {});
});

test('load normalizes a saved category state', () => {
  const storage = fakeStorage({
    [LIST_VIEW_STORAGE_KEY]: JSON.stringify({
      spells: {
        search: 'Мгновенная',
        filters: { level: { include: ['3'], exclude: [] } },
        sortField: 'level',
        sortDirection: 'desc',
        showFavorites: true,
      },
    }),
  });
  assert.deepEqual(loadListViewPreferences(storage).spells, {
    search: 'Мгновенная',
    filters: { level: { include: ['3'], exclude: [] } },
    sortField: 'level',
    sortDirection: 'desc',
    showFavorites: true,
  });
});

test('normalize rejects a sort field that is invalid for the category', () => {
  const result = normalizeListViewState({ sortField: 'challenge_rating' }, 'spells');
  assert.equal(result.sortField, 'name');
});

test('normalize drops malformed filters and invalid scalar values', () => {
  const result = normalizeListViewState({
    search: 42,
    filters: { level: { include: '3', exclude: [1, '2'] }, school: { include: ['Ограждение'] } },
    sortDirection: 'sideways',
    showFavorites: 'yes',
  }, 'spells');
  assert.deepEqual(result.filters, { school: { include: ['Ограждение'], exclude: [] } });
  assert.equal(result.search, '');
  assert.equal(result.sortDirection, 'asc');
  assert.equal(result.showFavorites, false);
  assert.deepEqual(Object.keys(result).sort(), Object.keys(defaultListViewState).sort());
});

test('save writes JSON under the shared key and survives a reload', () => {
  const storage = fakeStorage();
  const preferences = { spells: { ...defaultListViewState, sortField: 'level' } };
  saveListViewPreferences(preferences, storage);
  assert.equal(JSON.parse(storage.data[LIST_VIEW_STORAGE_KEY]).spells.sortField, 'level');
  assert.deepEqual(loadListViewPreferences(storage), preferences);
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/listViewPreferences.test.js`
Expected: FAIL — module `src/utils/listViewPreferences.js` not found.

- [ ] **Step 3: Implement the module**

In `src/utils/listViewPreferences.js`:

- `normalizeListViewState(value, category)`: ignore non-objects/arrays; build a fresh object from `defaultListViewState`; accept `search` only when `typeof === 'string'`; `showFavorites` only boolean; `sortDirection` only `asc`/`desc`; `sortField` only when included in `getSortOptions(category).map(o => o.field)`; for `filters`, keep an entry only when every present `include`/`exclude` value is an array, retain only string members, normalize missing arrays to `[]`, and drop the entry if both arrays end up empty.
- `loadListViewPreferences(storage)`: return `{}` when storage/getItem is missing, JSON throws, or parsed value is not a plain object; otherwise map each key to `normalizeListViewState(value, key)`.
- `saveListViewPreferences(preferences, storage)`: no-op when storage is missing; otherwise `setItem(LIST_VIEW_STORAGE_KEY, JSON.stringify(preferences))` inside `try/catch`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/listViewPreferences.test.js` → 5/5 PASS.
Then: `npm test` → all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/listViewPreferences.js tests/listViewPreferences.test.js
git commit -m "feat: add persisted list view preferences"
```

### Task 2: Подключение настроек к спискам

**Files:**
- Modify: `src/components/SearchBar.jsx`
- Modify: `src/components/FilterPanel.jsx`
- Modify: `src/pages/CategoryList.jsx`
- Create: `tests/categoryPreferences.test.js`

**Interfaces:**
- Consumes: Task 1 exports, including `loadListViewPreferences`, `saveListViewPreferences`, `defaultListViewState`.
- Produces: страница списка восстанавливает и сохраняет настройки текущего раздела; `SearchBar` принимает `value`, `FilterPanel` принимает `selected`.

- [ ] **Step 1: Write the failing SSR tests**

Use the Vite SSR harness already proven in `tests/itemdetail.test.js:9-17` (`createServer`, `ssrLoadModule`, `renderToStaticMarkup`, `StaticRouter`, `FavoritesProvider`). Stub `globalThis.localStorage` before creating the server and restore it in `finally`.

```js
test('saved search and sort direction are restored in the spell list', async () => {
  // localStorage: { spells: { search: 'Мгновенная', sortField: 'level',
  //   sortDirection: 'desc', filters: {}, showFavorites: false } }
  // render CategoryList at /category/spells
  assert.match(html, /value="Мгновенная"/);
  assert.match(html, /aria-label="Сортировать по возрастанию"/);
  assert.match(html, /1 записей/);
});

test('saved filters apply only to their own category', async () => {
  // localStorage: { spells: { ...default, filters: { level: { include: ['3'], exclude: [] } } } }
  // render /category/spells and /category/monsters with the same storage
  const level3 = data.spells.filter((entry) => entry.level === 3).length;
  const visibleMonsters = data.monsters.filter((entry) => entry.hidden !== true).length;
  assert.match(spellsHtml, new RegExp(`${level3} записей`));
  assert.match(monstersHtml, new RegExp(`${visibleMonsters} записей`));
});
```

Expected: FAIL on the search value / count assertions because saved preferences are ignored.

- [ ] **Step 2: Make `SearchBar` controlled**

Change signature to `export default function SearchBar({ value = '', onSearch, placeholder = 'Поиск...' })`. Remove local `useState`; render `value={value}`; `onChange` still calls `onSearch(e.target.value)`.

- [ ] **Step 3: Make `FilterPanel` controlled**

Change signature to `export default function FilterPanel({ options, selected = {}, onFilterChange, labels = {} })`. `handleCheckboxChange` and `getState` read `selected[field]` instead of `options[field].selected`. Remove the mutation `options[field].selected = newState`. `openSections` stays local.

- [ ] **Step 4: Wire preferences into `CategoryList`**

- Replace the five independent `useState` calls with `const [preferences, setPreferences] = useState(() => loadListViewPreferences());`.
- Derive `const view = preferences[category] ?? defaultListViewState;` and destructure `search`, `filters`, `sortField`, `sortDirection`, `showFavorites` from it.
- Add `const updateCurrentView = (updater) => setPreferences(prev => ({ ...prev, [category]: updater(prev[category] ?? defaultListViewState) }));`.
- Delete the `useEffect` on `[category]` that resets filters/sort/favorites.
- Add `useEffect(() => saveListViewPreferences(preferences), [preferences]);`.
- Rewrite handlers through `updateCurrentView`:
  - `handleSearch(query)` → `{ ...view, search: query }`;
  - `handleFilterChange(field, selected)` → copy `view.filters`, set or delete `field` when `selected` is null;
  - sort `<select>` → `{ ...view, sortField: e.target.value, sortDirection: 'asc' }`;
  - direction button → `{ ...view, sortDirection: toggleSortDirection(view.sortDirection) }`;
  - favorites label → `{ ...view, showFavorites: !view.showFavorites }`.
- Pass `value={search}` to `SearchBar` and `selected={filters}` to `FilterPanel`.

- [ ] **Step 5: Run the tests**

Run: `node --test tests/categoryPreferences.test.js` → 2/2 PASS.
Then: `npm test` → all tests PASS.

- [ ] **Step 6: Build and verify in browser**

Run `npm run build` → succeeds (restore `src/data/tables.js` afterwards if the generator changes it; do not commit `dist/`, `node_modules/`, `package-lock.json`).

In the browser at `/STHomebrew`:
- set a spell search, level filter, descending sort and «Только избранное»; refresh — all remain;
- open a spell card and return via «← К списку» — all remain; also check browser «Назад»;
- switch to monsters and back to spells — spells settings remain, monsters keep their own;
- corrupt the `listViewPreferences` value in DevTools, refresh — list opens with default settings and no console error.

- [ ] **Step 7: Commit**

```bash
git add src/components/SearchBar.jsx src/components/FilterPanel.jsx src/pages/CategoryList.jsx tests/categoryPreferences.test.js
git commit -m "feat: persist list search, filters and sorting"
```
