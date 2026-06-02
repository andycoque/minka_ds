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
// Dot + label status indicator. Use instead of badges for table status columns.

type StatusCellVariant = "success" | "warning" | "error" | "neutral"

interface StatusCellProps {
  variant: StatusCellVariant
  children: React.ReactNode
  className?: string
}

const STATUS_DOT: Record<StatusCellVariant, string> = {
  success: "bg-[var(--primitive-green-500)]",
  warning: "bg-[var(--primitive-yellow-300)]",
  error:   "bg-[var(--primitive-red-500)]",
  neutral: "bg-[var(--color-text-disabled)]",
}

const STATUS_TEXT: Record<StatusCellVariant, string> = {
  success: "text-[var(--primitive-green-700)]",
  warning: "text-[var(--color-text-default)]",
  error:   "text-[var(--color-text-default)]",
  neutral: "text-[var(--color-text-disabled)]",
}

function StatusCell({ variant, children, className }: StatusCellProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-body-sm", STATUS_TEXT[variant], className)}>
      <span className={cn("size-1.5 rounded-full shrink-0", STATUS_DOT[variant])} />
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
}
