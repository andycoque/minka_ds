import { Timeline } from "minka-ds"
import type { TimelineSection } from "minka-ds"

// A healthy multi-section run: a "Setup" milestone leading its steps, a boundary
// annotation, a "Build" milestone closing the commit-like steps, and a final
// "Release" milestone — exercising done / current / upcoming statuses, the
// two-layer progress rail, elbows, a gap, and the annotation row.
const HEALTHY: TimelineSection[] = [
  {
    position: "top",
    milestone: { lead: "Stage 1", label: "Queued", variant: "warning", active: true },
    items: [
      { label: "Request created",     status: "done", meta: "System", timestamp: "09:21:04.120" },
      { label: "Validates input",     status: "done", meta: "System", timestamp: "09:21:04.880" },
      { label: "Reserves resources",  status: "done", meta: "Worker A", timestamp: "09:21:05.030" },
    ],
  },
  {
    position: "end",
    gapBefore: true,
    annotationBefore: {
      title: "Point of no return",
      description: "Once resources are reserved the run is committed and executed end to end. No intermediate checkpoint.",
    },
    milestone: { lead: "Stage 2", label: "Running", variant: "info", active: true },
    items: [
      { label: "Executes job",        status: "done",    meta: "Worker A", timestamp: "09:21:05.210" },
      { label: "Streams output",      status: "current", meta: "Worker A" },
      { label: "Finalizes artifacts", status: "upcoming", meta: "Worker A" },
    ],
  },
  {
    position: "end",
    milestone: { lead: undefined, label: "Released", variant: "success", active: false },
    items: [
      { label: "Published to registry", status: "upcoming", meta: "System" },
    ],
  },
]

// A failed run: truncates at the failed step, "Failed" badge, nothing after.
const FAILED: TimelineSection[] = [
  {
    position: "top",
    milestone: { lead: "Stage 1", label: "Failed", variant: "error", active: true },
    items: [
      { label: "Request created", status: "done",   meta: "System",  timestamp: "11:02:10.000" },
      { label: "Validates input", status: "done",   meta: "System",  timestamp: "11:02:10.640" },
      { label: "Reserves resources", status: "failed", meta: "Worker B", detail: "quota exceeded" },
    ],
  },
  {
    position: "end",
    gapBefore: true,
    milestone: { label: "Running", variant: "info" },
    items: [{ label: "Executes job", status: "upcoming", meta: "Worker B" }],
  },
]

export function TimelineDemo() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-caption text-[var(--color-text-muted)]">Healthy run</span>
        <Timeline sections={HEALTHY} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-caption text-[var(--color-text-muted)]">Failed run (truncates)</span>
        <Timeline sections={FAILED} truncateAtFailure />
      </div>
    </div>
  )
}
