"use client"

import * as React from "react"

/**
 * An anchored-overlay loop: a panel opening and closing against a visible trigger.
 *
 * `MotionLoop` shows a block appearing in isolation, which is right for a dialog — a
 * dialog arrives over the whole page and has nothing to be anchored to. It is wrong
 * here. The animation slides 8px *from the trigger side*, so with no trigger on screen
 * there is nothing for the reader to read the movement against, and the direction that
 * makes it feel attached is exactly what gets lost.
 *
 * So the trigger stays put and the panel moves relative to it. Both are empty shapes:
 * a label on the trigger or bars in the panel invite reading, and there is nothing here
 * to read — the subject is the 8px and where it comes from.
 */

const KEYFRAMES = `
  @keyframes ds-anchored-top    { from { opacity: 0; transform: scale(.95) translateY(-8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
  @keyframes ds-anchored-bottom { from { opacity: 0; transform: scale(.95) translateY(8px) }  to { opacity: 1; transform: scale(1) translateY(0) } }
  @keyframes ds-anchored-left   { from { opacity: 0; transform: scale(.95) translateX(-8px) } to { opacity: 1; transform: scale(1) translateX(0) } }
  @keyframes ds-anchored-right  { from { opacity: 0; transform: scale(.95) translateX(8px) }  to { opacity: 1; transform: scale(1) translateX(0) } }

  /* The exit does NOT slide. The component pairs zoom-out-95 with fade-out-0 and no
     slide-out, so the panel scales down where it stands instead of retreating toward
     the trigger. Mirroring the enter here would be a nicer-looking lie. */
  @keyframes ds-anchored-out    { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(.95) } }
`

type Side = "top" | "bottom" | "left" | "right"

/** Where the panel sits relative to the trigger, and which way it slides in from. */
const PLACEMENT: Record<Side, { panel: string; origin: string }> = {
  // The panel slides FROM the trigger, so a panel below animates from the top edge.
  bottom: { panel: "top-full left-0 mt-2", origin: "top left" },
  top:    { panel: "bottom-full left-0 mb-2", origin: "bottom left" },
  right:  { panel: "left-full top-0 ml-2", origin: "top left" },
  left:   { panel: "right-full top-0 mr-2", origin: "top right" },
}

/** The keyframe a side animates with: the reverse of where the panel sits. */
const SLIDE_FROM: Record<Side, string> = {
  bottom: "ds-anchored-top",
  top: "ds-anchored-bottom",
  right: "ds-anchored-left",
  left: "ds-anchored-right",
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

const ORDER: Side[] = ["bottom", "top", "right", "left"]

function AnchoredLoop() {
  const [side, setSide] = React.useState<Side>("bottom")
  // Four phases, not an open boolean: an exit animation needs the panel to stay mounted
  // while it plays, and a boolean has nowhere to put "leaving".
  const [phase, setPhase] = React.useState<"in" | "held" | "out" | "empty">("in")
  const reduced = useReducedMotion()

  React.useEffect(() => {
    if (reduced) return
    const durations = { in: 150, held: 1250, out: 150, empty: 450 } as const
    const id = setTimeout(() => {
      setPhase(p => {
        if (p === "in") return "held"
        if (p === "held") return "out"
        if (p === "out") return "empty"
        // Advance the side only once the panel is gone, so it never jumps mid-flight.
        setSide(s => ORDER[(ORDER.indexOf(s) + 1) % ORDER.length])
        return "in"
      })
    }, durations[phase])
    return () => clearTimeout(id)
  }, [phase, reduced])

  const place = PLACEMENT[side]
  const mounted = reduced || phase !== "empty"

  return (
    <div className="not-prose flex flex-col gap-3">
      <style>{KEYFRAMES}</style>

      {/* Fixed height so the stage never resizes as the panel moves around. */}
      <div
        className="ds-playground-stage flex items-center justify-center overflow-hidden border border-[var(--color-border-default)]"
        style={{ height: 260 }}
      >
        <div className="relative">
          {/* The trigger. Stays put: it is the thing the movement is measured against. */}
          <span className="block h-8 w-24 [border-radius:var(--radius-button)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] shadow-xs" />

          {mounted && (
            <div
              key={`${side}-${phase === "out" ? "out" : "in"}`}
              className={`absolute ${place.panel} h-24 w-44 [border-radius:var(--radius-popover)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-popover)]`}
              style={{
                transformOrigin: place.origin,
                animation: reduced
                  ? undefined
                  : phase === "out"
                    ? "ds-anchored-out .15s ease both"
                    : `${SLIDE_FROM[side]} .15s ease both`,
              }}
            />
          )}
        </div>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        {[
          { label: "Side", value: side },
          { label: "Duration", value: "150ms in and out" },
          { label: "Easing", value: "ease — tw-animate-css default" },
          { label: "Properties", value: "opacity, scale, translate" },
          { label: "Enter from", value: "scale(0.95), 8px from the trigger" },
          { label: "Exit to", value: "scale(0.95) in place, no slide" },
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

export { AnchoredLoop }
