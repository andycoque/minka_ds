# Figma Design System Reference

Everything an agent needs to translate Minka DS tokens and components into Figma — and to avoid breaking what's already built.

---

## File

| Key | Value |
|---|---|
| File key | `2DC3aTTWVhFvefXezAcw8J` |
| File name | Minka DS |
| Token env | `.env` — `FIGMA_TOKEN` and `FIGMA_FILE_KEY` (gitignored, never share in chat) |
| Primary page | `Components` (node `0:1`) |

---

## Variable Collections

Two collections, both with a single mode named `Default`.

### Primitives (202 variables)

Raw scale values. Named with `/` groups — Figma renders these as nested folders.

| Group | Naming pattern | Type | Example |
|---|---|---|---|
| Color | `Color/{scale}/{step}` | COLOR | `Color/neutral/50` |
| Spacing | `Spacing/{n}` | FLOAT (px) | `Spacing/4` = 16 |
| Radius | `Radius/{name}` | FLOAT (px) | `Radius/md` = 8 |
| Font size | `Typography/font-size/{name}` | FLOAT (px) | `Typography/font-size/base` = 16 |
| Font weight | `Typography/font-weight/{n}` | **STRING** | `Typography/font-weight/600` = `"Semi Bold"` |
| Line height | `Typography/line-height/{name}` | **FLOAT (percent ×100)** | `Typography/line-height/tight` = 125 |
| Letter spacing | `Typography/letter-spacing/{name}` | **FLOAT (percent)** | `Typography/letter-spacing/tight` = -4 |
| Font family | `Typography/font-family/{name}` | STRING | `Typography/font-family/sans` = `"PP Neue Montreal"` |

### Semantic (78 variables)

Aliases that reference Primitives. Named with `/` groups.

| Group | Naming pattern | Type | Example |
|---|---|---|---|
| Color | `Color/{role}` | COLOR | `Color/bg/canvas`, `Color/text/default` |
| Radius | `Radius/{component}` | FLOAT (px) | `Radius/button` = 8 |
| Shadow | `Shadow/{name}` | STRING | `Shadow/card` |

---

## Critical Token Translations (CSS → Figma)

These are non-obvious conversions. Getting them wrong silently corrupts the system.

### Line height

CSS stores multipliers (`1.25`). Figma text styles use **percent** (`125`).

```
CSS/token multiplier × 100 = Figma lineHeight value
```

**Do NOT bind `lineHeight` to a variable.** Figma requires a typed object `{ unit: "PERCENT", value: 125 }` — a raw FLOAT variable carries no unit information and renders incorrectly. Set the raw value directly on each text style.

| Token name | CSS value | Figma `lineHeight` value |
|---|---|---|
| `none` | `1` | `{ unit: "PERCENT", value: 100 }` |
| `tight` | `1.25` | `{ unit: "PERCENT", value: 125 }` |
| `snug` | `1.375` | `{ unit: "PERCENT", value: 137.5 }` |
| `normal` | `1.5` | `{ unit: "PERCENT", value: 150 }` |
| `relaxed` | `1.625` | `{ unit: "PERCENT", value: 162.5 }` |
| `loose` | `1.75` | `{ unit: "PERCENT", value: 175 }` |

### Font weight

CSS uses numeric weights (`400`, `500`, `600`). Figma uses the **font style name string** — and the available names differ per family.

Variables must be type **STRING**, not FLOAT.

**PP Neue Montreal** (`Typography/font-family/sans`) — weights available in Figma:

| Token name | CSS value | Figma STRING value |
|---|---|---|
| `400` | `400` | `"Book"` |
| `500` | `500` | `"Medium"` |
| `600` | `600` | `"SemiBold"` |
| `700` | `700` | `"Bold"` |

Note: PP Neue Montreal uses `"Book"` (not `"Regular"`) for weight 400, and `"SemiBold"` (no space) for 600.

**Instrument Serif** (`Typography/font-family/serif`) — only two styles available:

| Available style | Figma STRING value |
|---|---|
| Regular | `"Regular"` |
| Italic | `"Italic"` |

No Medium or Semi Bold — do not use 500/600 weights with this family in Figma.

**SF Mono** (`Typography/font-family/mono`) — not available in Figma's font list. Use a substitute such as `"Roboto Mono"` or `"JetBrains Mono"` in Figma components. The CSS token value (`"SF Mono"`) still applies in code.

### Letter spacing

CSS stores em strings (`"-0.04em"`, `"0.1em"`). Figma text styles use a typed percent object.

**Do NOT bind `letterSpacing` to a variable.** Same reason as lineHeight — the unit is lost. Set the raw typed value directly.

| Token name | CSS value | Figma `letterSpacing` value |
|---|---|---|
| `tight` | `-0.04em` | `{ unit: "PERCENT", value: -4 }` |
| `normal` | `0` | `{ unit: "PERCENT", value: 0 }` |
| `wide` | `0.1em` | `{ unit: "PERCENT", value: 10 }` |

### Colors

CSS uses OKLCH. Figma variables use `{r, g, b, a}` floats in `[0, 1]`.

Use the `parse-tokens.mjs` script (`scripts/parse-tokens.mjs`) which uses `culori` to convert. Output is `/tmp/tokens.json`.

---

## Text Style → Variable Bindings

All 15 text styles are bound to Primitives variables via the Figma Plugin API. The field names Figma expects:

| Text property | `setBoundVariable` field | Variable type |
|---|---|---|
| Font size | `fontSize` | FLOAT |
| Font family | `fontFamily` | STRING |
| Font weight/style | `fontStyle` | STRING |
| Line height | `lineHeight` | FLOAT (percent) |
| Letter spacing | `letterSpacing` | FLOAT (percent) |

**Note:** `lineHeightPercent` / `letterSpacingPercent` are rejected by Figma — use `lineHeight` and `letterSpacing` directly.

### Text style → size variable map

| Style | `fontSize` variable |
|---|---|
| `display` | `Typography/font-size/7xl` (72px) |
| `heading-1` | `Typography/font-size/4xl` (36px) |
| `heading-2` | `Typography/font-size/3xl` (30px) |
| `heading-3` | `Typography/font-size/2xl` (24px) |
| `heading-4` | `Typography/font-size/xl` (20px) |
| `paragraph-lg` / `body-lg` | `Typography/font-size/lg` (18px) |
| `paragraph` / `body` | `Typography/font-size/base` (16px) |
| `paragraph-sm` / `body-sm` / `label` | `Typography/font-size/sm` (14px) |
| `label-sm` / `caption` | `Typography/font-size/xs` (12px) |
| `overline` | `Typography/font-size/2xs` (10px) |

---

## Plugin API Patterns

All Figma writes happen via `use_figma` MCP tool (Figma Plugin API). No REST API — the REST API lacks `file_variables` scope on the current plan.

### Standard helpers (copy into every `use_figma` call)

```javascript
// Semantic variable lookup
const semColl = figma.variables.getLocalVariableCollections().find(c => c.name === 'Semantic');
const S = {};
for (const id of semColl.variableIds) {
  const vr = figma.variables.getVariableById(id);
  if (vr) S[vr.name] = vr;
}

// Apply semantic color variable as a fill paint
function paint(path) {
  // path = e.g. 'action/primary/default'  (without 'Color/' prefix)
  const vr = S['Color/' + path];
  if (!vr) return { type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } };
  return figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', vr
  );
}

// Bind corner radius variables to a frame
function bindRadius(node, name) {
  // name = e.g. 'button'  (without 'Radius/' prefix)
  const vr = S['Radius/' + name];
  if (!vr) return;
  node.topLeftRadius = 8; node.topRightRadius = 8;
  node.bottomLeftRadius = 8; node.bottomRightRadius = 8;
  node.setBoundVariable('topLeftRadius', vr);
  node.setBoundVariable('topRightRadius', vr);
  node.setBoundVariable('bottomLeftRadius', vr);
  node.setBoundVariable('bottomRightRadius', vr);
}

// Create a text node
function txt(chars, size, style, colorPath) {
  const t = figma.createText();
  t.characters = chars;
  t.fontSize = size;
  t.fontName = { family: 'Inter', style };
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  if (colorPath) t.fills = [paint(colorPath)];
  return t;
}
```

### Auto-layout FILL — critical ordering rule

`layoutSizingHorizontal = 'FILL'` and `layoutSizingVertical = 'FILL'` **must** be set **after** `appendChild`/`insertChild`. Setting FILL before the node is inside an auto-layout parent throws:

```
Error: FILL can only be set on children of auto-layout frames
```

```javascript
// WRONG — throws
child.layoutSizingHorizontal = 'FILL';
parent.appendChild(child);

// CORRECT
parent.appendChild(child);
child.layoutSizingHorizontal = 'FILL';
```

### Corner radius binding

Bind individual corners (`topLeftRadius` etc.) rather than `cornerRadius`. When Figma mixes corner values, `cornerRadius` becomes `MIXED` and variable binding on it silently fails.

### Text styles

Always bind text nodes to local text styles via `textStyleId` — do NOT set `fontSize`, `fontName`, `lineHeight` manually on components. Get the style id with:

```javascript
const caption = figma.getLocalTextStyles().find(s => s.name === 'caption');
textNode.textStyleId = caption.id;
// Then set fills separately — textStyleId does not affect color
textNode.fills = [bindSem('text/inverse')];
```

Available styles: `display`, `heading-1` → `heading-4`, `paragraph-lg`, `paragraph`, `paragraph-sm`, `body-lg`, `body`, `body-sm`, `label`, `label-sm`, `caption`, `overline` (all Inter). Serif and light variants also available.

### Ring / focus effects

> **Note:** Semantic color variables are stored as OKLCH internally — `vr.valuesByMode[modeId]` does NOT return `{r,g,b}` directly. Use hardcoded RGB approximations for ring effects:
> - Focus ring (slate-500/50%): `{ r: 0.40, g: 0.45, b: 0.55, a: 0.5 }`
> - Error ring (red-500/20%): `{ r: 0.94, g: 0.27, b: 0.27, a: 0.2 }`
>
> Also always include `showShadowBehindNode: false` in DROP_SHADOW effects or the API will reject it.

Figma has no native ring component. Simulate CSS `box-shadow: 0 0 0 3px color` with `DROP_SHADOW`:

```javascript
// Read raw RGB from a semantic variable (for effects, which don't support variable binding)
const modeId = semColl.defaultModeId;
function getRgb(path) {
  const vr = S['Color/' + path];
  return vr ? (vr.valuesByMode[modeId] || { r: 0, g: 0, b: 0 }) : { r: 0, g: 0, b: 0 };
}

function ringEffect(colorPath, alpha) {
  const c = getRgb(colorPath);
  return {
    type: 'DROP_SHADOW',
    color: { r: c.r, g: c.g, b: c.b, a: alpha },
    offset: { x: 0, y: 0 },
    radius: 0,
    spread: 3,
    visible: true,
    blendMode: 'NORMAL',
  };
}

// Usage
frame.effects = [ringEffect('border/focus', 0.5)];
```

### Auto-height on ComponentNodes

`layoutSizingVertical = 'HUG'` fails on a detached component. The reliable pattern:

```javascript
const card = figma.createComponent();
card.layoutMode = 'VERTICAL';
card.counterAxisSizingMode = 'FIXED'; // lock width
card.resize(464, 10);                  // set width; height placeholder

page.appendChild(card);               // MUST attach before children

// ... append all children here ...

card.primaryAxisSizingMode = 'AUTO';  // set LAST — triggers height recalculation
```

If a component ends up in a ComponentSet with wrong height, find it in the scene and call `panel.primaryAxisSizingMode = 'AUTO'` after the fact — it recalculates immediately since the node is already in the scene graph.

### ComponentSet / variants

Component names must use `Property=Value, Property=Value` format:

```javascript
comp.name = 'State=Default, Size=Default';
const set = figma.combineAsVariants(components, page);
set.name = 'ComponentName';
```

### ComponentSet layout after combineAsVariants

`figma.combineAsVariants` produces a ComponentSet with `layoutMode = 'NONE'` — variants all stack at (0,0) and overlap. Always enable auto-layout manually after combining:

```javascript
const set = figma.combineAsVariants(components, page);
set.name = 'ComponentName';
set.layoutMode = 'HORIZONTAL';
set.layoutWrap = 'WRAP';
set.primaryAxisSizingMode = 'FIXED';  // fixed width so wrap kicks in
set.resize(1280, set.height);         // choose a width that gives readable rows
set.paddingLeft = 24; set.paddingRight  = 24;
set.paddingTop  = 24; set.paddingBottom = 24;
set.itemSpacing = 16;
set.counterAxisSpacing = 16;
```

Note: `layoutWrap = 'WRAP'` only works when `layoutMode === 'HORIZONTAL'`. Setting it on VERTICAL or NONE throws.

After setting WRAP, also set `counterAxisSizingMode = 'AUTO'` so the frame's height grows to fit all wrapped rows. Without it the set stays at its initial height and all rows appear collapsed:

```javascript
set.layoutMode = 'HORIZONTAL';
set.layoutWrap = 'WRAP';
set.primaryAxisSizingMode = 'FIXED';  // lock width so wrap triggers
set.counterAxisSizingMode = 'AUTO';   // height expands with wrapped rows
set.resize(targetWidth, set.height);  // only set width — height is now auto
```

### HORIZONTAL auto-layout — height recalculation

For VERTICAL components, calling `card.primaryAxisSizingMode = 'AUTO'` last triggers height recalculation. For HORIZONTAL components, the height is on the **counter axis** — same rule applies:

```javascript
// HORIZONTAL card (e.g. content-left + actions-right)
const card = figma.createComponent();
card.layoutMode = 'HORIZONTAL';
card.counterAxisSizingMode = 'AUTO'; // height will hug — but only recalculates after children
card.resize(400, 10); // placeholder height

page.appendChild(card);
// ... append all children ...

// Trigger height recalculation — same as primaryAxisSizingMode='AUTO' for VERTICAL
card.counterAxisSizingMode = 'FIXED';
card.counterAxisSizingMode = 'AUTO'; // re-set to force recalc
// OR: for a fixed-width card, omit primaryAxisSizingMode='AUTO' entirely;
// set primaryAxisSizingMode='FIXED' so the chosen width holds.
```

### Finding local components

`figma.getLocalComponents()` does not exist in this plugin environment. Use `page.findAll` instead:

```javascript
const allComps = page.findAll(n => n.type === 'COMPONENT');
const infoBadge = allComps.find(c =>
  c.parent && c.parent.name === 'Badge' && c.name.includes('Variant=Info')
);
```

### Instance layoutSizingVertical='HUG' collapses fixed-height components

When you place a Button (or any HORIZONTAL-layout component with FIXED sizing) inside an auto-layout frame and call `layoutSizingVertical = 'HUG'`, Figma collapses the instance height to its internal text content (~14px) rather than the component's defined frame height (36px).

**Fix:** after `add(parent, inst, 'HUG', 'HUG')`, resize to natural height and set FIXED:

```javascript
const inst = C.btnPrimary.createInstance();
add(parent, inst, 'HUG', 'HUG');
// HUG vertical collapses fixed instances — correct it:
inst.resize(inst.width, inst.mainComponent?.height || 36);
inst.layoutSizingVertical = 'FIXED';
```

Or to fix in bulk across a ComponentSet:

```javascript
set.findAll(() => true)
  .filter(n => n.type === 'INSTANCE' && n.mainComponent?.parent?.name === 'Button')
  .forEach(inst => {
    const h = inst.mainComponent?.height || 36;
    if (inst.height < h - 4) {
      inst.resize(inst.width, h);
      inst.layoutSizingVertical = 'FIXED';
    }
  });
```

### Instance children override — resizing inner frames

When a component instance has `counterAxisSizingMode='FIXED'` internally but is placed with `layoutSizingHorizontal='FILL'`, the outer bounds stretch to fill while the inner frame stays at the component's fixed width — leaving empty space on the right.

Fix: access the instance's first child (the inner override frame) and resize it, then cascade to its rows:

```javascript
const inner = tableInst.children[0];
if (inner) {
  inner.resize(targetW, inner.height);
  for (const row of inner.children || []) {
    try { row.resize(targetW, row.height); } catch(e) {}
  }
}
```

### Efficient plugin code — minimize context cost

Each `use_figma` call with 200+ lines of code costs a lot of context. Strategies:

- **Build one component type per call** (Count variants, then Amount variants, then Status) — errors only need a small targeted fix, not a full 250-line resend.
- **Fix scripts are separate from build scripts** — when a call succeeds partially, write a small patch that finds and corrects just the broken node rather than recreating everything.
- **Inspect before fixing** — run a short query to read node state (`type`, `layoutMode`, `width`, `height`, `children`) before writing the fix. Avoids guessing and another failed attempt.

---

## Icon Library

**Lucide Icons (Community)** — enabled as a team library in the Figma file.

Library key: `lk-6fe748910bd1fdb75620df44661eca85b2a5611ac07672df5100b476fca6d72110e1532f7cdcffecc8a354c32d99de12ae792342b86bafcb6e74ba4db8fe1bfc`

### Common icon component keys

| Icon | Component key |
|---|---|
| `chevron-down` | `601973c2d32bff7aee71d63ff19b6970d86d4cc9` |
| `chevrons-up-down` | `d593bd0d210522c9b4cbc44c1109da7770a3e130` |
| `check` | `b2cf9510b47fbdc4d681797d29d0ea486043ca05` |
| `x` | `b0ac684f0027322ce878a24374669cd6e4762a39` |
| `search` | `fb774b9466ee416256bd132b2816ee3954631afc` |
| `pencil` | `ecf850953478b866f698096330856245e5ed3368` |
| `eye` | `048346551dfe8b6b6c46e2b53b48c492615ae3de` |
| `copy` | `74099e7e54e7a124caf6eba02052e012a31ca37c` |
| `trash-2` | `d0cef3e91132103d5b6571ac1e7de18f1a02112c` |
| `plus` | `f25a472fca1a9b5106fccb4c8c87c9a4c084f711` |
| `rotate-ccw` | `798ddd9c8104209995218109d5567b909fcb6a83` |
| `chevron-right` | `e1cfc5ff46013cac19ee1c5a0156cf00c1a54f93` |

To find more icon keys, use `mcp__figma__search_design_system` with the library key filter.

### Icon stroke weight

Always set `strokeWeight = 1` on Lucide icon vectors. The community file defaults to 2px. Apply after inserting:

```javascript
inst.findAll(n => n.type === 'VECTOR').forEach(v => {
  if (v.strokes?.length > 0) {
    v.strokes = [p];      // color
    v.strokeWeight = 1;   // always 1px
  }
});
```

To fix all icons across the whole page at once:
```javascript
page.findAll(n => n.type === 'VECTOR' && n.strokes?.length > 0)
  .forEach(v => { v.strokeWeight = 1; });
```

### Using icons in plugin code

```javascript
// Import and create a 16×16 icon instance
const comp = await figma.importComponentByKeyAsync('601973c2d32bff7aee71d63ff19b6970d86d4cc9');
const inst = comp.createInstance();

// Insert into auto-layout parent FIRST, then resize and constrain
parent.appendChild(inst);
inst.resize(16, 16);
inst.layoutSizingHorizontal = 'FIXED';
inst.layoutSizingVertical   = 'FIXED';

// Apply a semantic color to the icon stroke (Lucide icons use strokes, not fills)
const colorVar = S['Color/text/default'];
const p = figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', colorVar
);
inst.findAll(n => n.type === 'VECTOR').forEach(v => {
  if (v.strokes?.length > 0) v.strokes = [p];
});
```

---

## Components Built

Located on the `Components` page, stacked vertically. Always query the actual bottom of the last component before placing a new one:

```javascript
const last = page.children.find(n => n.name === 'ScreenDetails');
const nextY = Math.round(last.y + last.height) + 100;
newComponentSet.y = nextY;
```

Three levels: **Atoms** → single-purpose primitives · **Components** → composed blocks · **Layouts** → full page-area templates (Sidebar always paired independently, never embedded).

---

### Atoms

Single-purpose UI elements with no meaningful composition of other DS components.

| Y | Component | Node ID | Use | Variants |
|---|---|---|---|---|
| 100 | Button | `57:10` | Primary interactive action trigger | Hierarchy (Primary, Secondary, Outline, Ghost, Destructive, Link) × Size (XS, SM, Default, LG) × Icon (None, Left, Right, Only) × State (Default, Disabled) |
| 712 | Kbd | `89:157` | Keyboard shortcut label | standalone |
| 832 | Badge | `11:36` | Status and category labels | 10 variants: Default, Filled, Secondary, Destructive, Success, Warning, Error, Info, Outline, Ghost |
| 996 | Tabs | `117:277` | Section navigation within a page | 3 variants: Default, Subtle, Line |
| 1180 | TabCount | `115:246` | Count pill inside Tab items | standalone |
| 1296 | Input | `80:138` | Single-line text entry | Addon (None, Icon start, Icon end, Text prefix, Text suffix, Button end, Icon start + Button end) × State (Default, Focus, Error, Disabled) |
| 1784 | SearchInput | `87:208` | Search field with clear action | State (Hint, Has value) × Attached (False, True) |
| 2020 | FilterChip | `90:181` | Individual active filter toggle | 4 variants: Default, Single, Multiple, Clear all |
| 3147 | DataCell | `122:257` | Plain text value in table rows | standalone |
| 3332 | AmountCell | `122:259` | Formatted monetary value in table rows | standalone |
| 3517 | StatusCell | `122:273` | Status indicator with colored dot in table rows | 5 variants: Success, Warning, Error, Rejected, Neutral |
| 3702 | ActionCell | `137:264` | Row action buttons (view/edit/delete) in table | 3 variants: Single, Double, Double+Text |
| 3874 | TableHead | `132:272` | Sortable column header | Sort (None, None+Info, Unsorted, Ascending, Descending) + Toggle |
| 4054 | TableRow | `140:333` | Data row in a table | 3 states: Default, Hover, Selected |
| 4670 | Switch | `161:397` | Boolean on/off toggle | Checked (True/False) × Disabled (True/False) |
| 4834 | Tooltip | `161:419` | Contextual hint on hover | 3 variants: Simple, Rich, Status |
| 5077 | TextArea | `160:397` | Multi-line text entry | 4 states: Default, Focus, Error, Disabled |
| 5525 | Alert | `169:458` | Inline feedback message | 5 variants: Default, Info, Success, Warning, Error |
| 5731 | SidebarMenuItem | `173:442` | Top-level navigation item in sidebar | State (Default/Active) × Chevron (True/False) |
| 5903 | SidebarMenuSubItem | `173:455` | Nested navigation item in sidebar | State (Default/Active) |
| 7008 | DropdownMenu / Label | — | Section header inside a dropdown | standalone |
| 7132 | DropdownMenu / Separator | — | Divider line inside a dropdown | standalone |
| 7324 | DropdownMenu / Item | — | Action row inside a dropdown | Type (Default, Icon+Label, Label+Check, Destructive) × State (Default, Hover, Disabled) — 12 variants |
| 8079 | Select / Item | — | Option row inside a select panel | State (Default, Hover, Selected, Disabled) |
| 8212 | Select / Trigger | — | Select field trigger button | Size (Default/SM) × State (Default, Placeholder, Focus, Error, Disabled) — 10 variants |
| 8878 | FilterCombobox / SearchInput | — | Search input inside a combobox filter panel | standalone — h-8, bg/canvas 60%, border/default 30% |
| ~12325 | Breadcrumb | `228:1595` | Page location trail in detail screens | Depth=2 (Section / Page) and Depth=3 (Section / Sub / Page) |
| ~12494 | MetaField | `229:1589` | Label+value pair in detail card headers | Type=Text and Type=Amount |
| ~13649 | LifecycleStep | `234:1739` | Single step row in a timeline | Status (Completed/Pending/Not started/Rejected/Failed) × IsLast (True/False) — 10 variants |

---

### Components

Composed of atoms, or domain-specific UI blocks used across one or more screens.

| Y | Component | Node ID | Use | Variants |
|---|---|---|---|---|
| 2179 | FilterBar | `103:195` | Active filter chip row displayed below the search input | 2 variants: Empty, Active |
| 2363 | SearchBar | `104:246` | Combined search input + filter bar for list screens | 3 configs: Input only, Input + Filters, Input + Active filters |
| 2583 | SearchDropdown | `108:313` | Autocomplete results panel below a search input | 3 states: Results, Results selected, No results |
| 2989 | TextStack | `122:256` | Primary + secondary text pair used in table cells | 2 types: Primary only, Primary + Secondary |
| 4358 | DataTable | `147:519` | Full data table with sortable head, rows, and empty state | 2 states: Default, Empty |
| 5297 | Field | `166:444` | Form field with label, input, and helper/error text | Position (Top/Left) × Required (True/False) × Helper (None/Text/Error) — 8 variants |
| 6075 | Sidebar / Expanded | `176:449` | Full app navigation sidebar — paired independently with layout templates | 256×800px: logo + ledger switcher + 7 nav items with Lucide icons |
| 7724 | DropdownMenu / Content | — | Assembled dropdown panel (label + items + separator) | Style (Simple 160px, Rich 240px) |
| 8556 | Select / Content | — | Assembled select panel with grouped items and optional search | Style (Default, Search) |
| 9102 | Dialog | — | Modal overlay for destructive actions, forms, and approvals | Type (Default, Destructive, Form, Approval) — 1280×720 or 800 |
| 9922 | Dialog / Summary Card | — | Confirmation detail block inside the Approval dialog | Balance (Split, Single) |
| ~10600 | StatCard | `216:673` | Financial metric card on overview/list screens | 15 variants — Type (Count/Amount/Status) × Color × Secondary/Badge/Actions/Null flags |
| ~12685 | TransactionHeader | `231:1712` | Header card for the transaction detail screen | Status (Completed/Pending/Failed/Rejected) — 4 variants |
| ~14629 | LifecycleCard | `235:1773` | Timeline card with status-labeled step list | Status (Completed/Pending/Rejected/Failed) — 4 variants |
| ~15815 | SideCard | `236:1780` | Balance movement card showing sender or receiver side | Role (Sender/Receiver) × Balance (Shown/Hidden) — 4 variants |
| ~16170 | PartyCard | `237:1794` | Transaction party detail card with alias and identity fields | Role (Sender/Receiver) — 2 variants |
| ~16635 | QuorumTrack | `238:1801` | Approval quorum progress bar embedded in ApprovalHeader | Slots=2/3 × Approved count × YouApproved — 4 variants |
| ~17175 | ApprovalHeader | `239:1851` | Header card for the approval detail screen | Action (Needed/None) — 2 variants |
| ~18077 | MovementHeader | `240:1906` | Header card for the movement detail screen | Status (Completed/Pending/Rejected/Failed) — 4 variants |

---

### Layouts

Full page-area content templates. **Sidebar is always paired independently** — never embedded inside a layout component.

| Y | Component | Node ID | Use | Variants |
|---|---|---|---|---|
| ~11500 | SectionLayout | `221:1707` | List/overview page template — transactions, participants, liquidity tabs | 8 variants — Header (Title\|Tabs) × CTA (True\|False) × Stats (None\|2col\|3col\|4col) × Search (None\|Default\|Actions) |
| ~19002 | ScreenDetails | `241:3137` | Detail/drill-down page template — transaction, approval, and movement detail screens | 7 variants — Transaction (Completed/Failed), Approval (Needed/None), Movement (Completed/Pending/Rejected) |

**All planned components are now in Figma.** The DS library covers tokens, text styles, atoms, components, and both layout templates.

---

## Searching the Design System

To find icons or other library components without knowing keys:

```javascript
// Via MCP tool (not plugin code)
mcp__figma__search_design_system({
  query: 'chevron down',
  fileKey: '2DC3aTTWVhFvefXezAcw8J',
  includeComponents: true,
  includeStyles: false,
  includeVariables: false,
  includeLibraryKeys: ['lk-...lucide...'],
});
```

Returns `componentKey` values you can pass to `figma.importComponentByKeyAsync`.
