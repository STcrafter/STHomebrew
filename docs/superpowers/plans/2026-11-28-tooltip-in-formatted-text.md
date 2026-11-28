# Tooltip in formatted text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `[tooltip:...]` render as the same focusable `i` marker in `renderFormattedText` and `renderFormattedFeature` as it already does in `Markdown`, without replacing the formatter or changing page structure.

**Architecture:** Keep the existing `renderFormattedText` → `[table:id]` split → paragraphs pipeline. Replace only paragraph HTML-string assembly with React nodes so tooltip markers can be inserted safely alongside text, `<strong>` and `<br />`. Add matching global CSS for the marker and bubble.

**Tech Stack:** React 18, Vite SSR test harness (`createServer` + `ssrLoadModule`), Node test runner, CSS custom properties.

**Spec:** `docs/superpowers/specs/2026-11-28-tooltip-in-formatted-text-design.md`

## Global Constraints

- Do not modify `src/components/Markdown.jsx`, `src/components/Markdown.module.css`, `src/utils/markdown.js`, page components, statblocks, or data files.
- Preserve all current formatter behavior: `**bold**`, `\n` → `<br />`, `\n\n` → paragraphs, inline and standalone `[table:id]`, HTML escaping.
- Tooltip body is plain text in `data-tip`; `**...**` inside it stays literal, matching `Markdown`.
- Marker is a `<span>` with `class="formatted-tooltip"`, `tabIndex={0}`, text `i`, visible on `:hover` and `:focus` using CSS `content: attr(data-tip)`.
- No click/tap handler, no ARIA changes, no dependency changes.

## Review Focus

- Inline `[table:id]` after other text (e.g. `**Заголовок** [table:id]`): table must still appear, not a literal reference → Task 1 test `formatted text keeps inline table references`.
- HTML inside a tooltip body: must stay escaped text in the attribute, never an element → Task 1 test `tooltip text escapes HTML`.
- Bold text adjacent to a tooltip: both must render without swallowing each other → Task 1 test `formatted text renders bold text next to a tooltip`.
- Multi-paragraph and single-newline text: paragraph count and `<br />` must not change → Task 1 test `formatted text preserves paragraphs and line breaks`.
- Feature descriptions with tooltips and HTML-like feature names: tooltip works and name stays escaped → Task 2 tests `feature description renders a tooltip` and existing `feature names are escaped in generated markup`.

---

### Task 1: Tooltip tokens in `renderFormattedText`

**Files:**
- Modify: `src/utils/helpers.js:147-249`
- Test: `tests/hygiene.test.js`

**Interfaces:**
- Consumes: existing `renderFormattedText(text)` callers in `ItemDetail.jsx` and `ClassDetail.jsx`.
- Produces: `renderFormattedText(text, prefixNode = null)`; optional React node prepended to the first text paragraph, used by Task 2. Returns the same shape as before (`React.ReactNode[] | null`). Internal helper `renderParagraphText(text: string, keyPrefix: string, prefixNode: React.ReactNode | null) -> React.ReactNode[]` tokenizes a single paragraph.

- [ ] **Step 1: Write failing tests** in `tests/hygiene.test.js`, following the existing Vite SSR pattern. Add a helper inside the test file that opens a Vite server, loads `renderFormattedText`, renders `React.createElement('div', null, renderFormattedText(input))` with `renderToStaticMarkup`, and closes the server in `finally`:

```js
async function renderFormatted(input) {
  const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const { renderFormattedText } = await server.ssrLoadModule('/src/utils/helpers.js');
    return renderToStaticMarkup(React.createElement('div', null, renderFormattedText(input)));
  } finally {
    await server.close();
  }
}

test('formatted text renders a tooltip marker instead of raw markup', async () => {
  const html = await renderFormatted('Перед [tooltip: Подсказка] после');
  assert.match(html, /data-tip="Подсказка"/);
  assert.match(html, />i<\/span>/);
  assert.ok(!html.includes('[tooltip:'));
});

test('formatted text renders bold text next to a tooltip', async () => {
  const html = await renderFormatted('**жирный** [tooltip: Подсказка]');
  assert.match(html, /<strong>жирный<\/strong>/);
  assert.match(html, /data-tip="Подсказка"/);
});

test('tooltip text escapes HTML', async () => {
  const html = await renderFormatted('[tooltip:<img src=x onerror=alert(1)>]');
  assert.ok(!html.includes('<img'));
  assert.match(html, /&lt;img/);
});

test('formatted text keeps inline table references', async () => {
  const html = await renderFormatted('**Мутации** [table:ruinbound_mutations]');
  assert.match(html, /formatted-table/);
  assert.ok(!html.includes('[table:'));
});

test('formatted text preserves paragraphs and line breaks', async () => {
  const html = await renderFormatted('первая\nвторая\n\nтретья');
  assert.equal((html.match(/formatted-paragraph/g) || []).length, 2);
  assert.match(html, /<br\/>/);
  assert.match(html, /третья/);
});
```

- [ ] **Step 2: Run the new tests**

Run: `node --test --test-name-pattern 'tooltip|formatted text' tests/hygiene.test.js`
Expected: FAIL — tooltip assertions fail, table/bold/paragraph tests pass (baseline).

- [ ] **Step 3: Implement tokenization in `src/utils/helpers.js`**

Replace `renderPlainText` internals with React-node assembly. Parse a paragraph with `\[tooltip:([^\]]*)\]` first, then `\*\*(.*?)\*\*` inside non-tooltip parts; emit `<span className="formatted-tooltip" tabIndex={0} data-tip={trimmed}>i</span>`, `<strong>`, `<br />` and plain text nodes. Keep the outer `renderFormattedText` `[table:id]` split and `prefixNode` insertion in the first text paragraph unchanged in behavior. Reset regex `lastIndex` per call.

- [ ] **Step 4: Run the tests**

Run: `node --test tests/hygiene.test.js`
Expected: PASS, including the pre-existing HTML-escaping test.

- [ ] **Step 5: Add the route-level test** in `tests/itemdetail.test.js`, using the same Vite SSR/`StaticRouter` setup as the existing spell test with location `/category/subclasses/reliquarian`:

```js
test('subclass detail renders data tooltip instead of raw markup', async () => {
  const savedLocalStorage = globalThis.localStorage;
  globalThis.localStorage = { getItem: () => null, setItem: () => {} };
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true, watch: null },
  });
  try {
    const { default: ItemDetail } = await server.ssrLoadModule('/src/pages/ItemDetail.jsx');
    const { FavoritesProvider } = await server.ssrLoadModule('/src/context/FavoritesContext.jsx');
    const html = renderToStaticMarkup(
      React.createElement(
        StaticRouter,
        { location: '/category/subclasses/reliquarian' },
        React.createElement(
          FavoritesProvider,
          null,
          React.createElement(
            Routes,
            null,
            React.createElement(Route, {
              path: '/category/:category/:id',
              element: React.createElement(ItemDetail),
            })
          )
        )
      )
    );
    assert.match(html, /data-tip=/);
    assert.match(html, /formatted-tooltip/);
    assert.ok(!html.includes('[tooltip:'));
  } finally {
    await server.close();
    if (savedLocalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = savedLocalStorage;
  }
});
```

- [ ] **Step 6: Run it**

Run: `node --test tests/itemdetail.test.js`
Expected: FAIL before the implementation in this task, PASS after.

- [ ] **Step 7: Commit**

```bash
git add src/utils/helpers.js tests/hygiene.test.js tests/itemdetail.test.js docs/superpowers/specs/2026-11-28-tooltip-in-formatted-text-design.md docs/superpowers/plans/2026-11-28-tooltip-in-formatted-text.md
git commit -m "feat: support tooltip markup in formatted text"
```

### Task 2: Feature descriptions with tooltips

**Files:**
- Modify: `src/utils/helpers.js:251-278`
- Test: `tests/hygiene.test.js`

**Interfaces:**
- Consumes: `renderFormattedText(text, prefixNode)` from Task 1.
- Produces: unchanged `renderFormattedFeature(name, description)`.

- [ ] **Step 1: Write the failing test** in `tests/hygiene.test.js`:

```js
test('feature description renders a tooltip', async () => {
  const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    const { renderFormattedFeature } = await server.ssrLoadModule('/src/utils/helpers.js');
    const html = renderToStaticMarkup(
      React.createElement('div', null, renderFormattedFeature('Название', 'Описание [tooltip: Подсказка]'))
    );
    assert.match(html, /<em><strong>Название\.<\/strong><\/em>/);
    assert.match(html, /data-tip="Подсказка"/);
    assert.ok(!html.includes('[tooltip:'));
  } finally {
    await server.close();
  }
});
```

- [ ] **Step 2: Run it**

Run: `node --test --test-name-pattern 'feature description renders a tooltip|feature names are escaped' tests/hygiene.test.js`
Expected: FAIL on the new test; the pre-existing escaping test passes.

- [ ] **Step 3: Implement**

Pass `<em><strong>{`${name}.`}</strong></em>` as `prefixNode` to `renderFormattedText` instead of building an HTML string. This deliberately fixes the existing bug where the injected markup was escaped and shown as literal text. Keep the no-description branch byte-for-byte in behavior.

- [ ] **Step 4: Run the tests**

Run: `node --test tests/hygiene.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/helpers.js tests/hygiene.test.js
git commit -m "feat: support tooltip markup in feature descriptions"
```

### Task 3: Global tooltip styles

**Files:**
- Modify: `src/index.css` (after `.table-error`)
- Test: `tests/hygiene.test.js`

**Interfaces:**
- Consumes: `.formatted-tooltip` emitted by Tasks 1–2.
- Produces: CSS rules only; no new JS API.

- [ ] **Step 1: Write the failing static test** in `tests/hygiene.test.js`:

```js
test('formatted tooltip has hover and focus styles', () => {
  const css = read('src/index.css');
  assert.match(css, /\.formatted-tooltip\s*\{/);
  assert.match(css, /content:\s*attr\(data-tip\)/);
  assert.match(css, /\.formatted-tooltip:hover[^{]*,\s*\.formatted-tooltip:focus/);
  assert.match(css, /\.formatted-tooltip:focus-visible/);
});
```

- [ ] **Step 2: Run it**

Run: `node --test --test-name-pattern 'formatted tooltip has hover' tests/hygiene.test.js`
Expected: FAIL.

- [ ] **Step 3: Add CSS**

Copy the marker, `::after` bubble, `::before` arrow, `:hover`/`:focus` reveal and `:focus-visible` outline rules from `src/components/Markdown.module.css`, changing selectors from `.markdown .tooltip` to `.formatted-tooltip`. Keep the existing CSS custom properties.

- [ ] **Step 4: Run the test**

Run: `node --test tests/hygiene.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/index.css tests/hygiene.test.js
git commit -m "style: add global formatted tooltip styles"
```

### Task 4: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Browser check**

Start `npm run dev`, open `/STHomebrew/category/subclasses/reliquarian`, verify the `i` marker appears inside the feature text and shows the bubble on hover and on keyboard focus. Close the tab and stop the dev server.
