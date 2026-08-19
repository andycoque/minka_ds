"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { DiagramNode } from "./diagram-node"

/**
 * A record card for an anchor-based object: a directory key, a QR code, a dynamic
 * key. Anything that is a routing handle rather than a wallet.
 *
 * Uses the anchor node treatment (inverted navy, light ink) so the object reads the
 * same here as it does inside a flow diagram. Text inherits that ink; secondary text
 * is dimmed with opacity rather than a muted token, since a light-on-dark muted token
 * would not stay legible.
 *
 * Shared by the creation flows and the status change dialog, so a reader sees the
 * same card whether they are making the object or acting on one that exists. Every
 * region is optional: the directory shows an identity and a destination, an
 * instrument adds a use-type marker and a value/expiry footer.
 */

interface AnchorCardProps {
  /** Leading glyph on the identity row, e.g. a QR or key icon. */
  icon?: React.ReactNode
  /** The object's own name. Rendered in the serif face, as the card's title. */
  title: React.ReactNode
  /** Shown in place of `title` styling when the title is not set yet. */
  titlePlaceholder?: string
  /** Top-right marker, e.g. single-use vs reusable. */
  trailing?: React.ReactNode
  /** The participant the object belongs to. */
  participant?: React.ReactNode
  /** Glyph for the destination row, e.g. a bank or phone icon. */
  destinationIcon?: React.ReactNode
  /** Where the object routes to: an account number or a handle. */
  destination?: React.ReactNode
  destinationPlaceholder?: string
  /** Bottom row, above a hairline rule. Omitted entirely when not passed. */
  footerStart?: React.ReactNode
  footerEnd?: React.ReactNode
  /**
   * False renders the card as an empty outline, for a creation flow where nothing has
   * been entered yet. Defaults to true, since an existing record is always filled.
   */
  filled?: boolean
  className?: string
}

/** Empty fields dim harder than merely secondary ones, so pending reads as pending. */
const HINT = "opacity-40"

function AnchorCard({
  icon,
  title,
  titlePlaceholder,
  trailing,
  participant,
  destinationIcon,
  destination,
  destinationPlaceholder,
  footerStart,
  footerEnd,
  filled = true,
  className,
}: AnchorCardProps) {
  const hasTitle = Boolean(title)
  const hasParticipant = Boolean(participant)
  const hasDestination = Boolean(destination)
  const hasFooter = Boolean(footerStart || footerEnd)

  return (
    <div className={cn("flex w-full max-w-[300px] flex-col items-center", className)}>
      <DiagramNode filled={filled} variant="anchor" className="w-full">
        <div className="flex w-full flex-col gap-4 px-1 py-1 text-current">
          <div className="flex items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {icon && <span className="shrink-0 opacity-80">{icon}</span>}
              <span className={cn("truncate text-body-serif", !hasTitle && HINT)}>
                {hasTitle ? title : titlePlaceholder}
              </span>
            </div>
            {trailing && <span className="ml-auto shrink-0 opacity-70">{trailing}</span>}
          </div>

          {(hasParticipant || hasDestination || destinationPlaceholder) && (
            <div className="flex flex-col gap-0.5 text-left">
              {(hasParticipant || participant === "") && (
                <span className={cn("truncate text-body-sm", !hasParticipant && HINT)}>
                  {hasParticipant ? participant : "Participant"}
                </span>
              )}
              {(hasDestination || destinationPlaceholder) && (
                <span
                  className={cn(
                    "flex items-center gap-1.5 text-body-sm",
                    hasDestination ? "opacity-70" : HINT,
                  )}
                >
                  {destinationIcon && <span className="shrink-0">{destinationIcon}</span>}
                  <span className="truncate">
                    {hasDestination ? destination : destinationPlaceholder}
                  </span>
                </span>
              )}
            </div>
          )}

          {hasFooter && (
            <div className="mt-1 flex items-end justify-between gap-2 border-t border-white/15 pt-2 text-left">
              <span className="text-body-sm">{footerStart}</span>
              <span className="text-caption opacity-70">{footerEnd}</span>
            </div>
          )}
        </div>
      </DiagramNode>
    </div>
  )
}

export { AnchorCard }
export type { AnchorCardProps }
