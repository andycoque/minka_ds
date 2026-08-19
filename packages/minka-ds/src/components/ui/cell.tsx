"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

// ── TextStack ─────────────────────────────────────────────────────────────────
// Two-line cell content: a primary label and an optional muted secondary line.
// Use inside <TableCell> for entity columns (sender, receiver, etc.)

interface TextStackProps {
  primary: React.ReactNode
  secondary?: React.ReactNode
  inline?: boolean
  className?: string
}

function TextStack({ primary, secondary, inline, className }: TextStackProps) {
  return (
    <div className={cn(inline ? "flex flex-row items-baseline gap-1.5" : "flex flex-col gap-0.5", className)}>
      <span className="text-caption-light text-[var(--color-text-default)]">{primary}</span>
      {secondary && (
        <span className="text-caption-sm-light text-[var(--color-text-muted)]">{secondary}</span>
      )}
    </div>
  )
}

// ── DataCell ──────────────────────────────────────────────────────────────────
// Single-line plain data value. Use for IDs, timestamps, codes.

interface DataCellProps {
  children: React.ReactNode
  className?: string
}

function DataCell({ children, className }: DataCellProps) {
  return (
    <span
      className={cn(
        "text-body-sm-light text-[var(--color-text-default)]",
        className
      )}
    >
      {children}
    </span>
  )
}

// ── AmountCell ────────────────────────────────────────────────────────────────
// Right-aligned numeric/currency value.

interface AmountCellProps {
  children: React.ReactNode
  className?: string
}

function AmountCell({ children, className }: AmountCellProps) {
  const base = cn("text-body-sm text-[var(--color-text-default)]", className)

  // PP Neue Montreal's $ glyph has a wide right sidebearing that creates a
  // visible gap before digits. Split it into its own box with a negative
  // margin so we can close just that gap without touching digit spacing.
  if (typeof children === "string" && children.startsWith("$")) {
    return (
      <span className={base}>
        <span className="inline-block -mr-[0.05em]">$</span>{children.slice(1)}
      </span>
    )
  }

  return <span className={base}>{children}</span>
}

// ── BadgeCell ─────────────────────────────────────────────────────────────────
// Centered wrapper for one or more badges inside a table cell.

interface BadgeCellProps {
  children: React.ReactNode
  className?: string
}

function BadgeCell({ children, className }: BadgeCellProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>{children}</div>
  )
}

// ── ActionCell ────────────────────────────────────────────────────────────────
// Flex row for action buttons inside a table cell.

interface ActionCellProps {
  children: React.ReactNode
  className?: string
}

function ActionCell({ children, className }: ActionCellProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>{children}</div>
  )
}

// ── StatusCell ────────────────────────────────────────────────────────────────
// Dot + label status indicator. The canonical way to show a status ANYWHERE — table
// columns and detail-page headers alike. Never a Badge: a badge reads as a label you
// applied to the thing, where a status is a state the thing is in.

/**
 * `blocked` is black rather than red: something is deliberately preventing the record
 * from being used, which is a different fact from a failure. Red is reserved for a
 * fault or an irrevocable step. Grey (`neutral`) would read as merely inactive.
 */
type StatusCellVariant = "success" | "warning" | "error" | "blocked" | "neutral"

/**
 * `default` is the table-column size. `lg` is for a detail-page identity header, where
 * the status sits beside a heading-4 title and the small size read as an afterthought
 * next to it.
 */
type StatusCellSize = "default" | "lg"

interface StatusCellProps {
  variant: StatusCellVariant
  size?: StatusCellSize
  children: React.ReactNode
  className?: string
}

/**
 * Dot colour per status variant. Exported because a status sometimes has to be drawn
 * outside a StatusCell (e.g. as a choice in a list, where the label must stay in the
 * default text colour and the dot moves to the trailing edge). One map so a new
 * variant cannot get a dot here and be missed there.
 */
export const STATUS_DOT: Record<StatusCellVariant, string> = {
  success: "bg-[var(--primitive-green-500)]",
  warning: "bg-[var(--primitive-yellow-300)]",
  error:   "bg-[var(--primitive-red-500)]",
  blocked: "bg-[var(--color-text-default)]",
  neutral: "bg-[var(--color-text-disabled)]",
}

const STATUS_TEXT: Record<StatusCellVariant, string> = {
  success: "text-[var(--primitive-green-700)]",
  warning: "text-[var(--color-text-default)]",
  error:   "text-[var(--color-text-default)]",
  blocked: "text-[var(--color-text-default)]",
  neutral: "text-[var(--color-text-disabled)]",
}

function StatusCell({ variant, size = "default", children, className }: StatusCellProps) {
  const lg = size === "lg"
  return (
    <span
      className={cn(
        "inline-flex items-center",
        lg ? "gap-2 text-body" : "gap-1.5 text-body-sm",
        STATUS_TEXT[variant],
        className,
      )}
    >
      <span className={cn("rounded-full shrink-0", lg ? "size-2" : "size-1.5", STATUS_DOT[variant])} />
      {children}
    </span>
  )
}

export { TextStack, DataCell, AmountCell, BadgeCell, ActionCell, StatusCell }
export type {
  TextStackProps,
  DataCellProps,
  AmountCellProps,
  BadgeCellProps,
  ActionCellProps,
  StatusCellProps,
  StatusCellVariant,
  StatusCellSize,
}
