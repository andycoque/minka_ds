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

/** Anatomy: which parts are present, not which colour. */
const ALERT_PARTS: Control[] = [
  { type: "toggle", name: "icon", label: "Icon", defaultValue: true },
  { type: "toggle", name: "description", label: "Description", defaultValue: true },
  { type: "toggle", name: "action", label: "Action", defaultValue: false },
]

function AlertDemo() {
  return (
    <Playground
      controls={ALERT_PARTS}
      minHeight={170}
      details={(state) => (
        <Anatomy>
          {state.icon ? (
            <Part name="Icon" optional>
              A <Code>lucide-react</Code> icon as the FIRST child. The grid collapses
              its column when absent, so omitting it costs no indent.
            </Part>
          ) : null}
          <Part name="AlertTitle">
            One line naming what happened. Not a category like &ldquo;Warning&rdquo;.
          </Part>
          {state.description ? (
            <Part name="AlertDescription" optional>
              What follows from it. Omit it when the title already says everything.
            </Part>
          ) : null}
          {state.action ? (
            <Part name="Action" optional>
              A <Code>Button</Code> as a child, right-aligned. One action, and only when
              the alert is about something the reader can fix here.
            </Part>
          ) : null}
        </Anatomy>
      )}
    >
      {(state) => (
        <Alert variant="warning" className="w-full max-w-lg">
          {state.icon ? <TriangleAlert className="size-4" /> : null}
          <div className="flex flex-1 flex-col">
            <AlertTitle>This key expires in 9 days</AlertTitle>
            {state.description ? (
              <AlertDescription>
                It stops working on 24 Aug 2026. Rotate before then to avoid an outage.
              </AlertDescription>
            ) : null}
          </div>
          {state.action ? (
            <Button size="sm" variant="outline" className="shrink-0 self-center">
              Rotate key
            </Button>
          ) : null}
        </Alert>
      )}
    </Playground>
  )
}

/** Variants: the same alert in each colour, with the copy that fits it. */
function AlertVariantsDemo() {
  return (
    <Playground
      controls={ALERT_VARIANTS}
      minHeight={150}
      details={(state) => (
        <Anatomy>
          <Part name="variant">
            {String(state.variant) === "default"
              ? "No semantic colour. For something worth saying that is neither good nor bad."
              : String(state.variant) === "info"
              ? "Neutral information: where something is managed, why a field is fixed."
              : String(state.variant) === "success"
              ? "Something completed. Rare as an alert: a toast usually carries this."
              : String(state.variant) === "warning"
              ? "Something needs attention before it becomes a problem."
              : "Something failed and the reader has to deal with it."}
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
  // A real toggle rather than prose: hover and press cannot be described, only felt.
  { type: "toggle", name: "clickable", label: "Clickable", defaultValue: false },
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
                {state.clickable
                  ? "Renders the card as a button: hover it, press it, and tab to it. A card with no onClick is inert and shows none of those."
                  : "Makes the card a button, for filtering a list to this figure. Turn on Clickable to feel the states."}
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
              onClick={state.clickable ? () => {} : undefined}
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
          <StatCard
            label="Transactions today"
            value={1284}
            percent={-2.1}
            onClick={state.clickable ? () => {} : undefined}
            className="w-64"
          />
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

/**
 * One avatar with its real props, rather than three specimens of the same thing.
 *
 * `size` is the axis that actually varies in the product: `lg` on the settings profile,
 * `sm` in a table row. `background` and `color` exist on the component but are never
 * overridden anywhere, so they are documented in Props rather than given a chip.
 */
const AVATAR_CONTROLS: Control[] = [
  {
    type: "select",
    name: "size",
    label: "Size",
    options: [
      { value: "sm", label: "sm · 28px" },
      { value: "md", label: "md · 36px" },
      { value: "lg", label: "lg · 48px" },
    ],
    defaultValue: "md",
  },
  {
    type: "select",
    name: "tone",
    label: "Colour",
    options: [
      { value: "default", label: "Default" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "rose", label: "Rose" },
    ],
    defaultValue: "default",
  },
]

/**
 * `background` and `color` take any CSS colour. Passing a brand PAIR keeps the ink
 * legible on the fill without a second decision — see the Pairs section on the tokens
 * page.
 */
const TONE: Record<string, { background?: string; color?: string }> = {
  default: {},
  beige: { background: "var(--color-pair-beige-bronze-light)", color: "var(--color-pair-beige-bronze-dark)" },
  blue:  { background: "var(--color-pair-blue-navy-light)",    color: "var(--color-pair-blue-navy-dark)" },
  rose:  { background: "var(--color-pair-rose-coral-light)",   color: "var(--color-pair-rose-coral-dark)" },
}

function AvatarDemo() {
  return (
    <Playground
      controls={AVATAR_CONTROLS}
      minHeight={150}
      details={(state) => (
        <Anatomy>
          <Part name="name" optional>
            The full name. Used for alt text, and initials are derived from it: two
            letters, so &ldquo;Banco Davivienda&rdquo; becomes BD.
          </Part>
          <Part name="initials" optional>
            Overrides the derived value, for a single letter or a code. With neither
            name nor initials it renders <Code>?</Code> rather than collapsing.
          </Part>
          <Part name="src" optional>
            An image. Falls back to initials when absent or broken, so a missing avatar
            is never an empty circle.
          </Part>
          <Part name="background / color" optional>
            {state.tone === "default"
              ? "Any CSS colour. Defaults to a brand colour with inverse ink."
              : "Pass a brand PAIR — a light fill and its own dark ink — so the initials stay legible without a second decision."}
          </Part>
          <Part name="size">
            {state.size === "lg"
              ? "48px. A profile header."
              : state.size === "sm"
              ? "28px. A table row or a compact list."
              : "36px. The default."}
          </Part>

        </Anatomy>
      )}
    >
      {(state) => (
        <div className="flex items-center gap-4">
          <Avatar
            size={String(state.size) as "sm" | "md" | "lg"}
            name="Banco Davivienda"
            {...TONE[String(state.tone)]}
          />
          <Avatar
            size={String(state.size) as "sm" | "md" | "lg"}
            name="Ximena Rojas"
            {...TONE[String(state.tone)]}
          />
          <span className="text-caption text-[var(--color-text-muted)]">
            Initials derive from the name: two letters.
          </span>
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

export { AlertDemo, AlertVariantsDemo, StatCardDemo, CardDemo, AvatarDemo, KbdDemo, SeparatorDemo }
