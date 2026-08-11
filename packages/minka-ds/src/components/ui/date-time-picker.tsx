"use client"

import * as React from "react"
import { Calendar } from "./calendar"
import { TimeField } from "./time-field"
import { cn } from "../../lib/utils"

export interface DateTimeValue {
  date: Date | null
  /** "HH:MM", 24-hour. Empty only before a date has been chosen. */
  time: string
}

/** Applied when a date is picked with no time yet, so the field is never empty. */
const DEFAULT_TIME = "00:00"

interface DateTimePickerProps {
  value?: DateTimeValue | null
  onChange: (value: DateTimeValue | null) => void
  className?: string
  /**
   * Days to disable, forwarded to the calendar (react-day-picker matcher).
   * e.g. `{ before: new Date() }` to prevent picking a past date.
   */
  disabled?: React.ComponentProps<typeof Calendar>["disabled"]
}

export function DateTimePicker({
  value,
  onChange,
  className,
  disabled,
}: DateTimePickerProps) {
  function handleDaySelect(selected: Date | undefined) {
    if (!selected) { onChange(null); return }
    // Default the time to midnight rather than leaving it empty. An empty
    // `type="time"` renders the browser's "--:-- --", which reads as broken next to a
    // chosen date and gives nothing to edit from; "00:00" is both a real value and the
    // start-of-day most callers already assume when no time is given.
    onChange({ date: selected, time: value?.time || DEFAULT_TIME })
  }

  function handleTimeValue(time: string) {
    if (!value?.date) return
    onChange({ ...value, time })
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
        disabled={disabled}
      />
      <div className="border-t border-[var(--color-border-default)] px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-body-sm">Time</label>
          {/* TimeField, not <input type="time">: that control shows AM/PM whenever the
              browser reads the locale as 12-hour, which it takes from OS settings and
              which a per-input lang attribute does not override. TimeField renders the
              text itself, so "14:30" is guaranteed. */}
          <TimeField
            value={value?.time ?? ""}
            onChange={handleTimeValue}
            disabled={!value?.date}
          />
        </div>
      </div>
    </div>
  )
}
