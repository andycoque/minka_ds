"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export type DiagramNodeVariant = "wallet" | "anchor"

/** Brand pair for state nodes (issue/destroy). */
export type DiagramAccent =
  | "yellow-darkforest"
  | "rose-coral"
  | "blue-navy"
  | "beige-bronze"
  | "gray-black"

export interface DiagramNodeProps {
  /** Node type — drives default colors. wallet = white/raised, anchor = inverted slate. */
  variant?: DiagramNodeVariant
  /** When false, renders a dashed empty slot. */
  filled?: boolean
  /** Pair-colored "state" node (issue/destroy). Overrides variant colors. */
  accent?: DiagramAccent
  /** Invert the accent fill (light bg + dark text). */
  accentInverted?: boolean
  /** Compact sizing (used by anchor/alias nodes). */
  compact?: boolean
  className?: string
  children?: React.ReactNode
}

// exact-dash rounded border for the empty state
function DashedBorder({ radius = 10 }: { radius?: number }) {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
      <rect
        x="0.75" y="0.75"
        rx={radius} ry={radius}
        fill="none"
        stroke="var(--color-border-default)"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        style={{ width: "calc(100% - 1.5px)", height: "calc(100% - 1.5px)" }}
      />
    </svg>
  )
}

/**
 * A node card for the diagram family (FlowDiagram, alias resolve, …). Raised
 * two-layer treatment: a 4px stroke ring underneath + a surface on top whose
 * lift shadow falls OVER the stroke (button-like). The stroke grows 0→4px as
 * the node fills (smooth, no layout shift). Empty nodes render a dashed slot.
 *
 * Node type is encoded by color: wallet = white/raised, anchor = inverted slate,
 * accent = pair-colored state (issue/destroy).
 */
function DiagramNode({
  variant = "wallet",
  filled = true,
  accent,
  accentInverted = false,
  compact = false,
  className,
  children,
}: DiagramNodeProps) {
  const sizeClass = compact ? "px-4 py-2 min-h-[48px] min-w-[140px]" : "px-5 py-3 min-h-[64px] min-w-[180px]"

  // resolve fill / stroke / text per type
  let fill = "var(--color-bg-raised)"
  let stroke = "var(--color-border-default)"
  let ink: string | undefined

  if (accent) {
    fill = accentInverted ? `var(--color-pair-${accent}-light)` : `var(--color-pair-${accent}-dark)`
    stroke = accentInverted ? `var(--color-pair-${accent}-dark)` : `var(--color-pair-${accent}-light)`
    ink = accentInverted ? "var(--color-text-default)" : "var(--color-text-inverse)"
  } else if (variant === "anchor") {
    fill = "var(--color-pair-blue-navy-dark)"
    stroke = "var(--color-pair-blue-navy-light)"
    ink = "var(--color-text-inverse)"
  }

  return (
    <div
      data-slot="diagram-node"
      className={cn("relative inline-flex [border-radius:var(--radius-card)]", className)}
      style={filled ? { animation: "diagram-node-pop .18s cubic-bezier(0.16,1,0.3,1) both" } : undefined}
    >
      <style>{`@keyframes diagram-node-pop { from { opacity:0; transform: scale(.96) } to { opacity:1; transform: scale(1) } }`}</style>

      {/* bottom: stroke ring that grows 0→4px on fill */}
      <div
        className="absolute inset-0 [border-radius:var(--radius-card)] transition-[box-shadow] duration-300 ease-out"
        style={{ boxShadow: filled ? `inset 0 0 0 4px ${stroke}` : "inset 0 0 0 0px transparent" }}
      />

      {/* top: surface — inset so the ring shows; bg + lift fade in on fill.
          flex-1 so it fills the wrapper when an explicit width is imposed
          (e.g. w-full), while still shrink-wrapping content otherwise. */}
      <div
        className={cn(
          "relative m-1 flex flex-1 items-center justify-center [border-radius:calc(var(--radius-card)-4px)] text-center transition-[background-color,box-shadow] duration-300 ease-out",
          sizeClass,
        )}
        style={{
          backgroundColor: filled ? fill : "var(--color-bg-base)",
          color: filled ? ink : undefined,
          boxShadow: filled ? "var(--shadow-raised)" : "none",
        }}
      >
        {!filled && <DashedBorder radius={6} />}
        {children}
      </div>
    </div>
  )
}

export { DiagramNode }
