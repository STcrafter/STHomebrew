# Spell Statblocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Показывать компактные оформленные статблоки в конце страниц заклинаний, заданные прямо в заклинании или во внешнем реестре.

**Architecture:** Добавляем чистые функции разрешения списка статблоков и ужатия полей, расширяем существующий `StatBlock` флагом `compact`, а страница заклинания выводит разрешённые блоки после описания. Внешний реестр остаётся опциональным; фактические данные кладутся inline в `spells.js`.

**Tech Stack:** React 18, Vite, `node:test`, без новых зависимостей.

**Spec:** `docs/superpowers/specs/2026-11-27-spell-statblocks-design.md`

## Global Constraints

- Статблоки всегда выводятся в конце страницы заклинания, после описания и `higher_levels`.
- Маркер в тексте не используется.
- Внешний вид — ужатый вариант А: имя, тип, КД/ХП/скорость, характеристики со спасбросками, навыки, защиты, чувства/языки/ОП, особенности и действия.
- Скрываются описание, изображение, легендарные действия, действия логова, описание логова, лор и места обитания.
- Отдельной карточки в разделе «Монстры» нет; `monsters.js` не меняется.
- Поддерживаются оба способа задания: inline-объект в заклинании и ссылка на id во внешнем реестре.
- Новые зависимости не добавляются.
- `.superpowers/` уже добавлен в `.gitignore`.

## Review Focus

- Заклинание без поля `statblocks` должно рендериться как раньше — `resolveStatblocks(undefined)` возвращает `[]` (Task 1, тест 1).
- Несколько статблоков должны идти в порядке объявления — Task 1, тест «mixed entries preserve order».
- Смешанный список строк и объектов должен разрешаться в один массив — Task 1, тот же тест.
- Неизвестный id должен давать видимое предупреждение, а не падать — Task 1, тест «unknown id»; Task 2, проверка в браузере.
- Компакт не должен показывать лор/легендарные/логово, но должен показывать имя, ОП и действия; обычная страница монстра при этом не меняется — Task 1, тест `compactStatblock`; Task 2, проверка в браузере.

---

### Task 1: Чистая работа со статблоками

**Files:**
- Create: `src/data/statblocks.js`
- Create: `src/utils/statblocks.js`
- Test: `tests/statblocks.test.js`

**Interfaces:**
- Consumes: ничего.
- Produces:
  - `resolveStatblocks(entries, registry = statblocks) -> Array<object | { id: string, missing: true }>`
  - `compactStatblock(block) -> object`
  - `statblocks` — пустой реестр, экспортируемый из `src/data/statblocks.js`.

- [ ] **Step 1: Write the failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveStatblocks, compactStatblock } from '../src/utils/statblocks.js';

test('resolveStatblocks returns [] when spell has no statblocks', () => {
  assert.deepEqual(resolveStatblocks(undefined), []);
});

test('resolveStatblocks passes an inline object through', () => {
  const inline = { id: 'spirit', name: 'Дух', armor_class: 12 };
  assert.deepEqual(resolveStatblocks([inline]), [inline]);
});

test('resolveStatblocks resolves a string from the registry', () => {
  const registry = { skeleton: { name: 'Скелет', hit_points: 13 } };
  assert.deepEqual(resolveStatblocks(['skeleton'], registry), [
    { id: 'skeleton', name: 'Скелет', hit_points: 13 },
  ]);
});

test('resolveStatblocks preserves mixed order', () => {
  const registry = { skeleton: { name: 'Скелет' } };
  const inline = { id: 'spirit', name: 'Дух' };
  assert.deepEqual(resolveStatblocks(['skeleton', inline], registry), [
    { id: 'skeleton', name: 'Скелет' },
    inline,
  ]);
});

test('resolveStatblocks marks unknown ids as missing', () => {
  assert.deepEqual(resolveStatblocks(['nope'], {}), [{ id: 'nope', missing: true }]);
});

test('compactStatblock removes story sections and keeps combat fields', () => {
  const block = {
    id: 'barricade',
    name: 'Мгновенная баррикада',
    type: 'Предмет переменного размера',
    armor_class: '12 + уровень заклинания',
    hit_points: '10 × уровень заклинания',
    damage_immunities: ['Яд', 'Психика'],
    challenge_rating: 0,
    actions: [{ name: 'Взрывная разборка', description: '...' }],
    description: 'длинное описание',
    image: '/image.png',
    legendary_actions: { uses: 3 },
    lair_actions: { description: '...' },
    lair_description: { description: '...' },
    lore: { title: 'Предания' },
    habitat: ['Горы'],
  };
  const result = compactStatblock(block);
  assert.equal(result.name, 'Мгновенная баррикада');
  assert.equal(result.armor_class, '12 + уровень заклинания');
  assert.equal(result.challenge_rating, 0);
  assert.deepEqual(result.actions, block.actions);
  for (const key of [
    'description', 'image', 'legendary_actions', 'lair_actions',
    'lair_description', 'lore', 'habitat',
  ]) {
    assert.equal(key in result, false, `${key} должен быть удалён`);
  }
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test tests/statblocks.test.js`  
Expected: FAIL, модуль `src/utils/statblocks.js` не найден.

- [ ] **Step 3: Implement the functions and registry**

В `src/data/statblocks.js` экспортировать `statblocks` как пустой объект.

В `src/utils/statblocks.js` реализовать:
- `resolveStatblocks(entries = [], registry = statblocks)`:
  - значение, не являющееся массивом, считать пустым списком;
  - объект вернуть как копию через spread;
  - строку найти в `registry`; если найдено — вернуть копию с полем `id`, иначе `{ id, missing: true }`;
  - остальные типы пропустить.
- `compactStatblock(block)` — вернуть копию `block` без ключей `description`, `image`, `legendary_actions`, `lair_actions`, `lair_description`, `lore`, `habitat`.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test tests/statblocks.test.js`  
Expected: PASS, 6/6.

- [ ] **Step 5: Commit**

```bash
git add src/data/statblocks.js src/utils/statblocks.js tests/statblocks.test.js
git commit -m "feat: add spell statblock utilities"
```

### Task 2: Показ статблоков на странице заклинания

**Files:**
- Modify: `src/components/StatBlock.jsx`
- Modify: `src/components/StatBlock.module.css`
- Modify: `src/pages/ItemDetail.jsx`
- Modify: `src/pages/ItemDetail.module.css`
- Modify: `src/data/spells.js`

**Interfaces:**
- Consumes:
  - `resolveStatblocks(entries, registry)` из Task 1
  - `compactStatblock(block)` из Task 1
- Produces: страница заклинания выводит статблоки в конце; `StatBlock` поддерживает `compact`.

- [ ] **Step 1: Add `compact` support to `StatBlock`**

Изменить сигнатуру на `export default function StatBlock({ monster, compact = false })`.  
Источник данных: `compact ? compactStatblock(monster?.statblock || monster) : (monster?.statblock || monster)`.  
В шапке компонента при `compact && data.name` вывести имя отдельным элементом перед типом. Обычный режим оставить без изменений.

- [ ] **Step 2: Add styles**

В `StatBlock.module.css` добавить класс для имени в компактной шапке.  
В `ItemDetail.module.css` добавить классы для обёртки статблоков и предупреждения об отсутствующем id: отступ сверху между описанием и первой карточкой, отступ между карточками, стиль предупреждения по образцу `.table-error`.

- [ ] **Step 3: Render statblocks in `ItemDetail.jsx`**

В ветке `case 'spells'` после блока `higher_levels` вывести `resolveStatblocks(item.statblocks)`:
- обычный объект — `<StatBlock key={block.id ?? index} monster={block} compact />`;
- объект с `missing: true` — абзац `⚠️ Статблок "${block.id}" не найден` с классом предупреждения.
Заголовок «Статблоки» не добавлять.

- [ ] **Step 4: Add one inline statblock to `spells.js`**

У заклинания `spg_conj_3` («Мгновенная баррикада») заменить текущее описание на:

```js
description: 'Вы создаёте баррикаду не больше 10-футового куба в незанятом пространстве в пределах дистанции, которая остаётся неподвижной на длительность или пока не будет уничтожена. Вы решаете, как выглядит баррикада, включая её размер, форму и то, непрозрачна она или прозрачна.',
```

Добавить поле:

```js
statblocks: [
  {
    id: 'instant_barricade',
    name: 'Мгновенная баррикада',
    type: 'Предмет переменного размера',
    armor_class: '12 + уровень заклинания',
    hit_points: '10 × уровень заклинания',
    damage_immunities: ['Яд', 'Психика'],
    actions: [
      {
        name: 'Взрывная разборка',
        description: 'Если хиты баррикады опускаются до 0, каждое существо в пределах 5 футов от неё должно преуспеть в спасброске Ловкости, иначе получит урон силой в количестве к6, равном уровню заклинания. Пространство, прежде занимаемое баррикадой, затем становится труднопроходимой местностью до конца длительности заклинания.',
      },
    ],
  },
],
```

`higher_levels` не менять. Другие описания не трогать.

- [ ] **Step 5: Build and test**

Run: `npm test`  
Expected: PASS, все тесты зелёные.

Run: `npm run build`  
Expected: успешная сборка без ошибок.

- [ ] **Step 6: Verify in browser**

Открыть `/category/spells/spg_conj_3` и проверить:
- статблок находится после описания и «На более высоких уровнях»;
- видны имя, тип, КД, ХП, иммунитеты и действие;
- нет заголовка «Статблоки», легендарных действий, лора и картинок;
- консоль без ошибок.

Открыть любую страницу монстра с легендарными действиями и проверить, что обычный вид не изменился.

- [ ] **Step 7: Commit**

```bash
git add src/components/StatBlock.jsx src/components/StatBlock.module.css src/pages/ItemDetail.jsx src/pages/ItemDetail.module.css src/data/spells.js
git commit -m "feat: render compact statblocks in spells"
```
