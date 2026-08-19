/**
 * PropsTable — the public API of a component.
 *
 * Deliberately hand-authored rather than generated from types. The generated
 * version would list every prop `React.ComponentProps<"div">` drags in, which
 * buries the six that matter. If a prop is not worth a sentence, leave it out
 * and let the type definition carry it.
 *
 * Type and colour match the markdown tables in docs.css exactly: header 12px
 * muted, cell 14px muted, first column 14px default at medium weight. One scale
 * for every table on the site.
 */
function PropsTable({ children }: { children: React.ReactNode }) {
  return (
    // `overflow-hidden` alone, no horizontal scroll. Nothing in this table needs
    // to exceed the container now that the type column wraps, and pairing
    // overflow-hidden with overflow-x-auto made the row heights blow out.
    <div className="not-prose overflow-hidden border border-[var(--color-border-default)] [border-radius:var(--radius-card)] bg-[var(--color-bg-raised)]">
      {/* `table-fixed` so the column widths come from the header rather than
          from the longest string in a cell. Without it one long union set the
          width of the whole table and pushed Description off the page. */}
      <table className="w-full table-fixed border-collapse text-left">
        {/* Prop names run to 19 characters ("step / onStepChange"), so this
            column has to fit them or wrap cleanly rather than overflow. */}
        <colgroup>
          <col className="w-[9.5rem]" />
          <col className="w-[11rem]" />
          <col className="w-[6.5rem]" />
          <col />
        </colgroup>
        <thead>
          <tr className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-base)]">
            <Th>Prop</Th>
            <Th>Type</Th>
            <Th>Default</Th>
            <Th wrap>Description</Th>
          </tr>
        </thead>
        {/* No row dividers. Row padding separates the rows, and a rule per row
            turned a four-column reference into a grid of boxes. */}
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function Th({ children, wrap = false }: { children: React.ReactNode; wrap?: boolean }) {
  return (
    <th
      className={
        "px-3.5 py-2.5 text-[0.75rem] font-normal text-[var(--color-text-muted)]" +
        (wrap ? "" : " whitespace-nowrap")
      }
    >
      {children}
    </th>
  )
}

/**
 * Code face for the Type and Default columns.
 *
 * Explicit `text-[0.75rem]` rather than the `text-caption` token: that token
 * sets `font-family: var(--font-sans)`, and because it lands after `font-mono`
 * in the cascade it silently won, which is why these columns were not rendering
 * in mono.
 */
function TypeCode({ children }: { children: React.ReactNode }) {
  return (
    // `leading-[1.45]` is the fix: without it the chip inherits the cell's line
    // height, so the box is much taller than the glyphs and the padding looks
    // wrong even though it matches. The height of a chip comes from its leading,
    // not from its padding.
    //
    // No baseline offset here, unlike the inline `Code` component. These chips
    // sit alone in their own cell rather than mid-sentence, so the alignment is
    // handled by the text columns' extra top padding instead.
    <code className="inline-block whitespace-nowrap border border-[var(--color-border-default)] [border-radius:var(--primitive-radius-xs)] bg-[var(--color-bg-disabled)] px-[0.35em] py-[0.05em] font-mono text-[0.75rem] font-medium leading-[1.45] text-[var(--color-text-default)]">
      {children}
    </code>
  )
}

/**
 * A union renders as a stack of values, one per line, not as a sentence.
 *
 * `'a' | 'b' | 'c'` written as a single nowrap string set the width of the whole
 * table from its longest cell, which pushed the Description column off the page.
 * Splitting on the pipe is done here rather than in the page so every existing
 * `type="'a' | 'b'"` keeps working unchanged.
 */
function TypeValue({ type }: { type: string }) {
  const parts = type
    .split("|")
    .map((p) => p.trim())
    .filter(Boolean)

  if (parts.length < 2) return <TypeCode>{type}</TypeCode>

  return (
    <span className="flex flex-col items-start gap-0.5">
      {parts.map((part) => (
        <TypeCode key={part}>{part}</TypeCode>
      ))}
    </span>
  )
}

function Prop({
  name,
  type,
  default: defaultValue,
  children,
}: {
  name: string
  type: string
  default?: string
  children: React.ReactNode
}) {
  return (
    <tr>
      {/* The text columns take a half-step of top padding over the chip columns.
          A chip carries a border plus padding above its glyphs where plain text
          carries neither, so with equal cell padding the chip's TEXT sits lower
          than its neighbours' even though the boxes align. Nudging the text down
          is what puts all four first lines on one baseline. */}
      <td className="px-3.5 pt-[0.8125rem] pb-2.5 align-top">
        <span className="text-[0.875rem] font-medium leading-[1.5] text-[var(--color-text-default)]">
          {name}
        </span>
      </td>
      {/* Tinted chips, matching the markdown tables. This was plain muted text
          while a union rendered as one long string, where a row of filled chips
          would have out-shouted the prop name beside it. Now that unions stack
          one value per line, each chip is short and the tint reads as "this is a
          literal" rather than as a block of colour. */}
      <td className="px-3.5 py-2.5 align-top">
        <TypeValue type={type} />
      </td>
      <td className="px-3.5 py-2.5 align-top">
        {defaultValue ? (
          <TypeCode>{defaultValue}</TypeCode>
        ) : (
          // The empty-value dash is text, not a chip, so it takes the same
          // half-step nudge the text columns get.
          <span className="block pt-[0.1875rem] text-[0.875rem] font-medium leading-[1.5] text-[var(--color-text-hint)]">
            —
          </span>
        )}
      </td>
      <td className="px-3.5 pt-[0.8125rem] pb-2.5 align-top">
        <span className="text-[0.875rem] font-medium leading-[1.5] text-[var(--color-text-muted)]">
          {children}
        </span>
      </td>
    </tr>
  )
}

export { PropsTable, Prop }
