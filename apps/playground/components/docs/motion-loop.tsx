"use client"

import * as React from "react"

/**
 * A motion loop: an abstract block running one of the DS animations on repeat, with the
 * values printed beneath it.
 *
 * Deliberately NOT the component. A dialog specimen shows what a dialog looks like; this
 * shows what the movement feels like, and those are different questions. Stripping the
 * chrome leaves only the thing being documented — the block rises 8px and settles, and
 * that is all there is to watch.
 *
 * The keyframes are duplicated from the component rather than imported, because the
 * component's are scoped to `[data-slot="dialog-content"][data-state]` and only fire on
 * a real Radix mount. Values are copied verbatim; the source of each is named in the
 * caller so a drift is findable.
 */

interface MotionLoopProps {
  /** CSS `animation` shorthand for the enter phase. */
  enter: string
  /** CSS `animation` shorthand for the exit phase. */
  exit: string
  /** How long the block rests visible between entering and exiting, in ms. */
  hold?: number
  /** How long the stage rests empty before entering again, in ms. */
  gap?: number
  /** `@keyframes` blocks the animations reference. */
  keyframes: string
  /**
   * The dim-and-blur layer behind the block, as `{ enter, exit }` animation shorthands.
   *
   * Runs on its own timing, offset from the block: on the way in the backdrop leads and
   * the card follows, so the surface arrives before the content. On the way out it
   * inverts — the card leaves first and the dim lingers, so it does not snap away from
   * under a departing card. That offset is the thing a single-layer loop cannot show.
   */
  backdrop?: { enter: string; exit: string }
  /** Rows shown beneath the stage: the values a reader would otherwise have to read off the source. */
  values: { label: string; value: string }[]
  /** Height of the stage. Taller for a loop that changes size. */
  height?: number
  children?: React.ReactNode
}

function MotionLoop({
  enter,
  exit,
  hold = 900,
  gap = 500,
  keyframes,
  backdrop,
  values,
  height = 180,
  children,
}: MotionLoopProps) {
  // Three phases rather than a single looping animation: a CSS loop would have to
  // encode the hold and gap as keyframe percentages, which means the durations stop
  // matching the component's real values and the whole point is lost.
  const [phase, setPhase] = React.useState<"in" | "held" | "out" | "empty">("in")

  // A block looping forever is precisely what prefers-reduced-motion exists to stop, so
  // the loop halts and the block rests visible. The values below still say what the
  // animation would be, which is the part a reader needs either way.
  const reduced = useReducedMotion()

  React.useEffect(() => {
    if (reduced) return
    const durations: Record<typeof phase, number> = {
      // The longest of the two layers, so neither is cut off mid-flight.
      in: Math.max(parseDuration(enter), backdrop ? parseDuration(backdrop.enter) : 0),
      held: hold,
      out: Math.max(parseDuration(exit), backdrop ? parseDuration(backdrop.exit) : 0),
      empty: gap,
    }
    const next: Record<typeof phase, typeof phase> = {
      in: "held",
      held: "out",
      out: "empty",
      empty: "in",
    }
    const id = setTimeout(() => setPhase(next[phase]), durations[phase])
    return () => clearTimeout(id)
  }, [phase, enter, exit, hold, gap, reduced, backdrop])

  const visible = reduced || phase === "in" || phase === "held"

  return (
    <div className="not-prose flex flex-col gap-3">
      <style>{keyframes}</style>

      <div
        className="ds-playground-stage relative flex items-center justify-center overflow-hidden border border-[var(--color-border-default)]"
        style={{ height }}
      >
        {/* The dim-and-blur layer, on its own timing. The stage's dot texture is what
            the blur acts on — enough to read the effect without putting fake content
            behind the block. */}
        {backdrop && (visible || phase === "out") && (
          <div
            aria-hidden
            key={phase === "out" ? "bd-out" : "bd-in"}
            className="absolute inset-0 bg-[var(--color-bg-backdrop-blur)] backdrop-blur-sm"
            style={{
              animation: reduced ? undefined : phase === "out" ? backdrop.exit : backdrop.enter,
            }}
          />
        )}

        {/* The block. No chrome, no content: the movement is the subject. */}
        {visible || phase === "out" ? (
          <div
            key={phase === "out" ? "out" : "in"}
            className="relative flex w-[62%] max-w-[22rem] items-center justify-center [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-modal)]"
            style={{
              height: "58%",
              animation: reduced ? undefined : phase === "out" ? exit : enter,
            }}
          >
            {children}
          </div>
        ) : null}
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {values.map(v => (
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

/** Watches the media query rather than reading it once, so a mid-session change lands. */
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

/** Pulls the first duration out of an `animation` shorthand, in ms. */
function parseDuration(shorthand: string): number {
  const m = shorthand.match(/([\d.]+)(ms|s)\b/)
  if (!m) return 400
  const n = parseFloat(m[1])
  return m[2] === "s" ? n * 1000 : n
}

export { MotionLoop }
