"use client"

import * as React from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  HelpExpander,
  Input,
  Label,
  StatusCell,
  cn,
} from "minka-ds"
import { Info } from "lucide-react"
import { MotionLoop } from "@/components/docs/motion-loop"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * The dialog is shown OPEN and IN PLACE, composed from the real DS parts inside a box
 * that mirrors `DialogContent`'s own `dialog-box` styling.
 *
 * `DialogContent` itself is deliberately not used, and three failed attempts is why:
 *
 *   1. It renders `DialogOverlay` internally — `fixed inset-0` — which portals into the
 *      host and covers the whole stage. There is no prop to suppress it.
 *   2. Its wrapper is `fixed` plus an arbitrary translate, so it centres on the viewport
 *      rather than on the container even when portaled in.
 *   3. `flow` caps height against `100dvh`, which inside a 330px panel collapsed the box
 *      and clipped the header away entirely.
 *
 * `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` and `DialogPanel`
 * are all plain elements with no portal, so composing them directly gives a specimen
 * that is visually identical and actually sits where it is put. What is lost is the
 * focus trap and escape handling, neither of which a static specimen should have.
 */

/** Mirrors `data-slot="dialog-box"`, minus the flow and blur states a specimen cannot use. */
function DialogBox({
  panelled,
  children,
}: {
  panelled: boolean
  children: React.ReactNode
}) {
  return (
    // `Dialog` supplies the Radix context DialogTitle/Description require. It renders
    // no markup of its own — the portal and overlay live in DialogContent, which is
    // exactly what this specimen avoids.
    <Dialog open modal={false}>
    <div
      data-slot="dialog-box"
      className={cn(
        "relative w-full overflow-hidden [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-modal)]",
        // One step under the component's caps (52.5rem / 40rem). The real widths left
        // the specimen filling the stage edge to edge, which read as cramped rather
        // than accurate; a step down keeps the two-column shape legible with air
        // around it.
        panelled
          ? "max-w-[46rem] flex flex-col sm:flex-row"
          : "max-w-[34rem] grid gap-5 p-6",
      )}
    >
      {children}
    </div>
    </Dialog>
  )
}

/** The body column of a panelled dialog. Mirrors `data-slot="dialog-body"`. */
function DialogBody({ children }: { children: React.ReactNode }) {
  return (
    <div data-slot="dialog-body" className="relative flex flex-1 flex-col gap-5 p-6">
      {children}
    </div>
  )
}

const PANEL_GRID: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px), " +
    "linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px)",
  backgroundSize: "8px 8px",
}

// ── Anatomy ───────────────────────────────────────────────────────────────────

/**
 * Two genuine on/off decisions: whether there is a left panel, and whether the body
 * holds a form. Not three whole compositions to pick between.
 */
const CONTROLS: Control[] = [
  { type: "toggle", name: "panel", label: "Left panel", defaultValue: true },
  { type: "toggle", name: "form", label: "Form body", defaultValue: true },
]

function DialogDemo() {
  return (
    <Playground
      controls={CONTROLS}
      minHeight={420}
      details={(state) => (
        <Anatomy>
          <Part name="DialogHeader">
            Holds <Code>DialogTitle</Code> and <Code>DialogDescription</Code>. The title
            names the decision; the description names what it applies to.
          </Part>
          {state.panel ? (
            <Part name="DialogPanel" optional>
              A context surface for the thing being acted on. See the Left panel section
              below.
            </Part>
          ) : null}
          <Part name={state.form ? "Body" : "children"}>
            {state.form
              ? "The form. A real dialog with a long form also passes `flow`, which caps its height against the viewport so the body scrolls rather than growing past the screen."
              : "Whatever the dialog is about. One sentence, for a confirm."}
          </Part>
          <Part name="DialogFooter">
            The actions, primary last. Sinks to the bottom of a panelled dialog.
          </Part>
          <Part name="DialogTrigger" optional>
            Opens it. Not shown, because this specimen is already open.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        const panelled = Boolean(state.panel)

        const header = (
          <DialogHeader>
            <DialogTitle>
              {state.form ? "Change directory key status" : "Cancel this movement?"}
            </DialogTitle>
            <DialogDescription>
              {state.form ? "pay.bancolombia" : "The funds return to the source wallet."}
            </DialogDescription>
          </DialogHeader>
        )

        const body = state.form ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ds-dialog-reason">Reason</Label>
            <Input id="ds-dialog-reason" placeholder="Why is this changing?" />
          </div>
        ) : null

        const footer = (
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button>{state.form ? "Change status" : "Cancel movement"}</Button>
          </DialogFooter>
        )

        return (
          <DialogBox panelled={panelled}>
            {panelled ? (
              <>
                <DialogPanel
                  placement="side"
                  inset
                  className="bg-[var(--color-bg-base)]"
                  style={PANEL_GRID}
                >
                  <div className="flex flex-col items-center gap-2">
                    <StatusCell variant="success">Active</StatusCell>
                    <span className="text-caption text-center text-[var(--color-text-muted)]">
                      The record being acted on
                    </span>
                  </div>
                </DialogPanel>
                <DialogBody>
                  {header}
                  {body}
                  {footer}
                </DialogBody>
              </>
            ) : (
              <>
                {header}
                {body}
                {footer}
              </>
            )}
          </DialogBox>
        )
      }}
    </Playground>
  )
}

// ── Left panel ────────────────────────────────────────────────────────────────

/**
 * The panel's own anatomy. Everything it carries in the product is one of these three
 * things, so they are the chips.
 */
const PANEL_CONTROLS: Control[] = [
  {
    type: "select",
    name: "holds",
    label: "Holds",
    options: [
      { value: "object", label: "The object" },
      { value: "help", label: "Help expander" },
      { value: "alert", label: "Alert" },
    ],
    defaultValue: "object",
  },
  {
    type: "select",
    name: "placement",
    label: "Placement",
    options: [
      { value: "side", label: "Side" },
      { value: "top", label: "Top" },
    ],
    defaultValue: "side",
  },
]

function DialogPanelDemo() {
  return (
    <Playground
      controls={PANEL_CONTROLS}
      minHeight={420}
      details={(state) => (
        <Anatomy>
          <Part name="placement">
            {state.placement === "top"
              ? "A banner across the top. For context that reads as a header rather than a companion."
              : "A column down the left, 44% of the dialog. The default."}
          </Part>
          <Part name="inset" optional>
            Floats the panel inside the dialog with an 8px frame. Without it the panel
            bleeds to the dialog's edges.
          </Part>
          <Part name="children">
            {state.holds === "help"
              ? "A HelpExpander in inset mode, anchored bottom-right. This is the only place inset works."
              : state.holds === "alert"
              ? "An Alert, for a consequence that belongs with the object rather than beside the button."
              : "The record itself: an object card, a diagram, a preview of what is being created."}
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        const top = state.placement === "top"
        return (
          <Dialog open modal={false}>
          <div
            data-slot="dialog-box"
            className={cn(
              "relative flex w-full max-w-[46rem] flex-col overflow-hidden [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-modal)]",
              !top && "sm:flex-row",
            )}
          >
            <DialogPanel
              placement={top ? "top" : "side"}
              inset
              className="relative bg-[var(--color-bg-base)]"
              style={PANEL_GRID}
            >
              {state.holds === "help" && (
                <>
                  <div className="w-full [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] p-3">
                    <span className="text-body-sm text-[var(--color-text-default)]">
                      Preview card
                    </span>
                  </div>
                  <HelpExpander
                    mode="inset"
                    anchor="bottom-right"
                    title="What is a directory key?"
                  >
                    A handle that resolves to an account, so a payer does not need the
                    account number.
                  </HelpExpander>
                </>
              )}

              {state.holds === "alert" && (
                <Alert variant="warning">
                  <Info className="size-4" />
                  <AlertTitle>The key ends permanently</AlertTitle>
                  <AlertDescription className="text-[var(--color-text-muted)]">
                    This cannot be undone.
                  </AlertDescription>
                </Alert>
              )}

              {state.holds === "object" && (
                <div className="flex flex-col items-center gap-2">
                  <StatusCell variant="success">Active</StatusCell>
                  <span className="text-caption text-center text-[var(--color-text-muted)]">
                    pay.bancolombia
                  </span>
                </div>
              )}
            </DialogPanel>

            <DialogBody>
              <DialogHeader>
                <DialogTitle>Change directory key status</DialogTitle>
                <DialogDescription>pay.bancolombia</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button>Change status</Button>
              </DialogFooter>
            </DialogBody>
          </div>
          </Dialog>
        )
      }}
    </Playground>
  )
}

export { DialogDemo, DialogPanelDemo }


// ── Motion ────────────────────────────────────────────────────────────────────

/**
 * The dialog's own open and close, as two animated layers on their real offset timings.
 * Values verbatim from `dialog.tsx`.
 *
 * The transforms drop the `translate(-50%, -50%)` half of the component's keyframes:
 * that centring is what a `fixed` dialog needs to sit mid-viewport, and this block is
 * already centred by its parent. The movement being documented — the 8px, the 0.97
 * scale, the fade — is intact.
 */
const DIALOG_MOTION_KEYFRAMES = `
  @keyframes ds-dlg-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes ds-dlg-backdrop-out { from { opacity: 1 } to { opacity: 0 } }

  @keyframes ds-dlg-card-in {
    from { opacity: 0; transform: translateY(8px) scale(0.97) }
    to   { opacity: 1; transform: translateY(0) scale(1) }
  }
  @keyframes ds-dlg-card-out {
    from { opacity: 1; transform: translateY(0) scale(1) }
    to   { opacity: 0; transform: translateY(-10px) scale(0.97) }
  }
`

function DialogMotionLoop() {
  return (
    <MotionLoop
      keyframes={DIALOG_MOTION_KEYFRAMES}
      enter="ds-dlg-card-in .5s cubic-bezier(0.16, 1, 0.3, 1) .06s both"
      exit="ds-dlg-card-out .3s cubic-bezier(0.4, 0, 1, 1) both"
      backdrop={{
        enter: "ds-dlg-backdrop-in .45s cubic-bezier(0.16, 1, 0.3, 1) both",
        exit: "ds-dlg-backdrop-out .5s ease-out .1s both",
      }}
      hold={1100}
      gap={650}
      values={[
        { label: "Backdrop in", value: "450ms · cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Card in", value: "500ms · cubic-bezier(0.16, 1, 0.3, 1) · 60ms delay" },
        { label: "Card out", value: "300ms · cubic-bezier(0.4, 0, 1, 1)" },
        { label: "Backdrop out", value: "500ms · ease-out · 100ms delay" },
        { label: "Properties", value: "opacity, translateY, scale" },
        { label: "Enter from", value: "translateY(8px) scale(0.97)" },
        { label: "Exit to", value: "translateY(-10px) scale(0.97)" },
      ]}
    />
  )
}

export { DialogMotionLoop }
