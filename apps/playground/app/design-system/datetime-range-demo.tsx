"use client"

import { useState } from "react"
import { DateTimeRangePicker, type DateTimeRange } from "minka-ds"

export function DateTimeRangeDemo() {
  const [range, setRange] = useState<DateTimeRange | null>(null)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption text-[var(--color-text-muted)]">
        maxRangeDays=7 — pick a range, then click a date far outside it to confirm it restarts cleanly.
      </p>
      <DateTimeRangePicker value={range} onChange={setRange} maxRangeDays={7} />
      <p className="text-caption text-[var(--color-text-hint)]">
        {range?.from
          ? `${range.from.toLocaleDateString()} ${range.startTime || "--:--"} → ${range.to.toLocaleDateString()} ${range.endTime || "--:--"}`
          : "No range selected"}
      </p>
    </div>
  )
}
