"use client"

import * as React from "react"
import { Lightbulb, X, ChevronRight, ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"

/**
 * PageHelp — a persistent, page-aware guide launcher and panel.
 *
 * Labelled "Guide" and marked with a lightbulb, NOT "Help" and a question mark. A "?" in
 * a corner is the universal support affordance, and this panel reaches no one: it
 * explains the page the reader is already on. Promising support and delivering a glossary
 * is worse than not offering it.
 *
 * This is `HelpExpander` scaled up, and the difference is scope. `HelpExpander` explains
 * ONE thing and lives beside the thing it explains, so it is only discoverable if you
 * are already looking at that spot. A first-time user does not know where to look. So
 * this is anchored to the viewport instead: always in the same corner, on every page,
 * answering "where am I and what can I do here" rather than "what does this field mean".
 *
 * The two are complementary rather than competing. Keep a `HelpExpander` for context
 * that only makes sense next to a specific control; put it here when the reader needs it
 * before they have understood the page at all.
 *
 * Content is passed in rather than fetched, so the caller owns it (studio keeps a
 * registry keyed by route). Sections are collapsed by default: an open panel that dumps
 * everything is a wall of text, and the headings are the index a reader scans first.
 */

interface HelpTopic {
  /** The question or concept, as the reader would phrase it. */
  title: string
  /** The explanation. Kept short: this is orientation, not a manual. */
  body: React.ReactNode
  /**
   * An optional way to go and do the thing just explained.
   *
   * Rendered at the END of the expanded body, never on the collapsed row. On the row it
   * would make the panel a second launcher competing with the page's own toolbar; after
   * the explanation it reads as "now that you know what this is, here is the door",
   * which is the order a first-time reader actually needs.
   */
  action?: { label: string; onClick: () => void }
  /**
   * Optional glyph before the title.
   *
   * Only worth passing when the topic HAS an established icon elsewhere in the product,
   * so the reader meets the same glyph here and on the control they are about to use.
   * That is recognition. An icon invented for a concept ("what is quorum?") is
   * decoration, and it competes with the serif title for the same job, so leave those
   * bare rather than reaching for a loose association.
   */
  icon?: React.ReactNode
}

interface PageHelpProps {
  /** What this page is, in the reader's words. Shown as the panel heading. */
  title: string
  /** One or two sentences on what the page is for, above the sections. */
  summary?: React.ReactNode
  /** Vocabulary the page assumes the reader already has. */
  concepts?: HelpTopic[]
  /** What the reader can actually do here. */
  actions?: HelpTopic[]
  /**
   * Draws attention to the launcher until it has been opened once.
   *
   * A dot rather than a timed tooltip: the reader may look away at the moment a tooltip
   * would appear, and a marker that persists until dismissed survives that. Clears on
   * first open, so it teaches once and then gets out of the way.
   */
  highlight?: boolean
  /** Fired the first time the panel is opened, so a caller can clear `highlight`. */
  onOpen?: () => void
  /**
   * Staged reveal, for when something else is animating INTO this position (the liquidity
   * intro flies a lightbulb here).
   *
   * - `"hidden"`: laid out but invisible. Deliberately opacity rather than `hidden`, so
   *   `getBoundingClientRect` still returns real numbers — a zero-sized rect would send
   *   the incoming animation to the viewport corner instead of to the button.
   * - `"chrome"`: the border, fill and shadow pop in, with the contents still hidden. This
   *   is the beat where the reader sees a BUTTON appear around the arriving glyph.
   * - `"full"` (default): everything visible, interactive.
   */
  launcherReveal?: "hidden" | "chrome" | "full"
  /** Optional link out to full documentation. */
  docHref?: string
  docLabel?: string
  className?: string
}

function PageHelp({
  title,
  summary,
  concepts = [],
  actions = [],
  highlight = false,
  onOpen,
  launcherReveal = "full",
  docHref,
  docLabel = "Read the full documentation",
  className,
}: PageHelpProps) {
  const [open, setOpen] = React.useState(false)

  // Keep the panel mounted through its close transition, and only flip to the shown
  // state once the browser has actually painted the closed state — otherwise there is no
  // start value and the transition has nothing to run from.
  //
  // The mount and the flip are deliberately in SEPARATE effects keyed on different
  // state. Doing both in one effect (as `HelpExpander` does) means React can commit the
  // mount and the single rAF callback inside the same paint, so the element's first
  // painted state is already the open one and the animation is skipped entirely. Two
  // nested rAFs guarantee a paint has happened in between.
  const [mounted, setMounted] = React.useState(false)
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setMounted(true)
      return
    }
    setShown(false)
    const t = setTimeout(() => setMounted(false), 200)
    return () => clearTimeout(t)
  }, [open])

  React.useEffect(() => {
    if (!mounted || !open) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [mounted, open])

  // Whether content is clipped at each edge of the scroll region, so the fade only
  // appears where there is something to fade INTO. A single flag would either fog the
  // first row at rest or leave the last row permanently half-visible.
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ top: false, bottom: false })

  const syncEdges = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    setEdges({
      top: scrollTop > 1,
      // 1px of slack: fractional scroll heights mean the exact equality never lands.
      bottom: scrollTop + clientHeight < scrollHeight - 1,
    })
  }, [])

  // Re-measure on open, on scroll, and whenever the content resizes — expanding a topic
  // changes the scroll height, so the bottom fade has to re-evaluate without a scroll.
  React.useEffect(() => {
    const el = scrollRef.current
    if (!mounted || !el) return
    syncEdges()
    el.addEventListener("scroll", syncEdges, { passive: true })
    const ro = new ResizeObserver(syncEdges)
    ro.observe(el)
    for (const child of Array.from(el.children)) ro.observe(child)
    return () => {
      el.removeEventListener("scroll", syncEdges)
      ro.disconnect()
    }
  }, [mounted, syncEdges])

  // Which topics are expanded, as "section:index". A set rather than a single id, so a
  // reader comparing two concepts can hold both open instead of losing the first.
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set())

  const toggle = React.useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }, [])

  // Close on Escape. A panel pinned to the viewport has no outside edge to click past on
  // mobile, so the keyboard route has to work.
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  // Collapse everything when the panel closes, so reopening starts at the index rather
  // than mid-way through the last thing read.
  React.useEffect(() => {
    if (!open) setExpanded(new Set())
  }, [open])

  const sections: { key: string; label: string; topics: HelpTopic[] }[] = [
    { key: "concepts", label: "Concepts", topics: concepts },
    { key: "actions", label: "What you can do", topics: actions },
  ].filter(s => s.topics.length > 0)

  return (
    <div
      className={cn(
        // Spans from the top of the viewport so the panel can fill the page height.
        // `pointer-events-none` on the column keeps the empty space above the panel
        // click-through; the panel and launcher re-enable it for themselves.
        // --z-dropdown, NOT --z-floating: floating is 210, above the dialog tier at 200, so the
        // panel and its launcher used to sit ON TOP of a dialog's backdrop. This is page
        // furniture, so it belongs under any overlay that dims the page.
        "fixed top-4 right-4 bottom-4 [z-index:var(--z-dropdown)] flex flex-col items-end justify-end gap-3 sm:top-6 sm:right-6 sm:bottom-6",
        "pointer-events-none *:pointer-events-auto",
        className
      )}
    >
      <style>{`
        /* A custom property is not interpolable unless it is registered with a type, so
           without this the mask would jump between keyframes instead of spreading. */
        @property --ds-grid-reach {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 12%;
        }
        /* A dot grid that materialises around the button as it lands, then settles.
           Expanding rings read as a notification pulse; a texture appearing reads as the
           surface the button belongs to being revealed, which is quieter and holds
           attention longer.
           The dots fade in from the centre outward via a mask that widens, so the grid
           appears to spread from under the button rather than switching on at once. */
        @keyframes ds-launcher-grid {
          from { opacity: 0;   --ds-grid-reach: 12% }
          35%  { opacity: 1 }
          to   { opacity: 0;   --ds-grid-reach: 90% }
        }
        /* A single soft bloom under the button, so the landing has a centre. */
        @keyframes ds-launcher-bloom {
          from { opacity: .5; transform: scale(.6) }
          to   { opacity: 0;  transform: scale(1.6) }
        }
      `}</style>
      {mounted ? (
        <div
          role="dialog"
          aria-label={`Guide: ${title}`}
          className={cn(
            // Fills the height it is given rather than capping at a card: this is a
            // reference panel, and the sections are the reason it exists.
            "flex min-h-0 w-[calc(100vw-2rem)] flex-1 flex-col overflow-hidden sm:w-96",
            "[border-radius:var(--radius-modal)] border border-[var(--color-border-default)]",
            // Frosted, matching the inset `HelpExpander` card: the panel sits over live
            // content, so letting it read through is what keeps it feeling attached to
            // the page rather than pasted on top.
            "backdrop-blur-md shadow-[var(--shadow-modal)]",
            "transition-[opacity,scale,translate] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            shown
              ? "scale-100 translate-y-0 opacity-100"
              : "pointer-events-none scale-95 translate-y-2 opacity-0"
          )}
          style={{
            backgroundColor: "color-mix(in srgb, var(--color-bg-overlay) 70%, transparent)",
            // Grows out of / shrinks back into the launcher's corner.
            transformOrigin: "bottom right",
          }}
        >
          {/* The panel's material: the same dot grid the launcher lands on, faded out
              toward the top so it reads as texture under the content rather than a
              pattern competing with it. Bottom-anchored, because that is where the empty
              space collects when the sections are short. */}
          <span
            aria-hidden
            className="ds-texture-dots pointer-events-none absolute inset-0 opacity-30"
            style={{
              // A shorter fade than the utility's default: the panel is tall and narrow,
              // so the texture should clear the content sooner.
              maskImage: "linear-gradient(to top, #000 0%, transparent 55%)",
              WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 55%)",
            }}
          />
          <div className="relative flex shrink-0 flex-col gap-1.5 p-4 pb-8">
            <div className="flex items-center gap-3">
              <Lightbulb
                aria-hidden
                className="size-7 shrink-0 text-[var(--color-text-muted)]"
              />
              <h2 className="min-w-0 flex-1 text-heading-2-serif text-[var(--color-text-default)]">{title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close guide"
                className="flex size-7 shrink-0 self-start items-center justify-center [border-radius:var(--radius-button)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-action-ghost-hover)] hover:text-[var(--color-text-default)]"
              >
                <X className="size-4" />
              </button>
            </div>
            {summary && (
              <p className="text-body-sm text-[var(--color-text-muted)]">{summary}</p>
            )}
          </div>

          {/* The only scrolling region, so the header and the doc link stay put.
              `ds-scroll` opts into the DS scrollbar; without it this falls back to the
              native one, which is heavier than anything else on the panel. */}
          <div
            ref={scrollRef}
            className="ds-scroll relative flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-4 pt-2"
            style={{
              // A mask rather than a gradient overlay: the panel is translucent and
              // blurred, so a painted gradient would have to guess the composited colour
              // and would read as a grey smudge. Masking makes the CONTENT transparent
              // instead, so the frost still shows through and there is no colour to match.
              maskImage: maskFor(edges),
              WebkitMaskImage: maskFor(edges),
            }}
          >
            {sections.map(section => (
              <div key={section.key} className="flex flex-col">
                <span className="text-overline mb-1.5 text-[var(--color-text-muted)]">
                  {section.label}
                </span>
                {section.topics.map((topic, i) => {
                  const id = `${section.key}:${i}`
                  const isOpen = expanded.has(id)
                  return (
                    <div key={id} className="flex flex-col">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => toggle(id)}
                        className="group/topic flex items-center gap-3 py-1.5 text-left [border-radius:var(--radius-button)] transition-colors"
                      >
                        {topic.icon && (
                          <span
                            aria-hidden
                            className="flex size-4 shrink-0 items-center justify-center text-[var(--color-text-muted)] [&>svg]:size-4"
                          >
                            {topic.icon}
                          </span>
                        )}
                        <span
                          className={cn(
                            // Serif, and a step up from the body: the titles are the
                            // index a reader scans, so they need to lead rather than
                            // sit at the same weight as nine paragraphs of answer.
                            "flex-1 text-body-lg-serif text-[var(--color-text-default)]"
                          )}
                        >
                          {topic.title}
                        </span>
                        <ChevronRight
                          className={cn(
                            "size-3.5 shrink-0 text-[var(--color-text-hint)]",
                            // Colour and rotation are both transitioned: hovering the
                            // row is what changes the colour, so the chevron has to
                            // animate on a property the row can drive.
                            "transition-[transform,color] duration-200 motion-reduce:transition-none",
                            "group-hover/topic:text-[var(--color-text-default)]",
                            isOpen && "rotate-90"
                          )}
                        />
                      </button>
                      {/* Always mounted: a conditional render has no start state, so
                          it can only pop. The 0fr -> 1fr grid row is the DS's existing
                          reveal (see RadioGroup), and it animates height without needing
                          a measured pixel value. */}
                      <div
                        className={cn(
                          "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        )}
                      >
                        <div className="overflow-hidden">
                          <div
                            className={cn(
                              "pt-1 pb-5 text-body-sm leading-relaxed text-[var(--color-text-muted)]",
                              "transition-opacity duration-200 motion-reduce:transition-none",
                              isOpen ? "opacity-100" : "opacity-0"
                            )}
                          >
                            {topic.body}
                            {topic.action && (
                              <button
                                type="button"
                                onClick={() => {
                                  // Close first: the reader has left the reference to go
                                  // do the thing. Not a stacking workaround — the panel
                                  // now sits under the dialog backdrop by design — but
                                  // leaving it open would mean dismissing two things.
                                  setOpen(false)
                                  topic.action?.onClick()
                                }}
                                className="mt-3 flex items-center gap-1.5 text-body-sm text-[var(--color-text-link)] transition-colors hover:text-[var(--color-text-link-hover)]"
                              >
                                {topic.action.label}
                                <ArrowRight className="size-3.5 shrink-0" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {docHref && (
            <a
              href={docHref}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-2 border-t border-[var(--color-border-subtle)] p-4 text-body-sm text-[var(--color-action-primary-default)] transition-colors hover:bg-[var(--color-action-ghost-hover)]"
            >
              {docLabel}
            </a>
          )}
        </div>
      ) : (
        /* The launcher. Labelled rather than icon-only: a bare "?" in a corner is easy to
           read as decoration, and the whole point is that a first-time user notices it.
           The label is hidden on small screens, where the corner has less room to spare.
           Swapped for the panel rather than sitting beside it, so the button reads as
           growing into the panel the way an inset `HelpExpander` does. */
        <>
      {/* Sits OUTSIDE the button: during the chrome beat the button is overflow-hidden
          (so its label cannot spill before it widens), which would clip the rings. */}
      {launcherReveal === "chrome" && (
        <span
          aria-hidden
          // Centred on the button and much larger than it, so the texture has room to
          // spread. Negative offsets rather than a transform: the grid must not scale,
          // or the dots would stretch as it grew.
          className="pointer-events-none absolute -right-24 -bottom-24 size-64 motion-reduce:hidden"
        >
          {/* The dot grid. `--color-text-hint` rather than the accent: a coloured texture
              reads as an alert, a neutral one reads as the page's own material. */}
          <span
            className="ds-texture-dots absolute inset-0 [animation:ds-launcher-grid_1100ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{
              // Fades out toward the edges so the grid has no hard boundary. The mask
              // stop is animated by the keyframes, so the visible extent spreads.
              maskImage:
                "radial-gradient(circle at 62.5% 62.5%, #000 var(--ds-grid-reach, 12%), transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(circle at 62.5% 62.5%, #000 var(--ds-grid-reach, 12%), transparent 78%)",
            }}
          />
          {/* A soft bloom centred on the button, giving the landing a focal point. */}
          <span
            className="absolute inset-0 [animation:ds-launcher-bloom_760ms_cubic-bezier(0.16,1,0.3,1)_forwards]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 62.5% 62.5%, var(--color-bg-overlay) 0%, transparent 42%)",
            }}
          />
        </span>
      )}
      <button
        type="button"
        // Measurable target for anything that needs to point at or animate to the
        // launcher (the liquidity intro flies a lightbulb here).
        data-slot="page-help-launcher"
        onClick={() => { setOpen(true); onOpen?.() }}
        aria-expanded={open}
        className={cn(
          "relative flex h-10 shrink-0 items-center gap-2 [border-radius:var(--radius-button)]",
          "border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)]",
          "text-body-sm text-[var(--color-text-default)] shadow-[var(--shadow-popover)]",
          "hover:bg-[var(--color-bg-table-hover)]",
          "outline-none focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
          // The chrome pops in with a slight overshoot so it reads as arriving rather than
          // fading up, THEN widens to fit its label. Width is animated separately with a
          // plain ease-out: an overshoot on the width would make the button bounce past
          // its own text.
          "transition-[opacity,scale,background-color,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
          "[transition-property:opacity,scale,background-color,border-color,width] [transition-duration:300ms,300ms,300ms,300ms,380ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1),cubic-bezier(0.34,1.56,0.64,1),ease,ease,cubic-bezier(0.16,1,0.3,1)]",
          // Square while the chrome lands (h-10 = 2.5rem), then released to its natural
          // width. `overflow-hidden` keeps the label from spilling before the box has
          // grown to hold it.
          launcherReveal !== "full" ? "w-10 justify-center overflow-hidden px-0" : "w-auto px-3",
          launcherReveal === "hidden" && "pointer-events-none scale-90 opacity-0",
          launcherReveal === "chrome" && "pointer-events-none scale-100 opacity-100",
          launcherReveal === "full" && "scale-100 opacity-100"
        )}
        aria-hidden={launcherReveal !== "full" || undefined}
        tabIndex={launcherReveal !== "full" ? -1 : undefined}
      >
        {/* Contents lag the chrome by a beat: the box appears first, then what is in it.
            The icon is held back too, because the arriving lightbulb IS the icon during
            the flight — showing a second one underneath would double it. */}
        <span
          className={cn(
            "flex items-center gap-2 transition-opacity duration-200 motion-reduce:transition-none",
            launcherReveal === "full" ? "opacity-100" : "opacity-0"
          )}
        >
          <Lightbulb className="size-4 shrink-0" />
          <span className="hidden sm:inline">Guide</span>
        </span>
        {highlight && (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[var(--color-action-primary-default)] ring-2 ring-[var(--color-bg-overlay)]"
          />
        )}
      </button>
        </>
      )}
    </div>
  )
}

/**
 * Builds the fade mask for whichever edges currently clip content.
 *
 * Returns undefined when nothing is clipped, so no mask is applied at all — a mask is a
 * compositing layer, and there is no reason to pay for one when both ends are resolved.
 */
function maskFor({ top, bottom }: { top: boolean; bottom: boolean }): string | undefined {
  if (!top && !bottom) return undefined
  const stops: string[] = []
  stops.push(top ? "transparent 0" : "#000 0")
  if (top) stops.push("#000 1.25rem")
  if (bottom) stops.push("#000 calc(100% - 1.25rem)", "transparent 100%")
  else stops.push("#000 100%")
  return `linear-gradient(to bottom, ${stops.join(", ")})`
}

export { PageHelp }
export type { PageHelpProps, HelpTopic }
