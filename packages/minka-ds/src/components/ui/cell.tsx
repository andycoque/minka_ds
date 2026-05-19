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
  return (
    <span
      className={cn(
        "text-body-sm text-[var(--color-text-default)] tabular-nums tracking-tight",
        className
      )}
    >
      {children}
    </span>
  )
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

export { TextStack, DataCell, AmountCell, BadgeCell, ActionCell }
export type {
  TextStackProps,
  DataCellProps,
  AmountCellProps,
  BadgeCellProps,
  ActionCellProps,
}
