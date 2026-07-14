import * as React from "react"
import { cn } from "../../lib/utils"

export interface SectionCardProps {
  /** Title shown in the header bar. Omit for a header-less card. */
  title?: React.ReactNode
  /** Optional right-aligned muted text in the header bar (e.g. "3 events"). */
  aside?: React.ReactNode
  className?: string
  /** Extra classes for the body wrapper. */
  bodyClassName?: string
  children: React.ReactNode
}

/**
 * A titled section card: a bordered raised panel with an optional overline title
 * (and optional right-aligned aside) at the top of a padded body. The standard
 * titling for detail-page sections.
 */
function SectionCard({ title, aside, className, bodyClassName, children }: SectionCardProps) {
  return (
    <div
      data-slot="section-card"
      className={cn(
        "flex flex-col [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] p-6",
        className
      )}
    >
      {(title != null || aside != null) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title != null && <span className="text-overline text-[var(--color-text-muted)]">{title}</span>}
          {aside != null && <span className="text-caption text-[var(--color-text-muted)]">{aside}</span>}
        </div>
      )}
      <div className={cn("flex flex-1 flex-col gap-6", bodyClassName)}>{children}</div>
    </div>
  )
}

export { SectionCard }
