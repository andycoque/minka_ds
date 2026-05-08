# Token architecture

## Layer structure

```
tokens/primitives.css   Raw scale values — never use in components
tokens/semantic.css     Semantic intent layer — what components consume
app/globals.css         Imports both; also maps to shadcn CSS variable slots
```

## Adding a new primitive

Add a CSS custom property to `primitives.css` following the naming convention:

```css
--primitive-<scale>-<step>: <value>;
```

Example: `--primitive-brand-600: oklch(0.45 0.20 240);`

## Adding a semantic token

Reference a primitive in `semantic.css`:

```css
--color-text-link: var(--primitive-brand-600);
```

Always provide a `.dark` override.

## shadcn slots

shadcn components consume the standard slots defined in `semantic.css`:
`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`,
`--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`.

Do not change the slot names — they are part of the shadcn contract.

## Product-specific tokens

Additional product tokens follow the `--color-*` naming pattern:
- `--color-surface-*` for surfaces
- `--color-text-*` for text
- `--color-border-*` for borders
- `--color-status-*` for status indicators
- `--color-interactive-*` for interactive elements
- `--shadow-*` for elevation
