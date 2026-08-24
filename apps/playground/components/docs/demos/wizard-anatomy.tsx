"use client"

import * as React from "react"
import {
  Button,
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  Input,
  Label,
  StatusCell,
  cn,
} from "minka-ds"
import { ArrowLeft } from "lucide-react"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { MotionLoop } from "@/components/docs/motion-loop"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * The wizard shown OPEN and IN PLACE, mirroring its own shell.
 *
 * `Wizard` renders `Dialog` + `DialogContent` internally, and `DialogContent` renders a
 * `fixed inset-0` overlay that covers the stage — the same wall the Dialog specimen hit.
 * So this composes the shell from the same parts the component uses: the pinned glass
 * header, the body, the sticky footer with its N-of-N counter, and an optional
 * `DialogPanel`.
 *
 * What is real: the layout, the tokens, the header and footer treatments, the discard
 * strip. What is simulated: nothing visual — only the portal, the focus trap and the
 * step transition, none of which a static specimen should own. The step animation is
 * covered under Motion.
 */

const CONTROLS: Control[] = [
  { type: "toggle", name: "panel", label: "Left panel", defaultValue: true },
  { type: "toggle", name: "guard", label: "Discard guard", defaultValue: false },
]

const PANEL_GRID: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px), " +
    "linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px)",
  backgroundSize: "8px 8px",
}

/**
 * Three steps, matching the create-directory-key wizard. The specimen is navigable so a
 * reader can feel Back and Next and watch the body resize — the last step's action is
 * inert on purpose, since a specimen that closes itself leaves an empty stage.
 */
const STEPS = [
  { eyebrow: "Create directory key", title: "Key" },
  { eyebrow: "Create directory key", title: "Holder" },
  { eyebrow: "Create directory key", title: "Review" },
] as const

/** Mirrors the wizard's footer: counter left, Back and the primary action right. */
function WizardFooter({
  step,
  onStep,
}: {
  step: number
  onStep: (n: number) => void
}) {
  const isLast = step === STEPS.length - 1
  return (
    <div
      className={cn(
        // mt-auto so it sits at the bottom of the body column rather than directly
        // under the last field. pt-4 is the gap above it; nothing below, because the
        // column already carries the dialog's padding.
        "mt-auto flex shrink-0 items-center gap-2 bg-[var(--color-bg-overlay)]/80 pt-4 backdrop-blur-md",
      )}
    >
      <span className="text-caption text-[var(--color-text-muted)] sm:mr-auto">
        {step + 1} of {STEPS.length}
      </span>
      {step > 0 ? (
        <Button variant="ghost" onClick={() => onStep(step - 1)}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
      ) : (
        <Button variant="ghost">Cancel</Button>
      )}
      {/* The finish action is deliberately inert: a specimen that closes itself would
          leave the reader looking at an empty stage. */}
      <Button
        onClick={() => !isLast && onStep(step + 1)}
        aria-disabled={isLast}
        className={isLast ? "cursor-not-allowed opacity-50" : ""}
      >
        {isLast ? "Create key" : "Next"}
      </Button>
    </div>
  )
}

function WizardAnatomyDemo() {
  return (
    <Playground
      controls={CONTROLS}
      minHeight={470}
      details={(state) => (
        <Anatomy>
          <Part name="steps">
            Each step carries <Code>content</Code>, a <Code>title</Code>, an{" "}
            <Code>eyebrow</Code> and its own <Code>valid</Code>. The consumer owns{" "}
            <Code>step</Code> and <Code>onStepChange</Code>, so navigation state lives
            where the form data does.
          </Part>
          <Part name="Header">
            Pinned and glass: content scrolls under it rather than past it, so the step
            you are on stays named.
          </Part>
          {state.panel ? (
            <Part name="panel" optional>
              A <Code>DialogPanel</Code> holding a live preview of the record being
              built. See <a href="/docs/ds/overlays/dialog">Dialog</a>.
            </Part>
          ) : null}
          <Part name="Footer">
            The N-of-N counter, Back (or Cancel on the first step), and the primary
            action. It appears once the step&rsquo;s required fields are filled, then
            sticks.
          </Part>
          {state.guard ? (
            <Part name="dirty">
              With unsaved input, closing raises the discard guard as a strip below the
              dialog rather than a second modal, and blurs the form behind it. A dialog
              stacked on a dialog is where a reader loses track of what they were doing.
            </Part>
          ) : (
            <Part name="dirty" optional>
              Whether the form has unsaved input. Drives the discard guard on close.
            </Part>
          )}
          <Part name="override" optional>
            Replaces the form and footer entirely, for a provisioning or success phase.
            While set, the guard and close button are suppressed: the override owns its
            own actions.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <WizardSpecimen
          panel={Boolean(state.panel)}
          guard={Boolean(state.guard)}
        />
      )}
    </Playground>
  )
}

/** Split out so the step index can live in state without the render prop re-mounting. */
function WizardSpecimen({ panel, guard }: { panel: boolean; guard: boolean }) {
  const [step, setStep] = React.useState(1)
  const current = STEPS[step]

  return (
    <Dialog open modal={false}>
            <div className="flex w-full max-w-[46rem] flex-col gap-3">
              {/* The wizard's dialog box. `contentBlurred` is what the real component
                  applies while the guard is up. */}
              <div
                data-slot="dialog-box"
                className={cn(
                  "relative flex w-full flex-col overflow-hidden [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-modal)] sm:min-h-[26rem] sm:flex-row",
                  "transition-[filter,opacity] duration-200 ease-out",
                  guard && "pointer-events-none opacity-60 blur-[2px]",
                )}
              >
                {panel && (
                  <DialogPanel
                    placement="side"
                    inset
                    className="bg-[var(--color-bg-base)]"
                    style={PANEL_GRID}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <StatusCell variant="success">Active</StatusCell>
                      <span className="text-caption text-center text-[var(--color-text-muted)]">
                        A live preview of the record being built
                      </span>
                    </div>
                  </DialogPanel>
                )}

                <div className="flex min-h-0 min-w-0 flex-1 flex-col p-6">
                  <DialogHeader className="shrink-0 gap-1 bg-[var(--color-bg-overlay)]/80 pb-4 backdrop-blur-md">
                    <span className="text-overline text-[var(--color-text-muted)]">
                      {current.eyebrow}
                    </span>
                    <DialogTitle>{current.title}</DialogTitle>
                    <DialogDescription className="sr-only">
                      Step {step + 1} of {STEPS.length}
                    </DialogDescription>
                  </DialogHeader>

                  <div
                    className={cn(
                      "min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden",
                    )}
                  >
                    <div className="flex flex-col gap-4 p-1">
                      {/* Different fields per step, so stepping shows the body change
                          rather than the same form with a new title. */}
                      {step === 0 && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ds-wz-handle">Directory key</Label>
                            <Input id="ds-wz-handle" defaultValue="pay.bancolombia" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ds-wz-participant">Participant</Label>
                            <Input id="ds-wz-participant" defaultValue="Bancolombia S.A." />
                          </div>
                        </>
                      )}

                      {step === 1 && (
                        <>
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ds-wz-first">First name</Label>
                            <Input id="ds-wz-first" defaultValue="María" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <Label htmlFor="ds-wz-last">Last name</Label>
                            <Input id="ds-wz-last" defaultValue="Rodríguez" />
                          </div>
                        </>
                      )}

                      {step === 2 && (
                        <div className="flex flex-col gap-3">
                          {[
                            ["Directory key", "pay.bancolombia"],
                            ["Participant", "Bancolombia S.A."],
                            ["Holder", "María Rodríguez"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex items-baseline justify-between gap-4">
                              <span className="text-body-sm text-[var(--color-text-muted)]">{k}</span>
                              <span className="text-body-sm text-[var(--color-text-default)]">{v}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <WizardFooter step={step} onStep={setStep} />
                </div>
              </div>

              {/* The discard guard: a strip attached below the box, outside the blur, so
                  it stays sharp while the form behind it recedes. */}
              {guard && (
                <div className="flex w-full items-center justify-between gap-4 [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] px-5 py-3 shadow-[var(--shadow-modal)]">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-heading-3-serif text-[var(--color-text-default)]">
                      Discard this key?
                    </span>
                    <span className="text-body-sm text-[var(--color-text-muted)]">
                      What you have entered will be lost.
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="ghost">Keep editing</Button>
                    <Button variant="destructive">Discard</Button>
                  </div>
                </div>
              )}
            </div>
    </Dialog>
  )
}

export { WizardAnatomyDemo }

// ── Motion: enter and exit ────────────────────────────────────────────────────

/**
 * The wizard's own open/close, since it is built on `DialogContent` and inherits its
 * dissolve. Values copied verbatim from `dialog.tsx`:
 *
 *   card in    ds-dialog-card-in   .5s cubic-bezier(0.16, 1, 0.3, 1) 60ms
 *   card out   ds-dialog-card-out  .3s cubic-bezier(0.4, 0, 1, 1)
 *
 * The 8px rise on the way in and the 10px drift on the way out are asymmetric on
 * purpose: arriving settles, leaving gets out of the way.
 *
 * The transforms here drop the `translate(-50%, -50%)` half of the component's
 * keyframes. That centring is what a `fixed` dialog needs to sit mid-viewport; this
 * block is already centred by its flex parent, so keeping it would push the block off
 * stage. The movement being documented — the 8px, the 0.97 scale, the fade — is intact.
 */
const WIZARD_ENTER_EXIT_KEYFRAMES = `
  @keyframes ds-loop-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes ds-loop-backdrop-out { from { opacity: 1 } to { opacity: 0 } }

  @keyframes ds-loop-card-in {
    from { opacity: 0; transform: translateY(8px) scale(0.97) }
    to   { opacity: 1; transform: translateY(0) scale(1) }
  }
  @keyframes ds-loop-card-out {
    from { opacity: 1; transform: translateY(0) scale(1) }
    to   { opacity: 0; transform: translateY(-10px) scale(0.97) }
  }
`

function WizardEnterExitLoop() {
  return (
    <MotionLoop
      keyframes={WIZARD_ENTER_EXIT_KEYFRAMES}
      enter="ds-loop-card-in .5s cubic-bezier(0.16, 1, 0.3, 1) .06s both"
      exit="ds-loop-card-out .3s cubic-bezier(0.4, 0, 1, 1) both"
      backdrop={{
        enter: "ds-loop-backdrop-in .45s cubic-bezier(0.16, 1, 0.3, 1) both",
        exit: "ds-loop-backdrop-out .5s ease-out .1s both",
      }}
      hold={1100}
      gap={650}
      values={[
        { label: "Backdrop in", value: "450ms · cubic-bezier(0.16, 1, 0.3, 1)" },
        { label: "Card in", value: "500ms · cubic-bezier(0.16, 1, 0.3, 1) · 60ms delay" },
        { label: "Card out", value: "300ms · cubic-bezier(0.4, 0, 1, 1)" },
        { label: "Backdrop out", value: "500ms · ease-out · 100ms delay" },
        { label: "Card properties", value: "opacity, translateY, scale" },
        { label: "Enter from", value: "translateY(8px) scale(0.97)" },
        { label: "Exit to", value: "translateY(-10px) scale(0.97)" },
      ]}
    />
  )
}

export { WizardEnterExitLoop }
