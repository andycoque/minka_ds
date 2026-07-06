"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { cn } from "../../lib/utils"

export interface DateTimeRange {
  from: Date
  to: Date
  startTime: string
  endTime: string
}

interface DateTimeRangePickerProps {
  value?: DateTimeRange | null
  onChange: (value: DateTimeRange | null) => void
  maxRangeDays?: number
  className?: string
}

export function DateTimeRangePicker({
  value,
  onChange,
  maxRangeDays,
  className,
}: DateTimeRangePickerProps) {
  const range: DateRange | undefined =
    value?.from ? { from: value.from, to: value.to } : undefined

  // `anchor` is the source of truth for selection phase:
  //   anchor === null → no active pick (nothing selected, or a complete range)
  //   anchor !== null → first date is set, waiting for the second click
  // This avoids the ambiguity of inferring phase from `from === to`.
  const [anchor, setAnchor] = React.useState<Date | null>(null)

  function handleDay(day: Date) {
    const startTime = value?.startTime ?? ""
    const endTime   = value?.endTime   ?? ""

    // Picking the second date.
    if (anchor) {
      const spanMs    = Math.abs(day.getTime() - anchor.getTime())
      const withinCap = maxRangeDays == null || spanMs <= maxRangeDays * 86_400_000
      if (withinCap) {
        // Complete the range (order endpoints; can extend backward or forward).
        const from = day < anchor ? day : anchor
        const to   = day < anchor ? anchor : day
        setAnchor(null)
        onChange({ from, to, startTime, endTime })
      } else {
        // Outside the cap → treat as a fresh start anchored on the clicked day.
        setAnchor(day)
        onChange({ from: day, to: day, startTime, endTime })
      }
      return
    }

    // No active pick (fresh, or restarting from a complete range).
    setAnchor(day)
    onChange({ from: day, to: day, startTime, endTime })
  }

  function handleStartTime(e: React.ChangeEvent<HTMLInputElement>) {
    if (!value?.from) return
    onChange({ ...value, startTime: e.target.value })
  }

  function handleEndTime(e: React.ChangeEvent<HTMLInputElement>) {
    if (!value?.from) return
    onChange({ ...value, endTime: e.target.value })
  }

  return (
    <div className={cn(
      "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] overflow-hidden w-fit",
      className
    )}>
      <Calendar
        mode="range"
        numberOfMonths={1}
        captionLayout="dropdown"
        selected={range}
        onSelect={(_, selectedDay) => handleDay(selectedDay)}
        // While picking the second date, soften days outside the ±maxRangeDays
        // window — a visual hint of the recommended span. They stay clickable
        // (clicking one re-anchors) and hover still works; this is a hint, not
        // a block.
        modifiers={
          anchor && maxRangeDays != null
            ? { outOfRange: (d: Date) => Math.abs(d.getTime() - anchor.getTime()) > maxRangeDays * 86_400_000 }
            : undefined
        }
        modifiersClassNames={{ outOfRange: "text-[var(--color-text-hint)]" }}
      />
      <div className="border-t border-[var(--color-border-default)] px-4 py-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-body-sm">Start time</label>
          <Input
            type="time"
            value={value?.startTime ?? ""}
            onChange={handleStartTime}
            disabled={!value?.from}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-body-sm">End time</label>
          <Input
            type="time"
            value={value?.endTime ?? ""}
            onChange={handleEndTime}
            disabled={!value?.from}
          />
        </div>
      </div>
    </div>
  )
}
