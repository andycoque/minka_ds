import { cn } from "@/lib/utils"

/**
 * Anatomy — the parts a component is assembled from, and which of them are
 * optional.
 *
 * This is the section that did not exist before, and the one that causes the
 * most rework when it is missing: without it people hand-roll a thing the
 * component already has a slot for. Each part names the exported subcomponent
 * or prop that controls it, so the reader can go straight to it.
 */
function Anatomy({ children }: { children: React.ReactNode }) {
  return (
    // White ground and no row dividers, matching the props table: these are all
    // tables or table-alikes, so they should read as one surface with padding
    // doing the separating rather than a stack of ruled boxes.
    <div className="not-prose overflow-hidden border border-[var(--color-border-default)] [border-radius:var(--radius-card)] bg-[var(--color-bg-raised)] py-1">
      {children}
    </div>
  )
}

/**
 * One part. `name` is the exported subcomponent or prop.
 *
 * `optional` marks a part you can leave out, and only the optional case is
 * labelled. Marking the required ones too was noise: in a filtered list every
 * row is a part that is actually present, so "Required" on the only row said
 * nothing. Absence of the label now means required, which is the common case.
 */
function Part({
  name,
  optional = false,
  children,
}: {
  name: string
  optional?: boolean
  children: React.ReactNode
}) {
  // items-center, not items-baseline: now that descriptions are one line each,
  // the name and its description share a centre line. On the rare row that wraps
  // to two lines the name centres against the block, which reads better than
  // sitting on the first line's baseline.
  return (
    // Same scale as PropsTable and the markdown tables: 14px name at medium
    // weight, 14px muted description, 12px for the Optional marker.
    <div className="flex items-center gap-4 px-3.5 py-2.5">
      <div className="flex w-48 shrink-0 items-baseline gap-2">
        <span className="text-[0.875rem] font-medium text-[var(--color-text-default)]">
          {name}
        </span>
        {optional ? (
          <span className={cn("text-[0.75rem] text-[var(--color-text-hint)]")}>Optional</span>
        ) : null}
      </div>
      {/* `ds-panel-copy` so backticked code written in MDX gets the chip
          treatment; the prose rules are guarded off this panel. */}
      <p className="ds-panel-copy min-w-0 text-[0.875rem] font-medium text-[var(--color-text-muted)]">
        {children}
      </p>
    </div>
  )
}

export { Anatomy, Part }
