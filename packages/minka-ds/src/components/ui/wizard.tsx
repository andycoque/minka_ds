"use client"

import * as React from "react"
import { ArrowLeft } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog"

/**
 * One step of a Wizard. `content` is the step body; `valid` gates advancing past
 * it (defaults to true). `title` / `eyebrow` drive the stepped header.
 */
export interface WizardStep {
  content: React.ReactNode
  valid?: boolean
  title?: React.ReactNode
  eyebrow?: React.ReactNode
}

export interface WizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The ordered steps. The body cross-fades + slides + height-animates between them. */
  steps: WizardStep[]
  /** Controlled active step index. The consumer owns navigation state. */
  step: number
  onStepChange: (index: number) => void
  /**
   * Lowest reachable step index (default 0). Steps below it are treated as already
   * done: Back can't go under it and the "N of N" counter renumbers from it. Used for
   * resume flows where earlier steps are already committed.
   */
  floor?: number
  /** Optional left context panel (e.g. a DialogPanel with a live preview). */
  panel?: React.ReactNode
  /** Whether the form has unsaved input; drives the discard guard on close. */
  dirty?: boolean
  /** Primary action on the last step. */
  onFinish: () => void
  finishLabel?: React.ReactNode
  finishDisabled?: boolean
  /**
   * Called when Next is pressed on a step whose `valid` is false. Lets the consumer
   * reveal the step's field errors (e.g. mark fields touched). The step still won't
   * advance. Receives the current step index.
   */
  onNextBlocked?: (step: number) => void
  /**
   * When provided, replaces the stepped form + footer entirely (still inside the same
   * dialog shell, so it inherits the enter/exit dissolve). Use for alternate phases
   * such as a provisioning / success / error view. While set, the discard guard and
   * close button are suppressed — the override owns its own actions.
   */
  override?: React.ReactNode
  /** Lock the dialog closed (e.g. mid-provisioning). Blocks Esc / outside / X. */
  locked?: boolean
  discardTitle?: string
  discardDescription?: string
  keepEditingLabel?: string
  discardLabel?: string
  className?: string
}

/**
 * A stepped wizard dialog. Owns the shell (built on Dialog / DialogContent, so it
 * inherits the enter/exit dissolve), the animated stepped body (measured-height
 * transition + directional slide), the footer (N-of-N counter, Back/Cancel and
 * Next/Finish), and the discard guard (blurs the box + floats a confirm strip when
 * closing a dirty form). Consumers own step content, per-step validity, and state.
 */
export function Wizard({
  open,
  onOpenChange,
  steps,
  step,
  onStepChange,
  floor = 0,
  panel,
  dirty = false,
  onFinish,
  finishLabel = "Finish",
  finishDisabled = false,
  onNextBlocked,
  override,
  locked = false,
  discardTitle = "Discard changes?",
  discardDescription = "Your progress won't be saved.",
  keepEditingLabel = "Keep editing",
  discardLabel = "Discard",
  className,
}: WizardProps) {
  const [confirmDiscard, setConfirmDiscard] = React.useState(false)
  // Slide direction for the entering step (forward = advancing, back = returning).
  const [dir, setDir] = React.useState<"fwd" | "back">("fwd")
  const prevStep = React.useRef(step)

  // Animated body height + overflow detection. A callback ref attaches a
  // ResizeObserver on mount (reliable inside the dialog's Radix portal) to the
  // SCROLL region; a second observes the CONTENT. When the content is shorter than
  // the available scroll height, we animate the body to the content height (the
  // smooth step-resize). When it's taller, we stop growing and let the scroll region
  // take over (overflow-y-auto) so the dialog caps and scrolls instead of clipping.
  const [bodyH, setBodyH] = React.useState<number | null>(null)
  const [overflowing, setOverflowing] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const contentElRef = React.useRef<HTMLDivElement | null>(null)
  const roRef = React.useRef<ResizeObserver | null>(null)

  const remeasure = React.useCallback(() => {
    const content = contentElRef.current
    const scroll = scrollRef.current
    if (!content || !scroll) return
    // Content's TRUE height (scrollHeight is unaffected by the parent's fixed height /
    // overflow-hidden clip, so a field revealed inside a still-collapsed body is
    // measured at its real size instead of the clipped one).
    const contentH = content.scrollHeight
    // Available height inside the capped box. Add back the current fixed body height
    // so the comparison is against the box's real capacity, not the momentarily-
    // shrunk body: availableH = scroll box minus everything except the body itself.
    const availableH = scroll.clientHeight
    const over = contentH > availableH + 1
    setOverflowing(over)
    // Not overflowing -> morph the body to the true content height (never clips a
    // freshly revealed field). Overflowing -> drop the fixed height so the scroll
    // region takes over.
    setBodyH(over ? null : contentH)
  }, [])

  // Re-measure now, on the next frame, and after reveal animations settle (~360ms),
  // so a toggled field that grows via a grid-rows transition is captured at its final
  // height and the body grows / switches to scroll instead of clipping it.
  const remeasureSoon = React.useCallback(() => {
    remeasure()
    requestAnimationFrame(remeasure)
    const t = setTimeout(remeasure, 360)
    return () => clearTimeout(t)
  }, [remeasure])

  const scrollCbRef = React.useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node
    roRef.current?.disconnect()
    if (!node) return
    const ro = new ResizeObserver(remeasure)
    ro.observe(node)
    roRef.current = ro
  }, [remeasure])

  const contentCbRef = React.useCallback((node: HTMLDivElement | null) => {
    contentElRef.current = node
    if (node) roRef.current?.observe(node)
    remeasure()
  }, [remeasure])

  // Any content change (step swap, a toggled reveal inside the step) should re-measure
  // through the settle window so grid-rows reveals don't get clipped by a stale height.
  React.useEffect(() => {
    if (!open) return
    return remeasureSoon()
  }, [open, step, steps[step]?.content, remeasureSoon])

  // Re-measure on window resize (the ResizeObserver catches content/box changes, but
  // a viewport change that only shifts the capped height needs an explicit listener).
  React.useEffect(() => {
    if (!open) return
    let raf = 0
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(remeasure) }
    window.addEventListener("resize", onResize)
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf) }
  }, [open, remeasure])

  // Reset transient UI when the dialog closes.
  React.useEffect(() => {
    if (!open) { setConfirmDiscard(false); setBodyH(null); setOverflowing(false); setDir("fwd") }
  }, [open])

  const total = steps.length - floor
  const display = step - floor + 1
  const isLast = step >= steps.length - 1
  const current = steps[step]
  const stepValid = current?.valid ?? true

  function go(next: number) {
    setDir(next > step ? "fwd" : "back")
    prevStep.current = next
    onStepChange(next)
  }
  function handleNext() {
    if (!stepValid) { onNextBlocked?.(step); return }
    if (isLast) onFinish()
    else go(step + 1)
  }
  function handleBack() {
    if (step > floor) go(step - 1)
  }

  function closeNow() {
    setConfirmDiscard(false)
    onOpenChange(false)
  }
  function requestClose() {
    if (dirty) { setConfirmDiscard(true); return }
    closeNow()
  }

  const showForm = !override

  return (
    <Dialog
      open={open}
      onOpenChange={o => {
        if (o) { onOpenChange(true); return }
        if (locked) return
        requestClose()
      }}
    >
      <style>{`
        @keyframes ds-wizard-step-fwd  { from { opacity: 0; transform: translateX(12px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes ds-wizard-step-back { from { opacity: 0; transform: translateX(-12px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes ds-wizard-footer-in { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        @media (prefers-reduced-motion: reduce) {
          .ds-wizard-step { animation: none !important }
          .ds-wizard-body { transition: none !important }
          .ds-wizard-footer { animation: none !important }
        }
      `}</style>
      <DialogContent
        flow
        className={cn("sm:max-w-3xl", className)}
        showCloseButton={showForm && !locked}
        contentBlurred={confirmDiscard}
        onEscapeKeyDown={e => {
          if (locked) { e.preventDefault(); return }
          if (confirmDiscard) { e.preventDefault(); setConfirmDiscard(false); return }
          if (showForm && dirty) { e.preventDefault(); requestClose() }
        }}
        onPointerDownOutside={e => {
          if (locked) { e.preventDefault(); return }
          if (confirmDiscard) { e.preventDefault(); setConfirmDiscard(false); return }
          if (showForm && dirty) { e.preventDefault(); requestClose() }
        }}
        attachment={
          confirmDiscard ? (
            <div className="flex w-full items-center justify-between gap-4 [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] px-5 py-3 shadow-[var(--shadow-modal)]">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-heading-3-serif text-[var(--color-text-default)]">{discardTitle}</h2>
                <span className="text-body-sm text-[var(--color-text-muted)]">{discardDescription}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setConfirmDiscard(false)}>{keepEditingLabel}</Button>
                <Button variant="destructive" onClick={closeNow}>{discardLabel}</Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {panel}

        {override ? (
          override
        ) : (
          // Form column: pinned glass header, a scroll region (scrolls only when the
          // content is taller than the capped dialog), and a footer that appears once
          // the step's required fields are filled, then sticks (glass) at the bottom.
          // No negative-margin bleed (that caused horizontal overflow) — each section
          // owns its padding; min-w-0 keeps the column from forcing width.
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {(current?.eyebrow || current?.title) && (
              // Pinned header: content scrolls under it, fading behind the glass.
              <DialogHeader className="shrink-0 gap-1 bg-[var(--color-bg-overlay)]/80 pb-4 backdrop-blur-md">
                {current?.eyebrow && (
                  <span className="text-overline text-[var(--color-text-muted)]">{current.eyebrow}</span>
                )}
                {current?.title && <DialogTitle>{current.title}</DialogTitle>}
              </DialogHeader>
            )}

            {/* Scroll region. Not overflowing -> the body animates its height to the
                content (smooth step resize). Overflowing -> fixed by flex-1 and it
                scrolls. overflow-x-hidden prevents any horizontal scrollbar; the p-1
                (no negative margin) gives focus rings room without spilling width. */}
            <div ref={scrollCbRef} className="ds-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
              <div
                className={cn("ds-wizard-body", !overflowing && "overflow-hidden transition-[height] duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]")}
                style={{ height: !overflowing && bodyH != null ? bodyH : undefined }}
              >
                <div ref={contentCbRef} className="p-1 py-3">
                  <div
                    key={step}
                    className="ds-wizard-step"
                    style={{ animation: `${dir === "back" ? "ds-wizard-step-back" : "ds-wizard-step-fwd"} .3s cubic-bezier(0.16,1,0.3,1) both` }}
                  >
                    {current?.content}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: hidden until the step's required fields are valid, then fades in
                and sticks (glass) at the bottom of the column. Escape while hidden is
                still available via the header X, backdrop click, and the discard strip. */}
            {stepValid && (
              <DialogFooter className="ds-wizard-footer shrink-0 bg-[var(--color-bg-overlay)]/80 pt-4 backdrop-blur-md sm:items-center sm:justify-start" style={{ animation: "ds-wizard-footer-in .25s cubic-bezier(0.16,1,0.3,1) both" }}>
                {total > 1 && (
                  <span className="text-caption text-[var(--color-text-muted)] sm:mr-auto">
                    {display} of {total}
                  </span>
                )}
                {step > floor ? (
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="size-4" />Back
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={requestClose}>Cancel</Button>
                )}
                {isLast ? (
                  <Button
                    onClick={onFinish}
                    aria-disabled={finishDisabled}
                    className={finishDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    {finishLabel}
                  </Button>
                ) : (
                  <Button onClick={handleNext}>Next</Button>
                )}
              </DialogFooter>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
