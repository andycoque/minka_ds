"use client"

import * as React from "react"
import {
  DiagramNode,
  ExpandablePanel,
  FlowDiagram,
  Toaster,
  TabCount,
  Timeline,
  toast,
  Button,
} from "minka-ds"
import { Landmark, Wallet } from "lucide-react"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Batch 7: the diagram family, plus the remaining surfaces worth a page.
 */

// ── DiagramNode ───────────────────────────────────────────────────────────────

const NODE_CONTROLS: Control[] = [
  {
    type: "select",
    name: "variant",
    label: "Variant",
    options: [
      { value: "wallet", label: "Wallet" },
      { value: "anchor", label: "Anchor" },
    ],
    defaultValue: "wallet",
  },
  { type: "toggle", name: "filled", label: "Filled", defaultValue: true },
  { type: "toggle", name: "compact", label: "Compact", defaultValue: false },
]

function DiagramNodeDemo() {
  return (
    <Playground
      controls={NODE_CONTROLS}
      minHeight={190}
      details={(state) => (
        <Anatomy>
          <Part name="variant">
            {state.variant === "anchor"
              ? "Inverted navy with light ink: a routing handle — a directory key, a QR code, a dynamic key."
              : "White and raised: a party or a wallet. The neutral treatment."}
          </Part>
          <Part name="filled">
            {state.filled
              ? "A real object."
              : "A dashed empty slot, for a creation flow where nothing is entered yet."}
          </Part>
          <Part name="accent" optional>
            A brand pair, for a state node in a flow (issue, destroy). Overrides the
            variant colours, so use it only where the state carries meaning.
          </Part>
          <Part name="children">
            Whatever the node holds. <Code>AnchorCard</Code> and{" "}
            <Code>RecordCard</Code> are the two standard fillings.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="w-full max-w-[260px]">
          <DiagramNode
            variant={String(state.variant) as "wallet" | "anchor"}
            filled={Boolean(state.filled)}
            compact={Boolean(state.compact)}
            className="w-full"
          >
            <div className="flex items-center gap-3 text-current">
              <span className="flex size-8 shrink-0 items-center justify-center [border-radius:var(--radius-button)] bg-[var(--color-bg-base)] text-[var(--color-text-muted)]">
                {state.variant === "anchor" ? (
                  <Landmark className="size-4" />
                ) : (
                  <Wallet className="size-4" />
                )}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-body-sm">Bancolombia S.A.</span>
                <span className="truncate text-caption opacity-70">0345 6678 9012</span>
              </div>
            </div>
          </DiagramNode>
        </div>
      )}
    </Playground>
  )
}

// ── FlowDiagram ───────────────────────────────────────────────────────────────

const FLOW_CONTROLS: Control[] = [
  {
    type: "select",
    name: "direction",
    label: "Direction",
    options: [
      { value: "down", label: "Down (top-up)" },
      { value: "up", label: "Up (withdraw)" },
    ],
    defaultValue: "down",
  },
  { type: "toggle", name: "amount", label: "With amount", defaultValue: true },
]

function FlowDiagramDemo() {
  return (
    <Playground
      controls={FLOW_CONTROLS}
      minHeight={330}
      details={() => (
        <Anatomy>
          <Part name="top / bottom">
            The two ends, fixed in place. Each carries a name, a current balance and the
            balance after the movement.
          </Part>
          <Part name="direction">
            Which way the arrow and its sheen travel. The nodes do not swap: position is
            stable so the reader is not re-reading the diagram.
          </Part>
          <Part name="amount">
            What is moving. Zero renders the idle state rather than a zero.
          </Part>
          <Part name="accent" optional>
            A brand pair. Semantic only where the movement itself carries meaning, as on
            issue and destroy.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="w-full max-w-[300px]">
          <FlowDiagram
            direction={String(state.direction) as "up" | "down"}
            amount={state.amount ? 5_000_000 : 0}
            currency="COP"
            top={{
              name: "Banco Minka",
              current: 42_000_000,
              after: state.amount ? (state.direction === "down" ? 37_000_000 : 47_000_000) : null,
            }}
            bottom={{
              name: "Bancolombia S.A.",
              current: 12_000_000,
              after: state.amount ? (state.direction === "down" ? 17_000_000 : 7_000_000) : null,
            }}
          />
        </div>
      )}
    </Playground>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────────

function TimelineDemo() {
  return (
    <Playground
      controls={[]}
      minHeight={300}
      details={() => (
        <Anatomy>
          <Part name="sections">
            Groups of items, each with an optional milestone that closes it. A section is
            a phase of the record's life.
          </Part>
          <Part name="items">
            One event each: a label, a status, an optional timestamp and meta. Items with{" "}
            <Code>fields</Code> can expand to show the underlying proof.
          </Part>
          <Part name="position">
            Which end of its items the milestone sits at. Every section in the product
            passes <Code>top</Code>, so the phase name leads the events it covers.
          </Part>
          <Part name="truncateAtFailure" optional>
            Stops rendering after the first failure. The steps that never ran are not
            shown as pending, because they are not pending — they are moot.
          </Part>
        </Anatomy>
      )}
    >
      {() => (
        <div className="w-full max-w-md">
          <Timeline
            sections={[
              {
                items: [
                  { label: "Transaction created", status: "done", meta: "Ledger", timestamp: "14:00:00.000" },
                  { label: "Sender debited", status: "done", meta: "Bancolombia", timestamp: "14:00:00.412" },
                ],
                position: "top",
                milestone: { label: "Prepared", lead: "Prepare", variant: "success", active: true },
              },
              {
                items: [
                  { label: "Receiver credited", status: "done", meta: "Nequi", timestamp: "14:00:01.108" },
                ],
                position: "top",
                milestone: { label: "Committed", lead: "Commit", variant: "success", active: true },
              },
            ]}
          />
        </div>
      )}
    </Playground>
  )
}

// ── ExpandablePanel ───────────────────────────────────────────────────────────

function ExpandablePanelDemo() {
  return (
    <Playground
      controls={[]}
      minHeight={220}
      details={() => (
        <Anatomy>
          <Part name="title">
            What the panel holds, readable while collapsed.
          </Part>
          <Part name="subtitle" optional>
            A second line: the summary that saves opening it.
          </Part>
          <Part name="meta" optional>
            Right-aligned, e.g. a count or a timestamp.
          </Part>
          <Part name="children">
            The detail, revealed on expand.
          </Part>
        </Anatomy>
      )}
    >
      {() => (
        <div className="flex w-full max-w-md flex-col gap-2">
          <ExpandablePanel
            title="Request payload"
            subtitle="4 fields"
            meta="14:00:00.000"
          >
            <div className="flex flex-col gap-2 pt-1">
              {[
                ["handle", "pay.bancolombia"],
                ["amount", "120000"],
                ["currency", "COP"],
                ["reference", "REF-20260412-101"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4">
                  <span className="text-caption text-[var(--color-text-muted)]">{k}</span>
                  <span className="text-body-sm text-[var(--color-text-default)]">{v}</span>
                </div>
              ))}
            </div>
          </ExpandablePanel>
        </div>
      )}
    </Playground>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────

const TOAST_CONTROLS: Control[] = [
  {
    type: "select",
    name: "kind",
    label: "Kind",
    options: [
      { value: "success", label: "Success" },
      { value: "error", label: "Error" },
      { value: "plain", label: "Plain" },
    ],
    defaultValue: "success",
  },
  { type: "toggle", name: "description", label: "With description", defaultValue: true },
]

function ToastDemo() {
  return (
    <Playground
      controls={TOAST_CONTROLS}
      minHeight={180}
      details={() => (
        <Anatomy>
          <Part name="toast.success / toast.error">
            The two used in the product. Called imperatively from a handler, never
            rendered as an element.
          </Part>
          <Part name="description" optional>
            What it applied to — the record's name. The title says what happened, the
            description says to what.
          </Part>
          <Part name="Toaster">
            Mounted once in the app shell. Every <Code>toast()</Code> call renders
            through it, so no page mounts its own. Exported as{" "}
            <Code>Toaster</Code>, not <Code>Sonner</Code>.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <>
          <Toaster />
          <Button
            variant="outline"
            onClick={() => {
              const description = state.description ? { description: "pay.bancolombia" } : undefined
              if (state.kind === "success") toast.success("Directory key inactive", description)
              else if (state.kind === "error") toast.error("Could not reach the ledger", description)
              else toast("Report queued", description)
            }}
          >
            Show toast
          </Button>
        </>
      )}
    </Playground>
  )
}

// ── TabCount ──────────────────────────────────────────────────────────────────

function TabCountDemo() {
  return (
    <Playground
      controls={[]}
      minHeight={130}
      details={() => (
        <Anatomy>
          <Part name="count">
            A number. The only prop: a fixed 16px circle, so a two-digit count does not
            change the height of the row it sits in.
          </Part>
        </Anatomy>
      )}
    >
      {() => (
        <div className="flex items-center gap-4">
          <TabCount count={4} />
          <TabCount count={28} />
          <TabCount count={128} />
        </div>
      )}
    </Playground>
  )
}

export {
  DiagramNodeDemo,
  FlowDiagramDemo,
  TimelineDemo,
  ExpandablePanelDemo,
  ToastDemo,
  TabCountDemo,
}
