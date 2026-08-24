"use client"

import { Command, Info, TriangleAlert } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  Button,
  Card,
  CardContent,
  Kbd,
  SectionCard,
  Separator,
  StatCard,
} from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Surfaces and small display components for Batch 4.
 *
 * Every specimen is drawn from product code. Where a component has an unused
 * capability the panel says so rather than inventing a case for it.
 */

// ── Alert ─────────────────────────────────────────────────────────────────────

const ALERT_VARIANTS: Control[] = [
  {
    type: "select",
    name: "variant",
    label: "Variant",
    options: [
      { value: "default", label: "Default" },
      { value: "info", label: "Info" },
      { value: "success", label: "Success" },
      { value: "warning", label: "Warning" },
      { value: "error", label: "Error" },
    ],
    defaultValue: "warning",
  },
]

const ALERT_COPY: Record<string, { title: string; body: string }> = {
  default: { title: "Scheduled maintenance", body: "The ledger is read-only between 02:00 and 03:00." },
  info: { title: "Managed in Integrations", body: "This signer belongs to a bridge, so its key rotates there." },
  success: { title: "Participant registered", body: "Banco Davivienda can now settle on this ledger." },
  warning: { title: "This key expires in 9 days", body: "It stops working on 24 Aug 2026. Rotate before then to avoid an outage." },
  error: { title: "Delivery retries exhausted", body: "The bridge stopped retrying after five attempts." },
}

function AlertDemo() {
  return (
    <Playground
      controls={ALERT_VARIANTS}
      minHeight={150}
      details={() => (
        <Anatomy>
          <Part name="AlertTitle">
            One line naming what happened. Not a category like "Warning".
          </Part>
          <Part name="AlertDescription">
            What follows from it, and what to do. Where the action lives.
          </Part>
          <Part name="Icon" optional>
            A `lucide-react` icon as the first child.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        const v = String(state.variant)
        const copy = ALERT_COPY[v]
        return (
          <Alert
            variant={v as "default" | "info" | "success" | "warning" | "error"}
            className="w-full max-w-lg"
          >
            {v === "warning" || v === "error" ? (
              <TriangleAlert className="size-4" />
            ) : (
              <Info className="size-4" />
            )}
            <div>
              <AlertTitle>{copy.title}</AlertTitle>
              <AlertDescription>{copy.body}</AlertDescription>
            </div>
          </Alert>
        )
      }}
    </Playground>
  )
}

// ── StatCard ──────────────────────────────────────────────────────────────────

const STATCARD_TYPES: Control[] = [
  {
    type: "select",
    name: "type",
    label: "Type",
    options: [
      { value: "count", label: "Count" },
      { value: "amount", label: "Amount" },
      { value: "status", label: "Status" },
    ],
    defaultValue: "count",
  },
]

function StatCardDemo() {
  return (
    <Playground
      controls={STATCARD_TYPES}
      minHeight={160}
      details={(state) => {
        const t = String(state.type)
        return (
          <Anatomy>
            <Part name="label">What the figure is.</Part>
            {t === "status" ? (
              <Part name="status">
                The state, as a string. Takes <Code>color</Code> rather than a
                variant.
              </Part>
            ) : (
              <Part name="value">
                The figure. <Code>null</Code> renders a dash rather than a zero.
              </Part>
            )}
            {t === "amount" ? (
              <Part name="unit" optional>
                The currency code, set beside the figure rather than inside it.
              </Part>
            ) : null}
            {t !== "status" ? (
              <Part name="percent" optional>
                A change against the previous period.
              </Part>
            ) : null}
            {t !== "status" ? (
              <Part name="onClick" optional>
                Makes the card a button, for filtering a list to this figure.
              </Part>
            ) : null}
          </Anatomy>
        )
      }}
    >
      {(state) => {
        const t = String(state.type)

        if (t === "amount") {
          return (
            <StatCard
              type="amount"
              label="Available balance"
              value="1,250,000.00"
              unit="COP"
              percent={4.2}
              className="w-64"
            />
          )
        }

        if (t === "status") {
          return (
            <StatCard
              type="status"
              label="Bridge health"
              status="All delivered"
              color="success"
              className="w-64"
            />
          )
        }

        return (
          <StatCard label="Transactions today" value={1284} percent={-2.1} className="w-64" />
        )
      }}
    </Playground>
  )
}

// ── Cards ─────────────────────────────────────────────────────────────────────

const CARD_KIND: Control[] = [
  {
    type: "select",
    name: "kind",
    label: "Component",
    options: [
      { value: "section", label: "SectionCard" },
      { value: "card", label: "Card" },
    ],
    defaultValue: "section",
  },
]

function CardDemo() {
  return (
    <Playground
      controls={CARD_KIND}
      minHeight={190}
      details={(state) =>
        String(state.kind) === "section" ? (
          <Anatomy>
            <Part name="title" optional>
              The section heading, rendered for you.
            </Part>
            <Part name="aside" optional>
              A muted note on the right of the title row, e.g. a count.
            </Part>
            <Part name="bodyClassName" optional>
              Reaches the body, for setting the gap between rows.
            </Part>
          </Anatomy>
        ) : (
          <Anatomy>
            <Part name="CardHeader" optional>
              Holds <Code>CardTitle</Code>, <Code>CardDescription</Code> and{" "}
              <Code>CardAction</Code>.
            </Part>
            <Part name="CardContent">The body.</Part>
            <Part name="CardFooter" optional>
              Actions.
            </Part>
          </Anatomy>
        )
      }
    >
      {(state) =>
        String(state.kind) === "section" ? (
          <SectionCard title="Configuration" aside="4 fields" className="w-full max-w-sm">
            <p className="text-body-sm text-[var(--color-text-muted)]">
              SectionCard renders its own title row, so a detail page does not
              rebuild one per card.
            </p>
          </SectionCard>
        ) : (
          <Card className="w-full max-w-sm">
            <CardContent>
              <p className="text-body-sm text-[var(--color-text-muted)]">
                Card is the unstyled surface. Compose the header yourself, or reach
                for SectionCard.
              </p>
            </CardContent>
          </Card>
        )
      }
    </Playground>
  )
}

// ── Avatar, Kbd, Separator ────────────────────────────────────────────────────

function AvatarDemo() {
  return (
    <Playground controls={[]} minHeight={120}>
      {() => (
        <div className="flex items-center gap-6">
          <Avatar name="Banco Davivienda" />
          <Avatar name="Ximena Rojas" />
          <Avatar name="A" />
        </div>
      )}
    </Playground>
  )
}

/**
 * Kbd, in the shape the product actually uses it: ONE chip per gesture, with the
 * modifier and the key inside it. Taken from `SearchBar`'s `kbdHint`, which wraps
 * whatever it is passed in a single Kbd.
 *
 * The platform chip is a real prop rather than decoration: the modifier is a glyph on
 * macOS and the word Ctrl on Windows, and callers pass whichever `usePlatform`
 * reports.
 */
const KBD_CONTROLS: Control[] = [
  {
    type: "select",
    name: "platform",
    label: "Platform",
    options: [
      { value: "mac", label: "macOS" },
      { value: "win", label: "Windows" },
    ],
    defaultValue: "mac",
  },
]

function KbdDemo() {
  return (
    <Playground
      controls={KBD_CONTROLS}
      minHeight={120}
      details={() => (
        <Anatomy>
          <Part name="children">
            What to press. A modifier and its key stay in one chip, because pressing
            them is one gesture.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="flex items-center gap-2">
          <Kbd>
            {state.platform === "mac" ? <Command className="size-3" /> : "Ctrl"} K
          </Kbd>
          <span className="text-caption text-[var(--color-text-muted)]">
            focuses the search field
          </span>
        </div>
      )}
    </Playground>
  )
}

function SeparatorDemo() {
  return (
    <Playground controls={[]} minHeight={140}>
      {() => (
        <div className="flex w-full max-w-xs flex-col gap-3">
          <span className="text-body-sm">Horizontal</span>
          <Separator />
          <div className="flex h-8 items-center gap-3">
            <span className="text-body-sm">Left</span>
            <Separator orientation="vertical" />
            <span className="text-body-sm">Right</span>
          </div>
        </div>
      )}
    </Playground>
  )
}

export { AlertDemo, StatCardDemo, CardDemo, AvatarDemo, KbdDemo, SeparatorDemo }
