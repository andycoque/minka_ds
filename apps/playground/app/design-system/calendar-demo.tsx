"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [single, setSingle] = useState<Date | undefined>()
  const [range, setRange] = useState<DateRange | undefined>()

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">Single — dropdown caption</p>
        <div className="inline-block rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)]">
          <Calendar mode="single" selected={single} onSelect={setSingle} />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">Range — 2 months</p>
        <div className="inline-block rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)]">
          <Calendar mode="range" selected={range} onSelect={setRange} />
        </div>
      </div>
    </div>
  )
}
