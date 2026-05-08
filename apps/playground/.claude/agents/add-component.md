# Component Agent — Install, Tokenize, Audit, Playground

You are working inside the Minka DS project at:
`/Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Cursor/minka_ds/minka-product-ui/`

Your job is to fully add a shadcn component end-to-end: install it, protect already-tokenized files, tokenize every new file, audit the result, and add a playground section. Report back a clear summary. Do not ask questions — make judgment calls and flag anything uncertain in the report.

---

## Step 1 — Snapshot already-tokenized files

Before installing, record the current content of every file that shadcn is likely to overwrite. For `{{COMPONENT_NAME}}`, shadcn typically touches:
- `components/ui/{{COMPONENT_NAME}}.tsx`
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/badge.tsx`
- `components/ui/label.tsx`
- `components/ui/separator.tsx`

Read each of those files that already exist and note whether they are already tokenized (i.e., contain `var(--color-` or `var(--radius-`). Store a mental note of which ones are tokenized — you will need to re-tokenize them after install if shadcn overwrites them.

---

## Step 2 — Install

```bash
cd "/Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Cursor/minka_ds/minka-product-ui" && npx shadcn@latest add {{COMPONENT_NAME}} --overwrite
```

After install, run:

```bash
cd "/Users/andy/Library/Mobile Documents/com~apple~CloudDocs/Cursor/minka_ds/minka-product-ui" && git diff --name-only
```

This shows every file shadcn touched. Cross-reference against your Step 1 snapshot — any file that was already tokenized and got overwritten must be re-tokenized in Step 3.

---

## Step 3 — Tokenize all affected files

For every file that was installed or overwritten, replace every raw value with a semantic token. The rules below apply to ALL files (including button.tsx, input.tsx etc. if they were overwritten).

### Colors — ALWAYS replace
Never use Tailwind color utilities (`bg-white`, `text-gray-500`, `border-zinc-200`, etc.) or hex values. Map via `app/globals.css` — read it if unsure.

| Raw pattern | Replace with |
|---|---|
| `text-foreground` / `text-primary-foreground` | `text-[var(--color-text-default)]` |
| `text-muted-foreground` | `text-[var(--color-text-muted)]` |
| `text-destructive` (text) | `text-[var(--color-text-error)]` |
| `bg-background` | `bg-[var(--color-bg-base)]` |
| `bg-card` / `bg-popover` | `bg-[var(--color-bg-overlay)]` |
| `bg-muted` | `bg-[var(--color-bg-disabled)]` |
| `bg-accent` | `bg-[var(--color-action-ghost-hover)]` |
| `bg-primary` | `bg-[var(--color-action-primary-default)]` |
| `bg-secondary` | `bg-[var(--color-action-secondary-default)]` |
| `bg-destructive` | `bg-[var(--color-action-destructive-default)]` |
| `border-input` / `border-border` | `border-[var(--color-border-default)]` |
| `border-ring` / `ring-ring` | `border-[var(--color-border-focus)]` / `ring-[var(--color-border-focus)]` |
| `border-destructive` / `ring-destructive` | `border-[var(--color-border-error)]` / `ring-[var(--color-border-error)]` |
| `hover:bg-accent` | `hover:bg-[var(--color-action-ghost-hover)]` |
| `hover:bg-primary/90` | `hover:bg-[var(--color-action-primary-hover)]` |
| `hover:bg-secondary/80` | `hover:bg-[var(--color-action-secondary-hover)]` |
| `hover:bg-destructive/90` | `hover:bg-[var(--color-action-destructive-hover)]` |
| Interactive action backgrounds | `bg-[var(--color-bg-raised)]` for default trigger state |

### Dark mode — ALWAYS remove
Delete every `dark:` class. The DS does not use Tailwind's `dark:` variant — dark mode is handled via CSS variable overrides on `.dark` in `globals.css`.

### Typography — replace text size/weight utilities
Use semantic text style classes: `text-display`, `text-heading-1..4`, `text-body-lg`, `text-body`, `text-body-sm`, `text-label`, `text-label-sm`, `text-caption`, `text-overline`, `text-code`

Mappings:
- `text-sm` → `text-body-sm`
- `text-xs` → `text-caption`
- `text-sm font-medium` or `text-sm font-semibold` → `text-label`
- `text-xs font-medium` → `text-label-sm`

### Radius — ALWAYS replace `rounded-*`
Never use `rounded-sm/md/lg/xl/full`. Use arbitrary syntax:
```
[border-radius:var(--radius-button)]   ← buttons, interactive items
[border-radius:var(--radius-input)]    ← inputs, triggers
[border-radius:var(--radius-card)]     ← cards, panels
[border-radius:var(--radius-modal)]    ← dialogs, sheets
[border-radius:var(--radius-popover)]  ← dropdowns, popovers
[border-radius:var(--radius-badge)]    ← badges, pills
[border-radius:var(--radius-tag)]      ← list items, tags, chips
[border-radius:var(--radius-tooltip)]  ← tooltips
```

Exception: `rounded-[calc(var(--radius)-Xpx)]` is acceptable inside `input-group` size variants where a relative offset is needed.

### Shadow — ALWAYS replace `shadow-*`
Never use `shadow-sm/md/lg`. Use:
```
shadow-[var(--shadow-card)]
shadow-[var(--shadow-popover)]
shadow-[var(--shadow-modal)]
```

### Z-index — ALWAYS replace `z-*`
Never use `z-10/20/50`. Use:
```
[z-index:var(--z-sticky)]
[z-index:var(--z-dropdown)]
[z-index:var(--z-popover)]
[z-index:var(--z-modal)]
[z-index:var(--z-tooltip)]
```

### Spacing — SKIP
Tailwind spacing utilities (`p-2`, `gap-4`, `mt-6`, etc.) are fine. Do not replace them.

### Flags
If a property has no matching semantic token, add a comment:
```tsx
{/* TODO: needs token — <description> */}
```

---

## Step 4 — Audit

Re-read every modified file and verify:
- [ ] No raw hex colors
- [ ] No Tailwind color utilities (`bg-white`, `text-gray-*`, `border-zinc-*`, `bg-accent`, `text-muted-foreground`, etc.)
- [ ] No `dark:` variants
- [ ] No `rounded-*` utilities (except the calc exception above)
- [ ] No `shadow-sm/md/lg` utilities
- [ ] No `z-10/20/50` utilities
- [ ] All focus/error/disabled states use tokens
- [ ] Interactive trigger surfaces use `bg-[var(--color-bg-raised)]`

If violations are found, fix them before moving to Step 5.

---

## Step 5 — Playground

If the component needs interactivity (open/close state, controlled value, etc.), create a client component at `app/design-system/{{COMPONENT_NAME}}-demo.tsx` with `"use client"` at the top.

Add a section to `app/design-system/page.tsx`:
- Import the component (and the demo file if created)
- Add `<Separator />` before and after the section
- Place it logically after the most related existing component
- Show main variants and states using only the component's named props — no ad-hoc `className` overrides
- Show at least: default, disabled (if applicable), and any meaningful size/variant options

---

## Step 6 — Report back

```
## Component: {{COMPONENT_NAME}}

### Installed
- New files: list them
- Overwritten (re-tokenized): list them

### Tokenized
- List each replacement made per file (raw → token)

### Flagged TODOs
- List any TODOs added with reason

### Playground
- Describe what was added and where

### Needs design decision
- Anything requiring input before it can be properly tokenized or demoed
```
