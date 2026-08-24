"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "../../lib/utils"
import { DiagramNode, type DiagramNodeVariant } from "./diagram-node"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

/**
 * A horizontal process: objects joined by named actions, read left to right.
 *
 *   [wallet] —send $X→ [key] —resolves to→ [wallet]
 *
 * The sibling of `FlowDiagram`, and the distinction matters when choosing between
 * them. `FlowDiagram` is vertical and shows a BALANCE MOVEMENT: two ends, an amount,
 * and what each side is worth afterwards. This shows a PROCESS: any number of steps,
 * each either done or not, and where it stopped if it stopped.
 *
 * Promoted out of the transactions detail page, where it was built and proven. Kept
 * generic: it knows about nodes, arrows and states, and nothing about transactions.
 *
 * Node state lives here rather than on `DiagramNode`, because "failed" is only
 * meaningful inside a process. A liquidity diagram's nodes have no such notion, and
 * putting the prop on the node would invite it.
 */

/** complete = the flow passed through. pending = halted here, in progress. failed =
 *  broke here. upcoming = never reached. */
type ProcessState = "complete" | "pending" | "failed" | "upcoming"

interface ProcessNode {
  /** Wallet (white) for a party, anchor (navy) for a routing handle. */
  variant?: DiagramNodeVariant
  /** Tighter padding. Anchor nodes usually want this. */
  compact?: boolean
  children: React.ReactNode
}

interface ProcessArrow {
  /** Rides the centre of the arrow. An amount, or the name of the action. */
  chip?: React.ReactNode
}

interface ProcessStep {
  node: ProcessNode
  /** The arrow that FOLLOWS this node. Omit on the last step. */
  arrow?: ProcessArrow
}

interface ProcessDiagramProps {
  steps: ProcessStep[]
  /**
   * Where the flow stopped, as an index into the interleaved node/arrow sequence:
   * node 0 is 0, the arrow after it is 1, node 1 is 2, and so on. Everything before
   * is complete, everything after is upcoming.
   *
   * Omit for a flow that completed.
   */
  haltAt?: number
  haltKind?: "pending" | "failed"
  /** Shown in the halt marker's tooltip. Say why, and what to do about it. */
  haltReason?: React.ReactNode
  className?: string
}

const ARROW_W = 140
const ARROW_H = 56
const CY = ARROW_H / 2

function stateAt(index: number, haltAt: number | undefined, kind: "pending" | "failed"): ProcessState {
  if (haltAt == null) return "complete"
  if (index < haltAt) return "complete"
  if (index === haltAt) return kind
  return "upcoming"
}

/**
 * The one marker used at every halt site, so an arrow gap and a node corner never
 * disagree. Pending pulses amber (in progress); failed is a static red break (a
 * fault, louder, and not pulsing because it is not going anywhere).
 */
function HaltMarker({
  kind,
  reason,
}: {
  kind: "pending" | "failed"
  reason?: React.ReactNode
}) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          {kind === "pending" ? (
            <button
              type="button"
              aria-label="Why is this pending?"
              className="block size-3 cursor-help rounded-full bg-[var(--color-feedback-warning)] [box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-feedback-warning)_35%,transparent)] [animation:ds-process-pulse_1.6s_ease-in-out_infinite] motion-reduce:[animation:none]"
            />
          ) : (
            <button
              type="button"
              aria-label="Why did this fail?"
              className="flex size-[18px] cursor-help items-center justify-center rounded-full bg-[var(--color-feedback-error)] text-[var(--color-text-inverse)] shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
            >
              <X className="size-3" strokeWidth={3} />
            </button>
          )}
        </TooltipTrigger>
        {reason && (
          <TooltipContent side="top" className="max-w-[280px] text-pretty">
            {reason}
          </TooltipContent>
        )}
      </Tooltip>
      <style>{`@keyframes ds-process-pulse {
        0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-feedback-warning) 35%, transparent); }
        50%      { box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-feedback-warning) 12%, transparent); }
      }`}</style>
    </>
  )
}

/** Wraps a node: ghosts it when upcoming, pins a halt marker when it stopped here. */
function NodeShell({
  state,
  reason,
  children,
}: {
  state: ProcessState
  reason?: React.ReactNode
  children: React.ReactNode
}) {
  const halted = state === "pending" || state === "failed"
  return (
    <div
      className={cn(
        "relative shrink-0 transition-opacity",
        state === "upcoming" && "opacity-35 grayscale",
      )}
    >
      {/* The pulsing outline sits just outside the card so it does not fight
          DiagramNode's own stroke. */}
      {halted && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px [border-radius:calc(var(--radius-card)+1px)] motion-reduce:[animation:none]",
            state === "pending"
              ? "[animation:ds-process-halt-amber_1.6s_ease-in-out_infinite]"
              : "[animation:ds-process-halt-red_1.6s_ease-in-out_infinite]",
          )}
        />
      )}
      {children}
      {halted && (
        <span className="absolute -right-1.5 -top-1.5 z-10">
          <HaltMarker kind={state} reason={reason} />
        </span>
      )}
      <style>{`
        @keyframes ds-process-halt-amber {
          0%, 100% { box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-feedback-warning) 55%, transparent); }
          50%      { box-shadow: 0 0 0 5px color-mix(in srgb, var(--color-feedback-warning) 18%, transparent); }
        }
        @keyframes ds-process-halt-red {
          0%, 100% { box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-feedback-error) 60%, transparent); }
          50%      { box-shadow: 0 0 0 5px color-mix(in srgb, var(--color-feedback-error) 18%, transparent); }
        }
      `}</style>
    </div>
  )
}

/**
 * A drawn arrow with a chip on it.
 *
 *   complete → solid line, arrowhead, a travelling sheen
 *   pending  → truncates partway, pulsing tip, dashed remainder
 *   failed   → runs red to the break, dashed remainder
 *   upcoming → dashed throughout, chip dimmed
 */
function ActionArrow({
  chip,
  state,
  reason,
}: {
  chip?: React.ReactNode
  state: ProcessState
  reason?: React.ReactNode
}) {
  const gid = React.useId()
  const head = `M${ARROW_W - 6} ${CY - 5} L${ARROW_W} ${CY} L${ARROW_W - 6} ${CY + 5}`

  // The chip is centred on the arrow, so the halt marker centres in the gap between
  // the node edge and the chip. Chip width is measured rather than assumed, since the
  // label is caller-supplied.
  const chipRef = React.useRef<HTMLSpanElement>(null)
  const [pillW, setPillW] = React.useState(76)
  React.useEffect(() => {
    const el = chipRef.current
    if (!el) return
    const measure = () => setPillW(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const haltX = Math.max(8, (ARROW_W - pillW) / 2 / 2)

  return (
    <div
      className="relative flex shrink-0 items-center justify-center self-center"
      style={{ width: ARROW_W, height: ARROW_H }}
    >
      <svg
        width={ARROW_W}
        height={ARROW_H}
        viewBox={`0 0 ${ARROW_W} ${ARROW_H}`}
        className="block overflow-visible"
        aria-hidden
      >
        {state === "complete" && (
          <>
            <g
              stroke="var(--color-text-default)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <line x1="0" y1={CY} x2={ARROW_W} y2={CY} />
              <path d={head} />
            </g>
            <defs>
              <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="0" y1={CY} x2="40" y2={CY}>
                <stop offset="0%" stopColor="var(--color-bg-raised)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-bg-raised)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--color-bg-raised)" stopOpacity="0" />
                <animate attributeName="x1" values={`-40;${ARROW_W}`} dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="x2" values={`0;${ARROW_W + 40}`} dur="2.4s" repeatCount="indefinite" />
              </linearGradient>
            </defs>
            <g stroke={`url(#${gid})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              <line x1="0" y1={CY} x2={ARROW_W} y2={CY} />
              <path d={head} />
            </g>
          </>
        )}

        {(state === "pending" || state === "failed") && (
          <g strokeWidth="2" strokeLinecap="round" fill="none">
            <line
              x1="0"
              y1={CY}
              x2={haltX}
              y2={CY}
              stroke={state === "failed" ? "var(--color-feedback-error)" : "var(--color-text-default)"}
            />
            <line
              x1={haltX}
              y1={CY}
              x2={ARROW_W}
              y2={CY}
              stroke="var(--color-border-default)"
              strokeDasharray="4 5"
            />
          </g>
        )}

        {state === "upcoming" && (
          <g strokeWidth="2" strokeLinecap="round" fill="none">
            <line
              x1="0"
              y1={CY}
              x2={ARROW_W}
              y2={CY}
              stroke="var(--color-border-default)"
              strokeDasharray="4 5"
            />
          </g>
        )}
      </svg>

      {chip && (
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            state === "upcoming" && "opacity-40",
          )}
        >
          <span ref={chipRef} className="inline-flex">
            {chip}
          </span>
        </span>
      )}

      {(state === "pending" || state === "failed") && (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(haltX / ARROW_W) * 100}%`, top: "50%" }}
        >
          <HaltMarker kind={state} reason={reason} />
        </span>
      )}
    </div>
  )
}

/** An amount, in the neutral inverted chip. The default weight for a value. */
function ProcessAmountChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="[border-radius:var(--radius-badge)] bg-[var(--color-bg-inverted)] px-2.5 py-1 text-label text-[var(--color-text-inverse)]">
      {children}
    </span>
  )
}

/** The name of an action, in a quiet outlined chip. */
function ProcessLabelChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="whitespace-nowrap [border-radius:var(--radius-badge)] border border-[var(--color-border-default)] bg-[var(--color-bg-base)] px-2.5 py-1 text-caption-sm text-[var(--color-text-muted)]">
      {children}
    </span>
  )
}

function ProcessDiagram({
  steps,
  haltAt,
  haltKind = "pending",
  haltReason,
  className,
}: ProcessDiagramProps) {
  return (
    <TooltipProvider>
      <div className={cn("flex w-full items-center justify-center py-2", className)}>
        {steps.map((step, i) => {
          // Interleaved index: node i sits at 2i, the arrow after it at 2i + 1.
          const nodeIndex = i * 2
          const arrowIndex = nodeIndex + 1
          return (
            <React.Fragment key={i}>
              <NodeShell state={stateAt(nodeIndex, haltAt, haltKind)} reason={haltReason}>
                <DiagramNode variant={step.node.variant ?? "wallet"} compact={step.node.compact}>
                  {step.node.children}
                </DiagramNode>
              </NodeShell>
              {step.arrow && (
                <ActionArrow
                  chip={step.arrow.chip}
                  state={stateAt(arrowIndex, haltAt, haltKind)}
                  reason={haltReason}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

export { ProcessDiagram, ProcessAmountChip, ProcessLabelChip }
export type { ProcessDiagramProps, ProcessNode, ProcessStep, ProcessState }
