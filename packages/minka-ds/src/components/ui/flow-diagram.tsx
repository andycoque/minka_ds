"use client"

import * as React from "react"
import { DiagramNode } from "./diagram-node"

/** Brand pair used to give a node / the flow a semantic accent. */
export type FlowAccent =
  | "yellow-darkforest"
  | "rose-coral"
  | "blue-navy"
  | "beige-bronze"
  | "gray-black"

export interface FlowNode {
  /** Node label (party name). */
  name: string
  /** Current balance; null when hidden (e.g. balance not shown). */
  current: number | null
  /** Projected balance after the movement; null when no amount yet or hidden. */
  after: number | null
  /** Shown in place of a balance when `current` is null (e.g. "Master balance"). */
  subtitle?: string
  /** True when this node is an unfilled slot (e.g. nothing selected yet). */
  empty?: boolean
  /** Optional leading icon (used by state nodes like issue/destroy). */
  icon?: React.ReactNode
  /**
   * When set, this node is a "state" node (no balance) rendered in the pair's
   * colors — used for the abstract create/destroy end of issue/destroy flows.
   */
  accent?: FlowAccent
  /**
   * Invert the accent fill: light member as background, dark as text/border
   * (instead of dark bg + light text). Used to contrast destroy vs issue.
   */
  accentInverted?: boolean
}

type FormatFn = (n: number) => string
const defaultFormat: FormatFn = (n) => "$" + n.toLocaleString("en-US")

/**
 * Exact-dash rounded border via an SVG rect overlay (CSS border-dashed has a
 * fixed dash pattern that can't be sized). 6px dash / 6px gap. Fills its
 * relatively-positioned parent.
 */
function DashedBorder({ radius = 10 }: { radius?: number }) {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden>
      <rect
        x="0.75" y="0.75"
        width="100%" height="100%"
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

export interface FlowDiagramProps {
  /** Top node (fixed position). */
  top: FlowNode
  /** Bottom node (fixed position). */
  bottom: FlowNode
  /** The amount flowing; 0 = idle/empty state. */
  amount: number
  /** Flow direction — arrow + sheen travel this way. */
  direction: "up" | "down"
  /** Unit shown beside the amount. */
  currency?: string
  /** Custom amount/balance formatter (defaults to "$" + en-US grouping). */
  format?: FormatFn
  /** Optional content rendered below the diagram (e.g. a reference pill). */
  footer?: React.ReactNode
  /**
   * Semantic accent (brand pair) for the flow — tints the arrow, sheen and
   * amount chip. Used by issue/destroy to read as generative/destructive.
   */
  accent?: FlowAccent
}

/**
 * Vertical flow diagram for a value movement between two parties. Positions are
 * FIXED (`top` / `bottom`); only the `direction` changes which way the arrow
 * points and the light sheen travels. Each node shows its current balance,
 * which demotes to a "was …" caption as the new (after) balance slides in once
 * an amount is entered. Unfilled nodes render as a dashed empty slot. Neutral
 * styling — suited to neutral transfers.
 */
function FlowDiagram({ top, bottom, amount, direction, currency = "COP", format = defaultFormat, footer, accent }: FlowDiagramProps) {
  const active = amount > 0
  const glintKey = active ? amount : 0

  return (
    <div data-slot="flow-diagram" className="relative flex flex-col items-center">
      <style>{`
        @keyframes flow-slide-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flow-pop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      <FlowNodeCard key={top.empty ? "top-empty" : `top-${top.name}`} node={top} active={active} format={format} pop />

      <Connector active={active} direction={direction} amount={amount} currency={currency} format={format} glintKey={glintKey} accent={accent} />

      <FlowNodeCard key={bottom.empty ? "bottom-empty" : `bottom-${bottom.name}`} node={bottom} active={active} format={format} pop />

      {/* footer (e.g. reference pill) is absolutely positioned above the diagram
          so it doesn't shift the diagram's vertical centering when it appears */}
      {footer && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6">{footer}</div>
      )}
    </div>
  )
}

// Full connector height: enough for top gap + badge + bottom gap.
const CONNECTOR_H = 80

function Connector({
  active, direction, amount, currency, format, glintKey, accent,
}: {
  active: boolean
  direction: "up" | "down"
  amount: number
  currency: string
  format: FormatFn
  glintKey: number
  accent?: FlowAccent
}) {
  const gid = React.useId()
  const H = CONNECTOR_H
  const headUp = direction === "up"

  // active stroke: semantic pair-dark when accented, else default ink
  const activeStroke = accent ? `var(--color-pair-${accent}-dark)` : "var(--color-text-default)"

  const head = headUp ? "M2 6 L7 0 L12 6" : `M2 ${H - 6} L7 ${H} L12 ${H - 6}`
  const shapes = (
    <>
      <line x1="7" y1="0" x2="7" y2={H} />
      <path d={head} />
    </>
  )

  return (
    <div className="relative flex items-center justify-center my-1" style={{ height: H }}>
      <svg width="14" height={H} viewBox={`0 0 14 ${H}`} className="block overflow-visible" aria-hidden>
        <g stroke={active ? activeStroke : "var(--color-border-strong)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {shapes}
        </g>
        {active && (
          <>
            <defs>
              <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="7" y1="0" x2="7" y2="18">
                <stop offset="0%"   stopColor="var(--color-bg-raised)" stopOpacity="0" />
                <stop offset="50%"  stopColor="var(--color-bg-raised)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-bg-raised)" stopOpacity="0" />
                <animate attributeName="y1" values={direction === "down" ? `-20;${H}` : `${H};-20`} dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="y2" values={direction === "down" ? `-2;${H + 18}` : `${H + 18};-2`} dur="2.4s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            <g stroke={`url(#${gid})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {shapes}
            </g>
          </>
        )}
      </svg>

      <span
        key={glintKey}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 [border-radius:var(--radius-badge)] text-label-mono transition-colors duration-300 ${
          active
            ? "bg-[var(--color-bg-inverted)] text-[var(--color-text-inverse)]"
            : "bg-[var(--color-bg-base)] text-[var(--color-text-hint)]"
        }`}
      >
        {!active && <DashedBorder radius={16} />}
        {active ? format(amount) : format(0)}
        <span className={`text-caption ml-1 ${active ? "text-[var(--color-text-inverse-muted)]" : "text-[var(--color-text-muted)]"}`}>{currency}</span>
      </span>
    </div>
  )
}

function FlowNodeCard({ node, active, format }: { node: FlowNode; active: boolean; format: FormatFn; pop?: boolean }) {
  const showAfter = active && node.after !== null
  const overdrawn = node.after !== null && node.after < 0

  // Empty slot
  if (node.empty) {
    return (
      <DiagramNode filled={false}>
        <span className="text-body-sm text-[var(--color-text-hint)]">{node.name}</span>
      </DiagramNode>
    )
  }

  // State node (issue/destroy): pair-colored, no balance. Icon + label, subtext below.
  if (node.accent) {
    const subInk = node.accentInverted ? "var(--color-text-default)" : "var(--color-text-inverse)"
    return (
      <DiagramNode accent={node.accent} accentInverted={node.accentInverted}>
        <div className="flex flex-col items-center gap-1">
          <span className="flex items-center gap-1.5 text-body-sm">
            {node.icon && <span className="flex items-center [&_svg]:size-4">{node.icon}</span>}
            {node.name}
          </span>
          {node.subtitle && <span className="text-caption" style={{ color: subInk }}>{node.subtitle}</span>}
        </div>
      </DiagramNode>
    )
  }

  // Wallet / balance node
  return (
    <DiagramNode variant="wallet">
      <div className="flex flex-col items-center gap-1">
        <span className="text-body-sm text-[var(--color-text-default)]">{node.name}</span>

        {node.current === null ? (
          node.subtitle ? <span className="text-caption text-[var(--color-text-muted)]">{node.subtitle}</span> : null
        ) : (
          <div className="flex flex-col items-center leading-none">
            <span
              className={`origin-bottom transition-all duration-300 ${
                showAfter
                  ? "scale-[0.78] text-caption text-[var(--color-text-muted)] mb-0.5"
                  : "text-label-mono text-[var(--color-text-default)]"
              }`}
            >
              {showAfter ? `was ${format(node.current)}` : format(node.current)}
            </span>
            {showAfter && (
              <span
                className={`text-label-mono ${overdrawn ? "text-[var(--color-feedback-error)]" : "text-[var(--color-text-default)]"}`}
                style={{ animation: "flow-slide-in .3s ease both" }}
              >
                {format(node.after!)}
              </span>
            )}
          </div>
        )}
      </div>
    </DiagramNode>
  )
}

export { FlowDiagram }
