"use client"

import * as React from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "minka-ds"
import { cn } from "@/lib/utils"

/**
 * MotionSpec — documents a transition and lets the reader replay it.
 *
 * Two reasons this section exists rather than a sentence of prose:
 *
 * 1. A transition you cannot re-trigger is a transition you cannot review. Hover
 *    effects in particular are hard to judge because the mouse has to leave and
 *    come back, and the return leg is where they usually break.
 * 2. Writing the utilities down here means they get emitted into the compiled
 *    CSS. Tailwind only generates classes it can see in scanned source, so an
 *    arbitrary value that appears in exactly one component and nowhere else is
 *    the classic silent no-op — the element snaps instead of easing.
 *
 * `trigger="replay"` remounts the child so an enter animation runs again.
 * `trigger="hover"` just frames the specimen and tells the reader to hover.
 */
function MotionSpec({
  duration,
  easing,
  properties,
  trigger = "hover",
  children,
  note,
}: {
  duration: string
  easing: string
  properties: string
  trigger?: "hover" | "replay"
  children: React.ReactNode
  note?: React.ReactNode
}) {
  const [runKey, setRunKey] = React.useState(0)

  return (
    <div className="not-prose border border-[var(--color-border-default)] [border-radius:var(--radius-card)] overflow-hidden">
      <div className="relative flex min-h-32 items-center justify-center bg-[var(--color-bg-base)] px-6 py-8">
        <div key={runKey}>{children}</div>

        {trigger === "replay" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRunKey((k) => k + 1)}
            className="absolute right-3 top-3"
          >
            <RotateCcw />
            Replay
          </Button>
        ) : (
          <span className="absolute right-3 top-3 text-caption text-[var(--color-text-hint)]">
            Hover to play
          </span>
        )}
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-[var(--color-border-subtle)] px-4 py-3">
        <SpecRow label="Duration" value={duration} />
        <SpecRow label="Easing" value={easing} />
        <SpecRow label="Properties" value={properties} />
      </dl>

      {note ? (
        <p className="border-t border-[var(--color-border-subtle)] px-4 py-3 text-body-sm text-[var(--color-text-muted)]">
          {note}
        </p>
      ) : null}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className={cn("text-caption text-[var(--color-text-muted)] pt-0.5")}>{label}</dt>
      <dd className="text-body-sm text-[var(--color-text-default)]">{value}</dd>
    </>
  )
}

export { MotionSpec }
