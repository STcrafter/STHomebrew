# Сортировка заклинаний Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** В разделе «Заклинания» заменить набор кнопок сортировки на селектор типа и отдельную кнопку направления, добавив сортировку по уровню, школе и классу с алфавитным порядком внутри группы.

**Architecture:** Чистая функция сортировки выносится в `src/utils/sorting.js` и покрывается тестами Node; `CategoryList.jsx` остаётся тонким слоем: селектор меняет `sortField` и сбрасывает направление, кнопка ↑/↓ меняет только направление. Стили переиспользуют существующие токены темы.

**Tech Stack:** React 18, Vite 4, ES modules, CSS Modules, встроенный тестовый раннер Node (`node:test`) — новых зависимостей не добавляем.

**Spec:** `docs/superpowers/specs/2026-11-27-spell-sorting-design.md`

## Global Constraints

- Значения `sortField`: ровно `'name'`, `'challenge_rating'`, `'level'`, `'school'`, `'classes'`.
- Значения направления: ровно `'asc'` и `'desc'`; при смене типа всегда `'asc'`.
- Метки селектора на русском, ровно: «По алфавиту», «По уровню», «По школе», «По классу», «По опасности».
- Ключ сортировки по классу — первый по алфавиту элемент `classes` через `localeCompare`; пустой/отсутствующий массив даёт пустую строку.
- Вторичная сортировка по названию всегда по возрастанию, в том числе при основном `'desc'`; применяется для полей `'level'`, `'school'`, `'classes'`. Поведение `'name'` и `'challenge_rating'` сохраняется как сейчас (вторичного ключа нет).
- Сравнение строк регистронезависимое через `toLowerCase().localeCompare(...)`; уровень и ОП сравниваются числами с подстановкой `0` для отсутствующих значений.
- Функция сортировки не мутирует входной массив.
- Не менять `ItemDetail.jsx`, фильтры, поиск, карточки и prev/next на странице заклинания.

## Review Focus

- Заклинание с `classes: ['Жрец', 'Волшебник']` должно попасть в группу «Волшебник», а не «Жрец», несмотря на порядок в данных → Task 1, тест `sorts by alphabetically first class`.
- Уровни `1, 2, 10` должны сравниваться численно, а не как строки → Task 1, тест `sorts levels numerically with names alphabetical inside a level`.
- При `'desc'` меняется порядок групп, но не порядок имён внутри группы → Task 1, тест `descending direction reverses groups but keeps names alphabetical`.
- Отсутствующие `classes`/`school` не должны приводить к исключению → Task 1, тест `does not throw on missing sort keys`.
- Селектор должен содержать разные наборы для заклинаний/монстров/остальных разделов, а кнопка направления не должна менять тип → Task 1, тест `getSortOptions returns category-specific options` + `toggleSortDirection`; Task 2, шаг проверки в браузере.

---

### Task 1: Чистая сортировка и тесты

**Files:**
- Create: `src/utils/sorting.js`
- Create: `tests/sorting.test.js`
- Modify: `package.json:5-11` (добавить script `test`)

**Interfaces:**
- Consumes: ничего (чистая функция).
- Produces:
  - `getSortOptions(category: string): Array<{ field: string, label: string }>`
  - `sortItems(items: Array<object>, sortField: string, sortDirection: 'asc' | 'desc'): Array<object>`
  - `toggleSortDirection(direction: 'asc' | 'desc'): 'asc' | 'desc'`

- [ ] **Step 1: Написать падающие тесты в `tests/sorting.test.js`**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { getSortOptions, sortItems, toggleSortDirection } from '../src/utils/sorting.js';

const spells = [
  { name: 'Яблоко', level: 1, school: 'Эвокация', classes: ['Волшебник'] },
  { name: 'Бананы', level: 1, school: 'Некромантия', classes: ['Жрец', 'Волшебник'] },
  { name: 'Вишня', level: 2, school: 'Эвокация', classes: ['Жрец'] },
  { name: 'Груша', level: 10, school: 'Ограждение', classes: ['Друид'] },
  { name: 'Арбуз', level: 1, school: 'Некромантия', classes: [] },
];
const names = (items) => items.map((item) => item.name);
```

Добавить тесты с точными именами и проверками:

- `sorts levels numerically with names alphabetical inside a level`: `names(sortItems(spells, 'level', 'asc'))` → `['Арбуз', 'Бананы', 'Яблоко', 'Вишня', 'Груша']`; отдельно проверить, что исходный `spells` не изменился.
- `descending direction reverses groups but keeps names alphabetical`: `names(sortItems(spells, 'level', 'desc'))` → `['Груша', 'Вишня', 'Арбуз', 'Бананы', 'Яблоко']`; `names(sortItems(spells, 'school', 'desc'))` → `['Вишня', 'Яблоко', 'Груша', 'Бананы', 'Арбуз']`.
- `sorts schools alphabetically with names alphabetical inside a school`: `names(sortItems(spells, 'school', 'asc'))` → `['Арбуз', 'Бананы', 'Груша', 'Вишня', 'Яблоко']` (порядок школ: пустая, Некромантия, Ограждение, Эвокация; внутри Эвокации — Вишня, Яблоко).
- `sorts by alphabetically first class`: `names(sortItems(spells, 'classes', 'asc'))` → `['Арбуз', 'Бананы', 'Яблоко', 'Груша', 'Вишня']`; «Бананы» должен идти в группе «Волшебник», а не «Жрец».
- `does not throw on missing sort keys`: `sortItems([{ name: 'Без полей' }, { name: 'А' }], 'classes', 'asc')` не бросает исключение.
- `preserves name and challenge_rating sorting`: `names(sortItems([{name:'б'},{name:'А'}], 'name', 'asc'))` → `['А','б']`; для `[{name:'Б',challenge_rating:1},{name:'А',challenge_rating:2}]` с полем `'challenge_rating'` и `'asc'` → `['Б','А']`.
- `getSortOptions returns category-specific options`: для `'spells'` → массив пар `{field,label}` в порядке `name/level/school/classes` с метками «По алфавиту», «По уровню», «По школе», «По классу»; для `'monsters'` → `name/challenge_rating` с метками «По алфавиту», «По опасности»; для `'items'` → только `name`.
- `toggleSortDirection`: `'asc'` → `'desc'`, `'desc'` → `'asc'`.

- [ ] **Step 2: Добавить тестовый скрипт и подтвердить падение**

В `package.json` в объект `scripts` добавить `"test": "node --test"`.

Run: `npm test`
Expected: FAIL — `Cannot find module '../src/utils/sorting.js'`.

- [ ] **Step 3: Реализовать `src/utils/sorting.js`**

Экспортировать три функции с сигнатурами из Interfaces. `getSortOptions` строит базовый массив `[{field:'name',label:'По алфавиту'}]`, добавляет `'По опасности'` только для `'monsters'` и три опции заклинаний только для `'spells'`. `toggleSortDirection` — простое переключение.

`sortItems` возвращает новый массив и сравнивает по правилам Global Constraints: сначала primary (число для `level`/`challenge_rating`, строка для остальных), затем ключ направления (`asc` — как есть, `desc` — `-1`), затем, только для полей `level`/`school`/`classes`, вторичное сравнение по `name.toLowerCase()` по возрастанию. Для `classes` primaryKey — минимальная по `localeCompare` строка из массива (или `''`).

- [ ] **Step 4: Прогнать тесты**

Run: `npm test`
Expected: PASS — все 8 тестов зелёные.

- [ ] **Step 5: Коммит**

```bash
git add package.json src/utils/sorting.js tests/sorting.test.js
git commit -m "test: add pure sorting helpers with spell sort tests"
```

---

### Task 2: Селектор типа и кнопка направления в UI

**Files:**
- Modify: `src/pages/CategoryList.jsx:2-10, 108-177, 195-224`
- Modify: `src/pages/CategoryList.module.css:82-123`

**Interfaces:**
- Consumes: `getSortOptions(category)`, `sortItems(items, sortField, sortDirection)`, `toggleSortDirection(direction)` из Task 1.
- Produces: рабочий UI без изменения внешнего API компонента.

- [ ] **Step 1: Переписать панель сортировки в `CategoryList.jsx`**

Импортировать три функции из `../utils/sorting`. Удалить локальный массив `sortOptions` (строки 173–177). В `filteredItems` заменить цепочку `if (sortField === ...) result.sort(...)` на `return sortItems(result, sortField, sortDirection)`; зависимости `useMemo` не меняются.

Вместо цикла кнопок (строки 200–213) поставить:

```jsx
<select
  className={styles.sortSelect}
  value={sortField}
  onChange={(e) => {
    setSortField(e.target.value);
    setSortDirection('asc');
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
  onClick={() => setSortDirection(prev => toggleSortDirection(prev))}
  title={sortDirection === 'asc' ? 'По убыванию' : 'По возрастанию'}
  aria-label={sortDirection === 'asc' ? 'Сортировать по убыванию' : 'Сортировать по возрастанию'}
>
  {sortDirection === 'asc' ? '↑' : '↓'}
</button>
```

Блок «⭐ Только избранное» и `SearchBar` оставить без изменений. Функцию `handleSortFieldChange` удалить, так как она больше не используется.

- [ ] **Step 2: Обновить стили в `CategoryList.module.css`**

Удалить правила `.sortButton`, `.sortButton:hover`, `.sortButton.active`, `.sortArrow`. Добавить `.sortSelect` и `.directionButton` с теми же токенами, что использовались у кнопок: `font-size: 0.9rem`, `padding: 0.3rem 0.8rem`, `border: 1px solid var(--border-color)`, `border-radius: 6px`, `background: var(--bg-card)`, `color: var(--text-primary)`, `cursor: pointer`. Для `.directionButton` добавить `min-width: 2.2rem` и центрирование содержимого.

- [ ] **Step 3: Проверить сборку**

Run: `npm run build`
Expected: сборка завершается без ошибок.

- [ ] **Step 4: Проверить в браузере**

Run: `npm run dev`, открыть `/category/spells`.

Expected по очереди: «По алфавиту ↑» — названия по алфавиту; «По уровню ↑» — уровни по возрастанию, внутри каждого уровня названия по алфавиту; «По школе ↑» — школы по алфавиту, внутри школы названия по алфавиту; «По классу ↑» — группы по классам, внутри группы названия по алфавиту; для каждого типа кнопка ↑/↓ меняет только направление групп и не сбрасывает выбранный тип, а названия внутри группы остаются по алфавиту. Смена типа в селекторе возвращает ↑. На `/category/monsters` в селекторе только «По алфавиту» и «По опасности»; на остальных разделах — только «По алфавиту».

- [ ] **Step 5: Коммит**

```bash
git add src/pages/CategoryList.jsx src/pages/CategoryList.module.css
git commit -m "feat: add sort type selector and direction button to spell list"
```
