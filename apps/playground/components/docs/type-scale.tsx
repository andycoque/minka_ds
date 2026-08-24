"use client"

import * as React from "react"

/**
 * The type scale, in full.
 *
 * Every row renders its own utility class, so the specimen IS the token: change the
 * utility and this table changes with it. The px value is read back from the DOM rather
 * than hardcoded, which is what keeps the column honest.
 *
 * There are 39 of these. An earlier version of the tokens page showed five as a
 * "sample", which told a reader neither what exists nor how the families relate.
 */

interface TypeRow {
  /** The utility class, without the leading dot. */
  name: string
  /** What it is for. Blank where the name says it. */
  use?: string
}

function Row({ name, use }: TypeRow) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [size, setSize] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!ref.current) return
    const px = getComputedStyle(ref.current).fontSize
    setSize(px ? `${Math.round(parseFloat(px))}px` : null)
  }, [])

  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-[var(--color-border-subtle)] py-3 last:border-0 sm:grid-cols-[14rem_1fr_3rem]">
      <span className="flex min-w-0 flex-col gap-0.5">
        <span
          className="truncate text-caption text-[var(--color-text-default)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {name}
        </span>
        {use && (
          <span className="text-caption text-[var(--color-text-muted)]">{use}</span>
        )}
      </span>

      {/* The specimen renders in its own class, so this row cannot drift from the token. */}
      <span ref={ref} className={`${name} truncate text-[var(--color-text-default)]`}>
        Ledger overview
      </span>

      <span className="text-right text-caption text-[var(--color-text-hint)] tabular-nums">
        {size ?? " "}
      </span>
    </div>
  )
}

function TypeScale({ rows }: { rows: TypeRow[] }) {
  return (
    <div className="not-prose flex flex-col overflow-hidden [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-4">
      {rows.map(r => (
        <Row key={r.name} {...r} />
      ))}
    </div>
  )
}

export { TypeScale }
