"use client"

import * as React from "react"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { cn } from "../../lib/utils"

export interface DateTimeValue {
  date: Date | null
  time: string
}

interface DateTimePickerProps {
  value?: DateTimeValue | null
  onChange: (value: DateTimeValue | null) => void
  className?: string
}

export function DateTimePicker({
  value,
  onChange,
  className,
}: DateTimePickerProps) {
  function handleDaySelect(selected: Date | undefined) {
    if (!selected) { onChange(null); return }
    onChange({ date: selected, time: value?.time ?? "" })
  }

  function handleTime(e: React.ChangeEvent<HTMLInputElement>) {
    if (!value?.date) return
    onChange({ ...value, time: e.target.value })
  }

  return (
    <div className={cn(
      "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] overflow-hidden w-fit",
      className
    )}>
      <Calendar
        mode="single"
        captionLayout="label"
        selected={value?.date ?? undefined}
        onSelect={handleDaySelect}
      />
      <div className="border-t border-[var(--color-border-default)] px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-body-sm">Time</label>
          <Input
            type="time"
            value={value?.time ?? ""}
            onChange={handleTime}
            disabled={!value?.date}
          />
        </div>
      </div>
    </div>
  )
}
