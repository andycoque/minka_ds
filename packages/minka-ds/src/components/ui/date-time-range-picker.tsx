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

  function handleRangeSelect(selected: DateRange | undefined) {
    if (!selected?.from) { onChange(null); return }
    onChange({
      from: selected.from,
      to: selected.to ?? selected.from,
      startTime: value?.startTime ?? "",
      endTime:   value?.endTime   ?? "",
    })
  }

  function handleStartTime(e: React.ChangeEvent<HTMLInputElement>) {
    if (!value?.from) return
    onChange({ ...value, startTime: e.target.value })
  }

  function handleEndTime(e: React.ChangeEvent<HTMLInputElement>) {
    if (!value?.from) return
    onChange({ ...value, endTime: e.target.value })
  }

  const disabledAfter =
    maxRangeDays && range?.from
      ? { after: new Date(range.from.getTime() + maxRangeDays * 86_400_000) }
      : undefined

  return (
    <div className={cn(
      "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] overflow-hidden w-fit",
      className
    )}>
      <Calendar
        mode="range"
        numberOfMonths={1}
        captionLayout="label"
        selected={range}
        onSelect={handleRangeSelect}
        disabled={disabledAfter}
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
