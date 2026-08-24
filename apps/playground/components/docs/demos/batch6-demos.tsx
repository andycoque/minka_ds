"use client"

import * as React from "react"
import {
  AnchorCard,
  Button,
  DetailHeader,
  MetaField,
  RadioCard,
  RadioGroup,
  RecordCard,
  StatusChangeDialog,
  toast,
  type StatusOption,
} from "minka-ds"
import { KeyRound, QrCode, Landmark, User as UserIcon, FileSignature, Loader } from "lucide-react"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Batch 6 demos: the detail-page and status-change family built this cycle. Every
 * specimen is a real composition from studio.
 */

// ── DetailHeader ──────────────────────────────────────────────────────────────

const HEADER_CONTROLS: Control[] = [
  {
    type: "select",
    name: "size",
    label: "Size",
    options: [
      { value: "page", label: "Page" },
      { value: "section", label: "Section" },
    ],
    defaultValue: "page",
  },
  { type: "toggle", name: "status", label: "With status", defaultValue: true },
  { type: "toggle", name: "meta", label: "With meta", defaultValue: true },
  { type: "toggle", name: "actions", label: "With actions", defaultValue: true },
]

function DetailHeaderDemo() {
  return (
    <Playground
      controls={HEADER_CONTROLS}
      minHeight={230}
      details={(state) => (
        <Anatomy>
          <Part name="title">
            The record's own name. The one thing that identifies this page.
          </Part>
          {state.status ? (
            <Part name="status" optional>
              A <Code>{"{ variant, label }"}</Code> pair. The header renders it at the
              larger size itself, so <Code>size=&quot;lg&quot;</Code> is never a
              consumer's decision.
            </Part>
          ) : null}
          {state.actions ? (
            <Part name="actions" optional>
              What can be done to this record. One action where possible.
            </Part>
          ) : null}
          {state.meta ? (
            <Part name="meta" optional>
              <Code>MetaField</Code>s: the facts worth seeing before scrolling.
            </Part>
          ) : null}
          <Part name="size">
            {state.size === "section"
              ? "heading-4, for a header nested inside a SectionCard."
              : "The page's own identity header."}
          </Part>
          <Part name="banner" optional>
            An alert above the title, for a state that changes what the page means.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="w-full max-w-lg">
          <DetailHeader
            size={String(state.size) as "page" | "section"}
            title="pay.bancolombia"
            status={state.status ? { variant: "success", label: "Active" } : undefined}
            actions={
              state.actions ? (
                <Button variant="outline" size="sm">
                  Change status
                </Button>
              ) : undefined
            }
            meta={
              state.meta ? (
                <>
                  <MetaField label="Participant">Bancolombia S.A.</MetaField>
                  <MetaField label="Currency">COP</MetaField>
                  <MetaField label="Created">2026-04-12</MetaField>
                </>
              ) : undefined
            }
          />
        </div>
      )}
    </Playground>
  )
}

// ── AnchorCard / RecordCard ───────────────────────────────────────────────────

const CARD_CONTROLS: Control[] = [
  {
    type: "select",
    name: "kind",
    label: "Card",
    options: [
      { value: "anchor", label: "AnchorCard" },
      { value: "record", label: "RecordCard" },
    ],
    defaultValue: "anchor",
  },
  { type: "toggle", name: "full", label: "All regions", defaultValue: false },
]

function ObjectCardDemo() {
  return (
    <Playground
      controls={CARD_CONTROLS}
      minHeight={250}
      details={(state) =>
        state.kind === "anchor" ? (
          <Anatomy>
            <Part name="icon / title">
              The object's type glyph and its own name.
            </Part>
            <Part name="participant / destination">
              Who it belongs to and where it routes.
            </Part>
            <Part name="trailing" optional>
              A top-right marker, e.g. single-use vs reusable.
            </Part>
            <Part name="footerStart / footerEnd" optional>
              A value and an expiry, above a hairline. Omitted entirely when a flow has
              no such concept.
            </Part>
            <Part name="filled" optional>
              False draws an empty outline, for a creation flow before anything is
              entered.
            </Part>
          </Anatomy>
        ) : (
          <Anatomy>
            <Part name="icon / title / subtitle">
              The identity row: a glyph, a name, and a second line.
            </Part>
            <Part name="eyebrow" optional>
              A centred context label above the card, e.g. the participant.
            </Part>
            <Part name="children" optional>
              Content nested inside the card, e.g. a public-key block.
            </Part>
            <Part name="footer" optional>
              Chips below the card, e.g. assigned roles.
            </Part>
          </Anatomy>
        )
      }
    >
      {(state) => {
        const full = Boolean(state.full)

        if (state.kind === "record") {
          return (
            <RecordCard
              icon={full ? <FileSignature className="size-4" /> : <UserIcon className="size-4" />}
              title={full ? "ops-bridge-01" : "Sofia Ossa"}
              subtitle={full ? "Bridge | Bancolombia S.A." : "sso@minka.io"}
              eyebrow={full ? undefined : "at Banco Minka"}
            />
          )
        }

        return (
          <AnchorCard
            icon={full ? <QrCode className="size-5" /> : <KeyRound className="size-5" />}
            title={full ? "QR code" : "pay.bancolombia"}
            trailing={full ? <Loader className="size-4" /> : undefined}
            participant="Bancolombia S.A."
            destinationIcon={<Landmark className="size-3.5" />}
            destination="0345 6678 9012"
            footerStart={full ? "$ 120.000" : undefined}
            footerEnd={full ? "Never expires" : undefined}
          />
        )
      }}
    </Playground>
  )
}

// ── RadioCard ─────────────────────────────────────────────────────────────────

const RADIO_CONTROLS: Control[] = [
  { type: "toggle", name: "descriptions", label: "With descriptions", defaultValue: true },
  { type: "toggle", name: "disabled", label: "One unreachable", defaultValue: false },
]

function RadioCardDemo() {
  const [value, setValue] = React.useState("inactive")

  return (
    <Playground
      controls={RADIO_CONTROLS}
      minHeight={240}
      details={(state) => (
        <Anatomy>
          <Part name="label">
            A node, not a string: the caller owns its typography, so a status choice can
            pass a coloured dot beside the name.
          </Part>
          {state.descriptions ? (
            <Part name="description" optional>
              One line on what choosing this does. A step below the label, not two.
            </Part>
          ) : null}
          <Part name="expanded" optional>
            Content revealed inside the card when selected, e.g. a field the choice
            requires. Animated open and closed.
          </Part>
          {state.disabled ? (
            <Part name="disabled" optional>
              Stays visible with its reason, rather than vanishing from the list.
            </Part>
          ) : null}
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="w-full max-w-sm">
          <RadioGroup value={value} onValueChange={setValue}>
            <RadioCard
              value="inactive"
              label={<span className="text-body text-[var(--color-text-default)]">Inactive</span>}
              description={state.descriptions ? "Stops resolving." : undefined}
            />
            <RadioCard
              value="blocked"
              label={<span className="text-body text-[var(--color-text-default)]">Blocked</span>}
              description={state.descriptions ? "Stops resolving, and stays blocked." : undefined}
            />
            <RadioCard
              value="expired"
              disabled={Boolean(state.disabled)}
              label={<span className="text-body text-[var(--color-text-default)]">Expired</span>}
              description={
                state.disabled
                  ? "Set when the validity window elapses, not by hand."
                  : state.descriptions
                  ? "Ends when the window elapses."
                  : undefined
              }
            />
          </RadioGroup>
        </div>
      )}
    </Playground>
  )
}

// ── StatusChangeDialog ────────────────────────────────────────────────────────

const OPTIONS: StatusOption[] = [
  {
    value: "active", label: "Active", variant: "success",
    description: "Resolves to its destination.",
    outcome: "Payments reach the destination again.",
    outcomeDetail: "Payments already in flight are not affected.",
  },
  {
    value: "inactive", label: "Inactive", variant: "neutral",
    description: "Stops resolving.",
    outcome: "New payments to this key fail.",
    outcomeDetail: "Reversible at any time.",
  },
  {
    value: "blocked", label: "Blocked", variant: "blocked",
    description: "Stops resolving, and stays blocked.",
    outcome: "The key stops resolving and cannot be used.",
    outcomeDetail: "Until someone unblocks it.",
  },
  {
    value: "cancelled", label: "Cancelled", variant: "error",
    description: "Ends the key permanently.",
    outcome: "The key ends and the handle is never reissued.",
    destructive: true,
  },
  { value: "expired", label: "Expired", variant: "warning", reachable: false },
]

function StatusChangeDialogDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <Playground
      controls={[]}
      minHeight={190}
      details={() => (
        <Anatomy>
          <Part name="options">
            The states the policy defines. Each carries a description for its row and an
            outcome for the panel.
          </Part>
          <Part name="current">
            Filtered out of the list: there is no transition to where you already are.
          </Part>
          <Part name="detail" optional>
            The record's own card, so the object stays in view through the action.
          </Part>
          <Part name="destructive" optional>
            Adds a typed confirmation inside the selected card, and forces the dot red.
          </Part>
          <Part name="reachable" optional>
            False drops the state from the list, for one only the system can set.
          </Part>
        </Anatomy>
      )}
    >
      {() => (
        <>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Change status
          </Button>
          <StatusChangeDialog
            open={open}
            onOpenChange={setOpen}
            recordLabel="directory key"
            recordName="pay.bancolombia"
            current="active"
            options={OPTIONS}
            onConfirm={(next) => {
              setOpen(false)
              toast.success(`Would set status to ${next}`)
            }}
            detail={
              <AnchorCard
                icon={<KeyRound className="size-5" />}
                title="pay.bancolombia"
                participant="Bancolombia S.A."
                destinationIcon={<Landmark className="size-3.5" />}
                destination="0345 6678 9012"
              />
            }
            detailClassName="bg-[var(--color-bg-base)]"
            detailStyle={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px), " +
                "linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          />
        </>
      )}
    </Playground>
  )
}

export { DetailHeaderDemo, ObjectCardDemo, RadioCardDemo, StatusChangeDialogDemo }
