"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { Button } from "./button"

// ── Types ─────────────────────────────────────────────────────────────────────

export type StatCardColor = "default" | "success" | "error" | "muted"

export interface StatCardAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
}

interface StatCardBase {
  label: string
  className?: string
}

export interface StatCardCountProps extends StatCardBase {
  type?: "count"
  value: number | null
  percent?: number
  color?: StatCardColor
  dot?: string
  onClick?: () => void
}

export interface StatCardAmountProps extends StatCardBase {
  type: "amount"
  value: string | number | null
  unit?: string
  percent?: number
  color?: StatCardColor
  secondary?: string
  badge?: string
  actions?: StatCardAction[]
  onClick?: () => void
}

export interface StatCardStatusProps extends StatCardBase {
  type: "status"
  status: string
  color: "success" | "error" | "muted"
}

export type StatCardProps =
  | StatCardCountProps
  | StatCardAmountProps
  | StatCardStatusProps

// ── Color maps ────────────────────────────────────────────────────────────────

const VALUE_COLOR: Record<StatCardColor, string> = {
  default: "text-[var(--color-text-default)]",
  success: "text-[var(--color-feedback-success)]",
  error:   "text-[var(--color-feedback-error)]",
  muted:   "text-[var(--color-text-muted)]",
}

const STATUS_TEXT_COLOR: Record<"success" | "error" | "muted", string> = {
  success: "text-[var(--color-feedback-success)]",
  error:   "text-[var(--color-feedback-error)]",
  muted:   "text-[var(--color-text-disabled)]",
}

const STATUS_DOT_COLOR: Record<"success" | "error" | "muted", string> = {
  success: "bg-[var(--color-feedback-success)]",
  error:   "bg-[var(--color-feedback-error)]",
  muted:   "bg-[var(--color-text-disabled)]",
}

const CARD_BASE = "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-4 py-3"

// ── Component ─────────────────────────────────────────────────────────────────

function StatCard(props: StatCardProps) {
  // Count
  if (!props.type || props.type === "count") {
    const { label, value, percent, color = "default", dot, onClick, className } = props as StatCardCountProps
    const Comp = onClick ? "button" : "div"
    return (
      <Comp
        onClick={onClick}
        className={cn(
          "flex flex-col gap-1",
          CARD_BASE,
          onClick && "text-left hover:bg-[var(--color-bg-table-hover)] transition-colors cursor-pointer",
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          {dot && <span className="size-1.5 rounded-full shrink-0" style={{ background: dot }} />}
          <span className="text-body-sm-light text-[var(--color-text-default)]">{label}</span>
          {percent !== undefined && (
            <span className="text-caption-sm text-[var(--color-text-hint)]">{percent}%</span>
          )}
        </div>
        {value === null ? (
          <span className="text-heading-2-serif text-[var(--color-text-disabled)]">—</span>
        ) : (
          <span className={cn("text-heading-2-serif tabular-nums", VALUE_COLOR[color])}>
            {typeof value === "number" ? value.toLocaleString("en-US") : value}
          </span>
        )}
      </Comp>
    )
  }

  // Amount
  if (props.type === "amount") {
    const { label, value, unit, percent, color = "default", secondary, badge, actions, onClick, className } = props
    const Comp = onClick ? "button" : "div"
    return (
      <Comp
        onClick={onClick}
        className={cn(
          "flex flex-col gap-1",
          CARD_BASE,
          onClick && "text-left hover:bg-[var(--color-bg-table-hover)] transition-colors cursor-pointer",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-body-sm-light text-[var(--color-text-muted)]">{label}</span>
          {percent !== undefined && (
            <span className="text-caption-sm text-[var(--color-text-hint)]">{percent}%</span>
          )}
          {secondary && <span className="text-caption text-[var(--color-text-muted)]">{secondary}</span>}
          {badge && <Badge variant="info">{badge}</Badge>}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            {value === null ? (
              <span className="text-heading-1-serif text-[var(--color-text-disabled)]">—</span>
            ) : (
              <>
                <span className={cn("text-heading-2-serif tabular-nums tracking-tight", VALUE_COLOR[color])}>
                  {value}
                </span>
                {unit && <span className="text-caption text-[var(--color-text-muted)]">{unit}</span>}
              </>
            )}
          </div>
          {actions && actions.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              {actions.map((action, i) => (
                <Button key={i} variant="outline" size="sm" onClick={action.onClick}>
                  {action.icon}{action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Comp>
    )
  }

  // Status
  if (props.type === "status") {
    const { label, status, color, className } = props
    return (
      <div className={cn("flex flex-col gap-1", CARD_BASE, className)}>
        <span className="text-body-sm-light text-[var(--color-text-muted)]">{label}</span>
        <span className={cn("inline-flex items-center gap-1.5 text-heading-2-serif", STATUS_TEXT_COLOR[color])}>
          <span className={cn("size-2 rounded-full shrink-0", STATUS_DOT_COLOR[color])} />
          {status}
        </span>
      </div>
    )
  }

  return null
}

export { StatCard }
