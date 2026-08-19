"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { DiagramNode } from "./diagram-node"

/**
 * A record card for a non-anchor object: a user, a signer, an API key. Anything that
 * is a party or a credential rather than a routing handle.
 *
 * The white sibling of `AnchorCard`. Uses the wallet node treatment, so the object
 * reads the same here as it does inside a flow diagram, and the two card families stay
 * visually distinct: dark navy means an anchor, white means a party.
 *
 * Shared by the creation flows and the status change dialog, so a reader sees the same
 * card whether they are making the object or acting on one that exists.
 */

interface RecordCardProps {
  /** Glyph in the leading tile. */
  icon?: React.ReactNode
  /** The object's own name. */
  title: React.ReactNode
  titlePlaceholder?: string
  /** Second line: an email, a schema, an owner. */
  subtitle?: React.ReactNode
  subtitlePlaceholder?: string
  /** A context label centred above the card, e.g. the participant it belongs to. */
  eyebrow?: React.ReactNode
  /** Content nested inside the card below the identity row, e.g. a key block. */
  children?: React.ReactNode
  /** Chips below the card, e.g. assigned roles. */
  footer?: React.ReactNode
  /**
   * False renders the card as an empty outline, for a creation flow where nothing has
   * been entered yet. Defaults to true, since an existing record is always filled.
   */
  filled?: boolean
  className?: string
}

function RecordCard({
  icon,
  title,
  titlePlaceholder,
  subtitle,
  subtitlePlaceholder,
  eyebrow,
  children,
  footer,
  filled = true,
  className,
}: RecordCardProps) {
  const hasTitle = Boolean(title)
  const hasSubtitle = Boolean(subtitle)

  return (
    <div className={cn("flex w-full max-w-[300px] flex-col gap-3", className)}>
      {eyebrow && (
        <span className="flex h-4 items-center justify-center text-caption text-[var(--color-text-muted)]">
          {eyebrow}
        </span>
      )}

      <DiagramNode filled={filled} variant="wallet" className="w-full">
        {/* The icon sits in its own column so nested content starts at the same left
            edge as the title rather than running under the tile. */}
        <div className="flex w-full items-start gap-3 text-left">
          {icon && (
            <span className="flex size-8 shrink-0 items-center justify-center [border-radius:var(--radius-button)] bg-[var(--color-bg-base)] text-[var(--color-text-muted)]">
              {icon}
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col">
            <span
              className={cn(
                "truncate text-body-sm",
                hasTitle ? "text-[var(--color-text-default)]" : "text-[var(--color-text-hint)]",
              )}
            >
              {hasTitle ? title : titlePlaceholder}
            </span>
            {(hasSubtitle || subtitlePlaceholder) && (
              <span
                className={cn(
                  "truncate text-caption",
                  hasSubtitle ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-hint)]",
                )}
              >
                {hasSubtitle ? subtitle : subtitlePlaceholder}
              </span>
            )}
            {children}
          </div>
        </div>
      </DiagramNode>

      {footer && <div className="flex flex-wrap justify-center gap-1">{footer}</div>}
    </div>
  )
}

export { RecordCard }
export type { RecordCardProps }
