"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { StatusCell, type StatusCellVariant } from "./cell"

/**
 * The identity header on a detail page: back link, title, status, actions, and an
 * optional band of metadata below.
 *
 * Extracted because six pages had built it by hand — alias, payment instruments,
 * bridges, API keys, signers, reports — and had already diverged. Three put the
 * status below the title and two beside it; two carried a copy-ID button and the
 * rest did not; the title used `heading-2-serif` on four and `heading-4` on two.
 * None of that was a decision, it was the order the pages were written in.
 *
 * Status sits INLINE with the title, on one baseline. That is the settled shape:
 * the title names the record and the status qualifies it, so they read as one
 * statement rather than a heading with a caption under it.
 *
 * `StatusCell` is not a prop the consumer builds. Pass `status` and the header
 * renders it at the right size, which is the whole reason `size="lg"` exists.
 */

interface DetailHeaderStatus {
  variant: StatusCellVariant
  /** The label. Can carry an icon, e.g. a spinner on a running job. */
  label: React.ReactNode
}

interface DetailHeaderProps {
  /** Back link and breadcrumb. Rendered above the title row. */
  nav?: React.ReactNode
  title: React.ReactNode
  status?: DetailHeaderStatus
  /**
   * Sits immediately after the title, before the status. For a copy-ID button or
   * a type badge — anything that qualifies the identity rather than acting on it.
   */
  adornment?: React.ReactNode
  /**
   * Sits after the status, still on the identity side. For something that
   * qualifies the STATUS rather than the title, e.g. how long a running job has
   * been going. Distinct from `adornment`, which goes before the status.
   */
  trailing?: React.ReactNode
  /** Right-aligned actions on the title row. */
  actions?: React.ReactNode
  /** A band of `MetaField`s below the title row. Wraps on narrow screens. */
  meta?: React.ReactNode
  /** Banners above the title row, e.g. an expiry warning. */
  banner?: React.ReactNode
  /**
   * `page` is the default: the serif display face, for a header that titles the
   * whole page. `section` drops to the UI face for a header nested inside a card,
   * where the serif would compete with the page title above it.
   */
  size?: "page" | "section"
  className?: string
}

function DetailHeader({
  nav,
  title,
  status,
  adornment,
  trailing,
  actions,
  meta,
  banner,
  size = "page",
  className,
}: DetailHeaderProps) {
  return (
    <div className={cn("flex flex-col", size === "page" ? "gap-6" : "gap-5", className)}>
      {nav}
      {banner}

      {/* items-center rather than items-start: the status is on the title's
          baseline, so they centre against each other. `min-w-0` on the identity
          side lets a long title truncate instead of pushing the actions off. */}
      <div className="flex items-center justify-between gap-4">
        {/* A page title is larger, so it needs more air beside it than a section
            title does. */}
        <div className={cn("flex min-w-0 items-center", size === "page" ? "gap-3" : "gap-2")}>
          <span
            className={cn(
              "truncate",
              size === "page" ? "text-heading-2-serif" : "text-heading-4",
            )}
          >
            {title}
          </span>
          {adornment}
          {status ? (
            <StatusCell variant={status.variant} size="lg" className="shrink-0">
              {status.label}
            </StatusCell>
          ) : null}
          {trailing}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {meta ? (
        <div className="flex flex-wrap gap-x-8 gap-y-4">{meta}</div>
      ) : null}
    </div>
  )
}

/**
 * Vertical label-over-value metadata field, for the band under a detail header.
 *
 * Moved here from the studio, where three pages had copy-pasted it and the
 * payment-instruments copy had already drifted by adding the empty-value
 * fallback. It lives in the DS because `DetailHeader` takes a `meta` slot, and a
 * DS component should not depend on a consumer's component to fill it.
 */
function MetaField({
  label,
  children,
  emptyLabel = "Not set",
}: {
  label: string
  children?: React.ReactNode
  /** Shown muted when there is no value, so a detail page never renders a blank. */
  emptyLabel?: string
}) {
  const isEmpty = children == null || children === ""
  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption-light text-[var(--color-text-muted)]">{label}</span>
      {isEmpty ? (
        <span className="text-body-sm text-[var(--color-text-hint)]">{emptyLabel}</span>
      ) : (
        <span className="text-body-sm text-[var(--color-text-default)]">{children}</span>
      )}
    </div>
  )
}

export { DetailHeader, MetaField }
export type { DetailHeaderProps, DetailHeaderStatus }
