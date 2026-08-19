import { z } from 'zod'

/**
 * Content type tags for MDX pages. Each key is a valid frontmatter value,
 * each value is the display label shown in the search dialog filter UI.
 *
 * Mirrors the vocabulary on docs.minka.io (the Diátaxis content types) and
 * extends it with the three types this site adds. Keep the shared keys in
 * sync with that repo — if the two sites ever share a search index, a key
 * present on one side only will fail validation on the other.
 */
export const TAGS = {
  // Shared with docs.minka.io
  explanation: 'Explanations',
  guide: 'How-to Guides',
  tutorial: 'Tutorials',
  reference: 'References',
  solution: 'Solutions',
  release: 'Release Notes',
  // Design system additions
  component: 'Components',
  token: 'Tokens',
  pattern: 'Patterns',
} as const satisfies Record<string, string>

export type Tag = keyof typeof TAGS

const ALLOWED_TAGS = Object.keys(TAGS) as [Tag, ...Tag[]]

const tagEnum = z.enum(ALLOWED_TAGS)

/**
 * Frontmatter schema for the `tags` field in MDX pages.
 *
 * Accepts a comma-separated string (e.g. `"component, reference"`) and
 * transforms it into a validated string array. Rejects unknown tag values
 * at build time. Used as search index tags for filtering and ranking.
 */
export const tagsSchema = z
  .string()
  .transform((v) => v.split(',').map((t) => t.trim()))
  .pipe(z.array(tagEnum))
  .optional()

/**
 * Component lifecycle, shown as a badge in the page header.
 *
 * `stable`     — safe to use, changes are additive
 * `beta`       — in the package, API may still move
 * `deprecated` — do not use in new work; the page says what to use instead
 */
export const STATUS = {
  stable: 'Stable',
  beta: 'Beta',
  deprecated: 'Deprecated',
} as const satisfies Record<string, string>

export type Status = keyof typeof STATUS

export const statusSchema = z
  .enum(Object.keys(STATUS) as [Status, ...Status[]])
  .optional()
