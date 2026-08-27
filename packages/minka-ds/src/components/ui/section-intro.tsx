"use client"

import * as React from "react"
import { Lightbulb } from "lucide-react"
import { Button } from "./button"
import { cn } from "../../lib/utils"

/**
 * SectionIntro — a first-visit takeover that hands the reader off to the section's guide.
 *
 * Shown instead of a section's content the first time someone arrives. Three cards
 * explain the model, then the lightbulb flies to where the `PageHelp` launcher sits and
 * becomes it, so the reader learns WHERE the explanation lives rather than being told a
 * button exists.
 *
 * Worth using only where a first-time reader would MISREAD the section, not merely find
 * it unfamiliar: money appearing from nowhere, a credential that is not a person, two
 * things both called keys. A list that reads as a list does not need one — a blocking
 * takeover before every table is a toll, not an onboarding.
 *
 * The cards should explain the mental model, not tour the tabs. Tabs are discoverable on
 * their own; the model is not.
 *
 * ── The choreography, and why each beat exists ────────────────────────────────
 * Entry staggers title -> bulb+summary -> cards -> button, on delays rather than chained
 * timers, so a slow render cannot desync it.
 *
 * On continue:
 *   0 -> FLIGHT_MS      the bulb travels to the launcher's corner and settles
 *   FLIGHT_MS           the launcher's CHROME appears around it, as a square
 *   + CHROME_MS         its icon and label follow, and the square widens to fit
 *   + SETTLE_MS         the section is handed back
 * The last gap matters: handing back as the label appears drops the content on top of a
 * gesture still in progress, which cuts the arrival off mid-sentence.
 */

/** How long the bulb takes to travel to the corner. */
const FLIGHT_MS = 900
/** How long the launcher's chrome shows before its contents appear. */
const CHROME_MS = 350
/** How long the arrival is left to breathe before the section is handed back. */
const SETTLE_MS = 700

/** Gap between staggered entry steps. */
const STEP_MS = 275
const DELAYS = { title: 0, bulb: 1, summary: 1, card: 2 }

const EASE =
  "transition-[opacity,translate] duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:delay-0"

function reveal(entered: boolean, step: number) {
  return {
    className: entered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
    style: { transitionDelay: entered ? `${step * STEP_MS}ms` : "0ms" },
  }
}

function useReducedMotion() {
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

interface SectionIntroCard {
  title: string
  /** One sentence per entry. At this measure a paragraph wraps mid-clause. */
  body: string[]
  /** A mock of what the reader is about to see, built from the real components. */
  visual: React.ReactNode
}

type LauncherStage = "hidden" | "chrome" | "full"

interface SectionIntroProps {
  /** The section name as the nav calls it. Prefixed with a dimmed "Welcome to". */
  title: string
  /** Reuses the guide's summary, so the two say the same thing. Split at the first colon. */
  summary: string
  /** Exactly three reads best; more and the row stops scanning. */
  cards: SectionIntroCard[]
  /**
   * Drives the `PageHelp` launcher's staged reveal.
   *
   * A callback rather than reading a context, because the launcher lives in the app shell
   * and this component cannot know how a given app wires that up.
   */
  onLauncherStage?: (stage: LauncherStage) => void
  /** Called once the arrival has settled, so the section can drop the takeover. */
  onDone: () => void
  className?: string
}

function SectionIntro({
  title,
  summary,
  cards,
  onLauncherStage,
  onDone,
  className,
}: SectionIntroProps) {
  const [phase, setPhase] = React.useState<"intro" | "flying" | "done">("intro")
  const reduced = useReducedMotion()

  // Hold the launcher invisible while the takeover is up: the flying bulb is what reveals
  // it, and a button already sitting in the corner gives that away.
  React.useEffect(() => {
    onLauncherStage?.("hidden")
    return () => onLauncherStage?.("full")
  }, [onLauncherStage])

  // Flipped one paint after mount, so the entry transition has a start value to run from.
  const [entered, setEntered] = React.useState(false)
  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  const bulbRef = React.useRef<HTMLSpanElement>(null)
  const [flight, setFlight] = React.useState<{ dx: number; dy: number; scale: number }>()
  const [origin, setOrigin] = React.useState<{ left: number; top: number }>()
  const [launched, setLaunched] = React.useState(false)
  const [landed, setLanded] = React.useState(false)

  function start() {
    const from = bulbRef.current?.getBoundingClientRect()
    const target = document
      .querySelector('[data-slot="page-help-launcher"]')
      ?.getBoundingClientRect()

    // No measurable target (no guide on this route) or reduced motion: skip to the
    // content rather than animating to nowhere. Must still release the launcher.
    if (reduced || !from || !target) {
      onLauncherStage?.("full")
      setPhase("done")
      onDone()
      return
    }

    setOrigin({ left: from.left, top: from.top })
    setFlight({
      dx: target.left + target.width / 2 - (from.left + from.width / 2),
      dy: target.top + target.height / 2 - (from.top + from.height / 2),
      // The launcher's icon is 16px; this bulb is 48px.
      scale: 16 / 48,
    })
    setPhase("flying")
    requestAnimationFrame(() => requestAnimationFrame(() => setLaunched(true)))

    window.setTimeout(() => {
      onLauncherStage?.("chrome")
      setLanded(true)
    }, FLIGHT_MS)
    window.setTimeout(() => onLauncherStage?.("full"), FLIGHT_MS + CHROME_MS)
    window.setTimeout(() => {
      setPhase("done")
      onDone()
    }, FLIGHT_MS + CHROME_MS + SETTLE_MS)
  }

  if (phase === "done") return null

  const leaving = phase === "flying"

  // Split at the first colon: statement, then enumeration. Without one it stays one line.
  const colon = summary.indexOf(":")
  const summaryLead = colon > -1 ? summary.slice(0, colon + 1) : summary
  const summaryRest = colon > -1 ? summary.slice(colon + 1).trim() : ""

  return (
    <div
      className={cn(
        // `overflow-hidden` contains the 8px entry rise: without it the last staggered
        // element can push past the container and flash a scrollbar on the way in.
        "relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-10",
        className
      )}
    >
      {/* The section's material, tying the takeover to the guide panel the bulb becomes. */}
      <span
        aria-hidden
        className="ds-texture-dots ds-texture-fade-up pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-30"
      />

      {/* The travelling bulb, rendered OUTSIDE the fading wrapper: parent opacity
          compounds onto children, so a bulb inside it would fade away mid-flight no
          matter what opacity it carried itself. */}
      {leaving && flight && origin && (
        <span
          aria-hidden
          className="pointer-events-none fixed z-50 flex size-12 items-center justify-center text-[var(--color-text-muted)]"
          style={{
            left: origin.left,
            top: origin.top,
            transform: launched
              ? `translate(${flight.dx}px, ${flight.dy}px) scale(${flight.scale})`
              : "translate(0px, 0px) scale(1)",
            opacity: landed ? 0 : 1,
            transition: `transform ${FLIGHT_MS}ms cubic-bezier(0.33, 0, 0.15, 1), opacity 180ms ease`,
          }}
        >
          <Lightbulb className="size-12" />
        </span>
      )}

      <div
        className={cn(
          "relative flex w-full max-w-5xl flex-col items-center transition-opacity duration-300 motion-reduce:transition-none",
          leaving ? "opacity-0" : "opacity-100"
        )}
      >
        {/* Measured for the flight, then hidden the instant the clone takes over. */}
        <span
          ref={bulbRef}
          className={cn(
            "flex size-12 items-center justify-center text-[var(--color-text-muted)]",
            EASE,
            reveal(entered, DELAYS.bulb).className,
            leaving && "invisible"
          )}
          style={reveal(entered, DELAYS.bulb).style}
        >
          <Lightbulb className="size-12" />
        </span>

        <h1
          className={cn(
            "mt-4 text-heading-1-serif text-[var(--color-text-default)]",
            EASE,
            reveal(entered, DELAYS.title).className
          )}
          style={reveal(entered, DELAYS.title).style}
        >
          {/* Dimmed greeting, full-strength noun: the section name is the subject. */}
          <span className="text-[var(--color-text-muted)]">Welcome to </span>
          {title}
        </h1>

        <p
          className={cn(
            "mt-3 max-w-2xl text-center text-body text-[var(--color-text-muted)]",
            EASE,
            reveal(entered, DELAYS.summary).className
          )}
          style={reveal(entered, DELAYS.summary).style}
        >
          <span className="block">{summaryLead}</span>
          {summaryRest && <span className="block">{summaryRest}</span>}
        </p>

        {/* Explicit minmax(0,1fr) tracks: auto tracks let a wide mock push its own column
            past its share and shunt the others out of alignment. `grid-rows-subgrid` puts
            every card's title on one line whatever its mock's height. */}
        <div className="mt-10 grid w-full gap-4 sm:[grid-template-columns:repeat(3,minmax(0,1fr))] sm:[grid-template-rows:auto_auto]">
          {cards.map((card, i) => (
            <div
              key={card.title}
              className={cn(
                "grid min-w-0 gap-4 [border-radius:var(--radius-card)] border border-[var(--color-border-default)] p-5 sm:row-span-2 sm:grid-rows-subgrid",
                EASE,
                reveal(entered, DELAYS.card + i).className
              )}
              style={reveal(entered, DELAYS.card + i).style}
            >
              <div className="flex items-center">{card.visual}</div>
              <div className="flex flex-col gap-1.5">
                <span className="text-heading-3-serif text-[var(--color-text-default)]">
                  {card.title}
                </span>
                {card.body.map(line => (
                  <span key={line} className="text-body-sm text-[var(--color-text-muted)]">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          className={cn("mt-10", EASE, reveal(entered, DELAYS.card + cards.length).className)}
          style={reveal(entered, DELAYS.card + cards.length).style}
          onClick={start}
        >
          Continue to {title.toLowerCase()}
        </Button>
      </div>
    </div>
  )
}

export { SectionIntro }
export type { SectionIntroProps, SectionIntroCard, LauncherStage }
