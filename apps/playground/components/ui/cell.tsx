"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function TextStack({ primary, secondary, className }: {
  primary: React.ReactNode
  secondary?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-caption-light text-[var(--color-text-default)]">{primary}</span>
      {secondary && (
        <span className="text-caption-sm-light text-[var(--color-text-muted)]">{secondary}</span>
      )}
    </div>
  )
}

function DataCell({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("text-body-sm-light text-[var(--color-text-default)]", className)}>
      {children}
    </span>
  )
}

function AmountCell({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("text-body-sm text-[var(--color-text-default)] tabular-nums tracking-tight", className)}>
      {children}
    </span>
  )
}

function BadgeCell({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>{children}</div>
  )
}

function ActionCell({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>{children}</div>
  )
}

export { TextStack, DataCell, AmountCell, BadgeCell, ActionCell }
