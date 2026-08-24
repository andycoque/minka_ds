"use client"

import * as React from "react"

/**
 * A resize loop: an abstract wizard growing and shrinking on the component's real step
 * timings, with a left panel and a labelled footer.
 *
 * Separate from `MotionLoop` because this is not an enter/exit. Nothing appears or
 * disappears — the same box changes height while its contents cross-fade and slide. The
 * two need different structure, and forcing one component to do both would mean a props
 * object that reads like a union of two unrelated things.
 *
 * Two parts are here to make the resize legible rather than for their own sake. The
 * FOOTER holds position while the body grows above it, which is what keeps the primary
 * action in the same place from step to step. The PANEL does not resize at all, so the
 * body grows beside a fixed column — which is why a wizard's panel holds a preview and
 * not the form.
 *
 * Nothing is a real `Button` or `DialogPanel`: this is a motion diagram, and a real
 * control would invite a click that does nothing.
 */

const KEYFRAMES = `
  @keyframes ds-resize-step-fwd  { from { opacity: 0; transform: translateX(12px) }  to { opacity: 1; transform: translateX(0) } }
  @keyframes ds-resize-step-back { from { opacity: 0; transform: translateX(-12px) } to { opacity: 1; transform: translateX(0) } }
`

/** Field counts per step, so the box has genuinely different heights to move between. */
const STEPS = [2, 4, 1]

/** One field's worth of skeleton: a short label bar over a full-width input bar. */
function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="block h-2 w-16 rounded-full bg-[var(--color-border-default)]" />
      <span className="block h-7 w-full [border-radius:var(--radius-input)] border border-[var(--color-border-default)] bg-[var(--color-bg-base)]" />
    </div>
  )
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

function ResizeLoop() {
  const [step, setStep] = React.useState(0)
  const [dir, setDir] = React.useState<"fwd" | "back">("fwd")
  const reduced = useReducedMotion()

  // The body measures its content and the wrapper animates to that height — the same
  // mechanism the component uses, so the movement is the component's rather than a
  // hardcoded pair of heights.
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState<number>()

  React.useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const measure = () => setHeight(el.getBoundingClientRect().height)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [step])

  // Walks 1 → 2 → 3 → 2 → 1, so both directions of the slide are shown. A wrap from the
  // last step back to the first would slide forward out of a shrink, which reads as a
  // glitch rather than a return.
  React.useEffect(() => {
    if (reduced) return
    const id = setTimeout(() => {
      setStep(s => {
        if (dir === "fwd") {
          if (s === STEPS.length - 1) { setDir("back"); return s - 1 }
          return s + 1
        }
        if (s === 0) { setDir("fwd"); return s + 1 }
        return s - 1
      })
    }, 1500)
    return () => clearTimeout(id)
  }, [step, dir, reduced])

  return (
    <div className="not-prose flex flex-col gap-3">
      <style>{KEYFRAMES}</style>

      {/* Fixed height, sized for the tallest step. The box resizes inside it; the stage
          itself must not, or the whole page shifts on every loop. */}
      <div
        className="ds-playground-stage relative flex items-center justify-center overflow-hidden border border-[var(--color-border-default)]"
        style={{ height: 340 }}
      >
        {/* The backdrop, static rather than animated. The component only animates it on
            open and close; during a resize the dialog is already open, so the dim just
            sits there. Included because the box's own shadow and border read differently
            over a dimmed ground than over the bare stage. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--color-bg-backdrop-blur)] backdrop-blur-sm"
        />
        <div className="relative flex w-[78%] max-w-[30rem] overflow-hidden [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-modal)]">
          {/* The left panel. It does not resize: the body grows beside it, which is why
              a wizard's panel holds a preview rather than the form. */}
          <div
            className="hidden w-[38%] shrink-0 items-center justify-center border-r border-[var(--color-border-default)] bg-[var(--color-bg-base)] p-4 sm:flex"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px), " +
                "linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px)",
              backgroundSize: "8px 8px",
            }}
          >
            <span className="block h-16 w-full [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)]" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-4 p-5">
            {/* The body: height animated, contents keyed so each step remounts and slides. */}
            <div
              className="overflow-hidden transition-[height] duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
              style={{ height }}
            >
              <div ref={bodyRef}>
                <div
                  key={step}
                  className="flex flex-col gap-3"
                  style={{
                    animation: reduced
                      ? undefined
                      : `ds-resize-step-${dir} .3s cubic-bezier(0.16,1,0.3,1) both`,
                  }}
                >
                  {Array.from({ length: STEPS[step] }, (_, i) => (
                    <FieldSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Holds position while the body grows above it. */}
            <div className="flex shrink-0 items-center gap-2">
              <span className="mr-auto text-caption text-[var(--color-text-muted)]">
                {step + 1} of {STEPS.length}
              </span>
              <span className="flex h-7 items-center justify-center px-3 text-caption text-[var(--color-text-muted)]">
                Back
              </span>
              <span className="flex h-7 items-center justify-center [border-radius:var(--radius-button)] bg-[var(--color-action-primary-default)] px-3 text-caption text-[var(--color-action-primary-foreground)]">
                Continue
              </span>
            </div>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {[
          { label: "Height", value: "380ms · cubic-bezier(0.4, 0, 0.2, 1)" },
          { label: "Step in", value: "300ms · cubic-bezier(0.16, 1, 0.3, 1)" },
          { label: "Slide", value: "translateX(12px) forward, -12px back" },
          { label: "Properties", value: "height, opacity, translateX" },
        ].map(v => (
          <React.Fragment key={v.label}>
            <dt className="text-caption text-[var(--color-text-muted)]">{v.label}</dt>
            <dd
              className="text-caption text-[var(--color-text-default)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {v.value}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  )
}

export { ResizeLoop }
