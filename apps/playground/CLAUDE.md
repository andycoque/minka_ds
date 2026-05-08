@AGENTS.md

# Minka Product UI — Design System Rules

## Token Architecture

Every component property that maps to a semantic token MUST use it. No raw Tailwind color, typography, radius, shadow, or z-index values in components.

Layer order (bottom to top):
1. `tokens/primitives.css` — raw scale values, never used in components
2. `app/globals.css` semantic layer — maps primitives to named semantic tokens
3. Components — consume semantic tokens only

If a property has no matching semantic token, add a `{/* TODO: needs token — <description> */}` comment and flag it.

Spacing (padding, margin, height, gap) is deferred — raw Tailwind spacing utilities are acceptable for now.

### Radius, Shadow, Z-index

These properties have no Tailwind shorthand that maps to our tokens. Always use the arbitrary-value syntax:

```tsx
// radius
"[border-radius:var(--radius-button)]"
"[border-radius:var(--radius-card)]"
"[border-radius:var(--radius-tag)]"

// shadow
"shadow-[var(--shadow-card)]"
"shadow-[var(--shadow-popover)]"
"shadow-[var(--shadow-modal)]"

// z-index
"[z-index:var(--z-sticky)]"
"[z-index:var(--z-dropdown)]"
"[z-index:var(--z-modal)]"
```

Never use `rounded-*`, `shadow-sm/md/lg`, or `z-10/20/50` in components.

## cn() / tailwind-merge

`lib/utils.ts` uses `extendTailwindMerge` (not the default `twMerge`) to register our custom `text-*` typography utilities in the `font-size` conflict group.

**Why this matters:** `tailwind-merge` treats every `text-*` class as a single conflict group. Without this extension, passing both `text-label` (typography) and `text-[var(--color-action-primary-foreground)]` (color) to `cn()` would silently drop `text-label`, causing font-weight/size to fall back to the browser default.

When adding new custom `text-*` typography utilities to `globals.css`, also add them to the `font-size` array in `lib/utils.ts`.

## Future Architecture

### Monorepo split (post v1)
Currently the component library and the playground live together in one Next.js app. This is fine for v1 but blocks distributing Minka DS as an npm package.

When ready, split into a Turborepo monorepo:
- `packages/minka-ds` — the component library (bundled, publishable)
- `apps/playground` — the Next.js demo/docs site that imports from the package

Until then, other projects must copy components in manually.

## Known Gaps / Pending Design Decisions

### Close Button
The close button in Dialog and Sheet is not yet tokenized. It should become a `ghost` variant of the Button component with `size="icon"`, replacing the raw `opacity-70 hover:opacity-100` pattern. Each interactive state (default, hover, pressed, disabled) needs to be defined. Pending design discussion.

### Shadow Tokens
The shadow scale in primitives and semantic layer is incomplete. For now, use the existing semantic tokens:
- `--shadow-card` for card surfaces
- `--shadow-popover` for dropdowns and popovers
- `--shadow-modal` for dialogs and sheets

Do not introduce new raw `shadow-*` Tailwind utilities. Flag missing mappings as TODO until the shadow scale is fully defined.
