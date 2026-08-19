import { cn } from "@/lib/utils"

/**
 * Specimen — the canonical way to show a component in the docs.
 *
 * This is the labelled-row pattern from the old /design-system page, extracted
 * so every component page renders variants the same way: a bordered box, one
 * row per axis, the axis name in the gutter.
 *
 *   <Specimen>
 *     <SpecimenRow label="Variant">…</SpecimenRow>
 *     <SpecimenRow label="Size">…</SpecimenRow>
 *   </Specimen>
 *
 * Use `<Specimen plain>` for a single unlabelled example (no gutter, no rows).
 */
function Specimen({
  children,
  plain = false,
  className,
}: {
  children: React.ReactNode
  plain?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "not-prose overflow-hidden border border-[var(--color-border-default)] [border-radius:var(--radius-card)] bg-[var(--color-bg-raised)]",
        plain ? "p-6" : "divide-y divide-[var(--color-border-subtle)]",
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * One axis of variation. `label` names the axis (Variant, Size, State), the
 * children are the specimens for it.
 *
 * `align="start"` when the row holds tall content (a card, a panel) so the
 * label sits at the top rather than floating in the vertical centre.
 */
function SpecimenRow({
  label,
  children,
  align = "center",
  className,
}: {
  label?: string
  children: React.ReactNode
  align?: "center" | "start"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-3",
        align === "center" ? "items-center" : "items-start",
        className,
      )}
    >
      {label ? (
        <span className="text-caption text-[var(--color-text-muted)] w-24 shrink-0 pt-1">
          {label}
        </span>
      ) : null}
      <div className="flex flex-wrap items-center gap-2 min-w-0">{children}</div>
    </div>
  )
}

export { Specimen, SpecimenRow }
