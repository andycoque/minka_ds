"use client"

import * as React from "react"
import { ChevronDownIcon, Info } from "lucide-react"
import { Badge } from "./badge"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import { cn } from "../../lib/utils"

// A vertical process timeline: ordered sections, each anchored by a milestone
// badge, with items (steps) connected by a two-layer rail — a 4px muted "route"
// always drawn, and a 2px dark "progress" line riding on it from the top down to
// the step in progress. Sections connect via rounded CSS elbows. Optional
// annotation rows (a DS Alert) mark boundaries. On failure the timeline can
// truncate at the failed item.
//
// Status vocabulary (fixed): done = success(green), current = warning(amber,
// pulsing), failed = error(red), upcoming = border-strong(grey).

export type TimelineItemStatus = "done" | "current" | "upcoming" | "failed"

export interface TimelineItem {
  label: string
  status: TimelineItemStatus
  /** Secondary tag shown before the label (e.g. an actor: "Ledger · …"). */
  meta?: string
  /** Preformatted timestamp shown first in the row (mono, hint). */
  timestamp?: string
  /** Optional "+N" multi-day suffix on the timestamp. */
  dayOffset?: number
  /** Failure reason, shown red inline when status is "failed". */
  detail?: string
  /**
   * Full record for this item, revealed by a chevron on the row. Rows without
   * fields render exactly as before, with no chevron.
   */
  fields?: TimelineItemField[]
}

/** One labelled value inside an item's expandable record. */
export interface TimelineItemField {
  label: string
  value: string
}

export interface TimelineMilestone {
  label: string
  variant: "warning" | "info" | "success" | "error"
  /** Heading shown left of the badge (e.g. a ledger phase term). */
  lead?: string
  /** Full-color when true; dimmed when false (not yet reached). */
  active?: boolean
}

export interface TimelineAnnotation {
  title: string
  description: React.ReactNode
  /** DS Alert variant; defaults to "info". */
  variant?: "info" | "success" | "warning" | "error"
}

export interface TimelineSection {
  milestone: TimelineMilestone
  /** Elbow direction: "top" leads into the items below, "end" closes them. */
  position: "top" | "end"
  items: TimelineItem[]
  /** Optional Alert row rendered before this section's items. */
  annotationBefore?: TimelineAnnotation
  /** Open a stub gap above the first item (separates from the section above). */
  gapBefore?: boolean
}

export interface TimelineProps {
  sections: TimelineSection[]
  /** When true, render stops after the first failed item (and its section). */
  truncateAtFailure?: boolean
  className?: string
}

// ── Geometry (shared so dots, lines, and elbows align on one axis) ────────────
const RAIL_W = 20
const RAIL_X = RAIL_W / 2
const RAIL_MUTED = "var(--color-border-default)"
const RAIL_DARK = "var(--color-text-default)"
// Dot center aligns to the vertical center of the first text line (text-body-sm
// = 14px × 1.5 = 21px line box → center at 10.5px). Connectors/elbows derive
// from DOT_TOP so they shift with it.
const DOT_TOP = 10.5
const STROKE = 4       // muted base stroke width — the structural rail
const STROKE_DARK = 2  // dark progress stroke — thinner, rides over the base
const STUB_LEN = 12    // partial stub length across a section gap
const MILESTONE_H = 30 // fixed milestone row height; title-center = H/2
const ELBOW_RADIUS = 8
const ELBOW_REACH = RAIL_W / 2 + 2
const ROW_PB = 12      // pb-3 below a milestone; the top elbow's arm spans it
const ANNOTATION_ANCHOR = 18 // px to the alert's title line (elbow lands here)
const ANNOTATION_PB = 16     // pb-4 below the annotation; arm spans it to next dot

type LineBelow = "none" | "muted" | "dark"
type Stub = "muted" | "dark" | null

// Proof-dot color reads status alone: green done, amber current (pulse), red
// failed, grey upcoming.
const DOT_CLASS: Record<TimelineItemStatus, string> = {
  done:     "bg-[var(--color-feedback-success)]",
  current:  "bg-[var(--color-feedback-warning)] [animation:tl-pulse_1.6s_ease-in-out_infinite]",
  failed:   "bg-[var(--color-feedback-error)]",
  upcoming: "bg-[var(--color-border-strong)]",
}

// ── Rail segment ──────────────────────────────────────────────────────────────
// The 4px muted base (the route) is ALWAYS drawn; a 2px dark line overlays it,
// centered, when `dark` (progress reached here). `bottom` xor `height` sets the
// lower end.
function RailSeg({ top, bottom, height, dark }: { top: number; bottom?: number; height?: number; dark: boolean }) {
  const span: React.CSSProperties = { top, ...(height != null ? { height } : { bottom }) }
  return (
    <>
      <span className="absolute rounded-full" style={{ left: RAIL_X, width: STROKE, backgroundColor: RAIL_MUTED, transform: `translateX(-${STROKE / 2}px)`, ...span }} />
      {dark && <span className="absolute rounded-full" style={{ left: RAIL_X, width: STROKE_DARK, backgroundColor: RAIL_DARK, transform: `translateX(-${STROKE_DARK / 2}px)`, ...span }} />}
    </>
  )
}

// ── Item row ──────────────────────────────────────────────────────────────────
// The dot sits at a fixed offset from the row top; the connector runs from this
// dot's center to the NEXT dot's center. Since every dot shares the same offset,
// `top: DOT_TOP` → `bottom: -DOT_TOP` lands exactly on the next dot regardless of
// row height. The dot is painted last, over the connector's start.
function ItemRow({ item, lineBelow, stubAbove = null, stubBelow = null }: { item: TimelineItem; lineBelow: LineBelow; stubAbove?: Stub; stubBelow?: Stub }) {
  const upcoming = item.status === "upcoming"
  const failed = item.status === "failed"
  const [open, setOpen] = React.useState(false)
  // Only rows that carry a record are expandable; the rest keep the plain layout,
  // so nothing shifts on timelines whose items have no fields.
  const expandable = !!item.fields?.length

  return (
    <div className="flex gap-2">
      <div className="relative shrink-0" style={{ width: RAIL_W }}>
        {lineBelow !== "none" && <RailSeg top={DOT_TOP} bottom={-DOT_TOP} dark={lineBelow === "dark"} />}
        {stubAbove && <RailSeg top={DOT_TOP - STUB_LEN} height={STUB_LEN} dark={stubAbove === "dark"} />}
        {stubBelow && <RailSeg top={DOT_TOP} height={STUB_LEN} dark={stubBelow === "dark"} />}
        <span className={`absolute size-2.5 rounded-full ${DOT_CLASS[item.status]}`} style={{ left: RAIL_X, top: DOT_TOP, transform: "translate(-50%, -50%)" }} />
      </div>

      {/* Text column. The rail runs the full height of this column, so the expanded
          record sits inside it and the connector flows past it unbroken. */}
      <div className={`flex flex-1 flex-col pb-4 ${upcoming ? "opacity-45" : ""}`}>
        {/* single line: timestamp (mono, hint) · meta · label */}
        <div className="flex items-baseline gap-2 text-body-sm">
          {item.timestamp && (
            <span className="shrink-0 text-caption text-[var(--color-text-hint)] [font-family:var(--font-mono)]">
              {item.timestamp}
              {item.dayOffset != null && item.dayOffset > 0 && <span className="ml-0.5 align-super text-[0.7em]">+{item.dayOffset}</span>}
            </span>
          )}
          {item.meta && <span className="text-[var(--color-text-muted)]">{item.meta} ·</span>}
          <span className="text-[var(--color-text-default)]">{item.label}</span>
          {failed && item.detail && <span className="text-[var(--color-feedback-error)]">· {item.detail}</span>}
          {expandable && (
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-label={open ? `Hide details for ${item.label}` : `Show details for ${item.label}`}
              className="ml-auto inline-flex shrink-0 items-center gap-1 self-center [border-radius:var(--radius-button)] px-1.5 py-0.5 text-caption text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-disabled)] hover:text-[var(--color-text-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
            >
              <ChevronDownIcon
                className={`size-3.5 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {expandable && open && (
          <dl className="mt-2 grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1.5 [border-radius:var(--radius-card)] border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] px-3 py-2.5">
            {item.fields!.map(f => (
              <React.Fragment key={f.label}>
                <dt className="text-caption text-[var(--color-text-muted)]">{f.label}</dt>
                {/* Signer keys and LUIDs are long and must stay readable: mono, and
                    wrapped rather than truncated so the value can be read in full. */}
                <dd className="text-caption break-all text-[var(--color-text-default)] [font-family:var(--font-mono)]">{f.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        )}
      </div>
    </div>
  )
}

// ── Milestone elbow ───────────────────────────────────────────────────────────
// CSS elbow (bordered box, no SVG): a vertical arm + a horizontal arm into the
// badge, with a rounded corner. Two layers so the 2px dark rides centered on the
// 4px muted base. Both endpoints anchor to centers (badge-center = MILESTONE_H/2;
// the adjacent dot is DOT_TOP into the flush neighbour row).
function Elbow({ position, reached }: { position: "top" | "end"; reached: boolean }) {
  const TITLE_C = MILESTONE_H / 2
  const layer = (w: number, c: string): React.CSSProperties => {
    const d = (STROKE - w) / 2
    return {
      position: "absolute",
      left: RAIL_X,
      width: ELBOW_REACH,
      transform: `translateX(-${w / 2}px)`,
      borderStyle: "solid",
      borderColor: "transparent",
      borderLeftWidth: w,
      borderLeftColor: c,
      ...(position === "end"
        ? { top: -DOT_TOP, height: TITLE_C + DOT_TOP - d, borderBottomWidth: w, borderBottomColor: c, borderBottomLeftRadius: ELBOW_RADIUS - d }
        : { top: TITLE_C + d, height: MILESTONE_H - TITLE_C + ROW_PB + DOT_TOP - d, borderTopWidth: w, borderTopColor: c, borderTopLeftRadius: ELBOW_RADIUS - d }),
    }
  }
  return (
    <>
      <span style={layer(STROKE, RAIL_MUTED)} />
      {reached && <span style={layer(STROKE_DARK, RAIL_DARK)} />}
    </>
  )
}

function MilestoneRow({ milestone, position, reached }: { milestone: TimelineMilestone; position: "top" | "end"; reached: boolean }) {
  const active = milestone.active ?? true
  return (
    <div className="pb-3">
      <div className="flex items-center gap-2" style={{ height: MILESTONE_H }}>
        <div className="relative shrink-0 self-stretch" style={{ width: RAIL_W }}>
          <Elbow position={position} reached={reached} />
        </div>
        <div className={`flex items-center gap-2.5 ${active ? "" : "opacity-55"}`}>
          {milestone.lead && (
            <span className="text-body-lg font-semibold text-[var(--color-text-default)]">{milestone.lead}</span>
          )}
          <Badge variant={milestone.variant} className="text-label px-2.5 py-1">{milestone.label}</Badge>
        </div>
      </div>
    </div>
  )
}

// ── Annotation row ────────────────────────────────────────────────────────────
// A label (not an item — no dot): a DS Alert beside the rail, with the rail
// continuing down into the next item's dot. Two-layer like the rail.
//
// `throughLine` picks the geometry. When the rail arrives from ABOVE (a milestone
// or item precedes this annotation) it must pass straight through, unbroken — an
// elbow there would read as the rail starting at the alert. Only when nothing
// precedes it does the elbow's corner make sense, turning out of the alert and
// down into the first item.
function AnnotationRow({ annotation, dark, throughLine = false }: { annotation: TimelineAnnotation; dark: boolean; throughLine?: boolean }) {
  const elbowLayer = (w: number, c: string): React.CSSProperties => {
    const d = (STROKE - w) / 2
    const base: React.CSSProperties = {
      position: "absolute",
      left: RAIL_X,
      transform: `translateX(-${w / 2}px)`,
      borderStyle: "solid",
      borderColor: "transparent",
      borderLeftWidth: w,
      borderLeftColor: c,
    }
    if (throughLine) {
      // Straight segment spanning the full row: enters at the top edge, exits into
      // the next dot, so the rail is continuous across the annotation.
      return { ...base, width: 0, top: -DOT_TOP, bottom: -(DOT_TOP + ANNOTATION_PB) }
    }
    return {
      ...base,
      width: ELBOW_REACH,
      top: ANNOTATION_ANCHOR + d,
      bottom: -(DOT_TOP + ANNOTATION_PB),
      borderTopWidth: w,
      borderTopColor: c,
      borderTopLeftRadius: ELBOW_RADIUS - d,
    }
  }
  return (
    <div className="flex items-start gap-2 pb-4">
      <div className="relative shrink-0 self-stretch" style={{ width: RAIL_W }}>
        <span style={elbowLayer(STROKE, RAIL_MUTED)} />
        {dark && <span style={elbowLayer(STROKE_DARK, RAIL_DARK)} />}
      </div>
      <Alert variant={annotation.variant ?? "info"}>
        <Info />
        <AlertTitle>{annotation.title}</AlertTitle>
        <AlertDescription>{annotation.description}</AlertDescription>
      </Alert>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const isDone = (i?: TimelineItem) => i?.status === "done"
const reachedDot = (i?: TimelineItem) => i?.status === "done" || i?.status === "current"

// Connector below an item: none if nothing follows it in-section (gap/elbow
// joins); dark once flow passed it (done); muted otherwise.
const lineBelowFor = (i: TimelineItem, nextJoins: boolean): LineBelow =>
  !nextJoins ? "none" : i.status === "done" ? "dark" : "muted"
const stubColor = (i?: TimelineItem): Stub => (reachedDot(i) ? "dark" : "muted")

/**
 * Generic vertical process timeline. See the file header for the model. The
 * component owns all layout (rail, connectors, elbows, stubs, truncation); the
 * consumer supplies the data and wraps it (e.g. in a Card) as needed.
 */
function Timeline({ sections, truncateAtFailure = false, className }: TimelineProps) {
  // Find the failing item (across sections) to optionally truncate there.
  let failedSectionIdx = -1
  let failedItemIdx = -1
  if (truncateAtFailure) {
    for (let s = 0; s < sections.length && failedSectionIdx === -1; s++) {
      const fi = sections[s].items.findIndex(i => i.status === "failed")
      if (fi !== -1) { failedSectionIdx = s; failedItemIdx = fi }
    }
  }
  const truncated = failedSectionIdx !== -1

  return (
    <div className={cn("flex flex-col", className)}>
      <style>{`@keyframes tl-pulse {
        0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-feedback-warning) 45%, transparent); }
        50%      { box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-feedback-warning) 0%, transparent); }
      }`}</style>

      {sections.map((section, s) => {
        if (truncated && s > failedSectionIdx) return null
        const items = truncated && s === failedSectionIdx
          ? section.items.slice(0, failedItemIdx + 1)
          : section.items
        const sectionFailed = truncated && s === failedSectionIdx
        const lastItem = items[items.length - 1]
        // A gap sits between two sections when the FOLLOWING section opts in via
        // gapBefore: this section's last item gets a stub below, the next
        // section's first item a stub above — together forming the broken gap.
        const next = sections[s + 1]
        const closeWithGap = section.position === "top" && !sectionFailed && !!next?.gapBefore

        return (
          <React.Fragment key={s}>
            {section.position === "top" && (
              <MilestoneRow milestone={section.milestone} position="top" reached={isDone(items[0])} />
            )}

            {section.annotationBefore && (
              <AnnotationRow
                annotation={section.annotationBefore}
                dark={stubColor(items[0]) === "dark"}
                // A "top" milestone renders directly above, so the rail arrives from
                // there and must run straight through rather than turning a corner.
                throughLine={section.position === "top"}
              />
            )}

            {items.map((item, i) => {
              const isLast = i === items.length - 1
              return (
                <ItemRow
                  key={i}
                  item={item}
                  lineBelow={lineBelowFor(item, !isLast)}
                  stubBelow={isLast && closeWithGap ? stubColor(item) : null}
                  // a stub above the first item only when this section opts into a
                  // gap AND it isn't introduced by an annotation (the annotation's
                  // elbow already connects down into the first item).
                  stubAbove={i === 0 && section.gapBefore && !section.annotationBefore ? stubColor(item) : null}
                />
              )
            })}

            {section.position === "end" && !sectionFailed && (
              <MilestoneRow milestone={section.milestone} position="end" reached={isDone(lastItem)} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { Timeline }
