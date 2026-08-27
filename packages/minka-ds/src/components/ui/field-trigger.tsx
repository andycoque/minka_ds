"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * FieldTrigger — a button that looks like a form field, for anything that opens a picker.
 *
 * Promoted from three hand-rolled copies in studio (the expiry pickers in payment
 * instruments and api keys, and the date fields in the report dialog). Each had pasted the
 * same ~400-character class string, and each had drifted from `SelectTrigger`: no focus
 * ring, no invalid ring, no disabled styling. So a date field sitting next to a select did
 * not match it, and the divergence was invisible until you tabbed into one.
 *
 * This mirrors `SelectTrigger`'s treatment deliberately — same height, radius, fill,
 * placeholder colour, focus and invalid rings — so a picker field and a select field are
 * indistinguishable at rest and behave the same on interaction. If `SelectTrigger` changes,
 * this should change with it.
 *
 * Deliberately NOT a date picker. The three call sites open different things: a full
 * date-and-time picker, the same with its time row hidden, and a bare calendar. Forcing
 * those into one component would mean a props object that is really three components in a
 * trench coat. The TRIGGER is what they share, so the trigger is what this owns.
 */

interface FieldTriggerProps
  extends Omit<React.ComponentProps<"button">, "children" | "value"> {
  /** The current value, rendered in the default text colour. */
  value?: React.ReactNode
  /** Shown in the hint colour when `value` is empty. */
  placeholder?: string
  /** Trailing glyph, usually a calendar or clock. */
  icon?: React.ReactNode
  /** Matches `SelectTrigger`'s two heights. */
  size?: "sm" | "default"
}

function FieldTrigger({
  value,
  placeholder,
  icon,
  size = "default",
  className,
  ...props
}: FieldTriggerProps) {
  return (
    <button
      type="button"
      data-slot="field-trigger"
      data-size={size}
      // Marks the empty state for styling, the same signal Radix sets on a select.
      data-placeholder={value == null || value === "" ? "" : undefined}
      className={cn(
        "flex w-full items-center justify-between gap-2 [border-radius:var(--radius-input)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-2 text-body-sm text-[var(--color-text-default)] shadow-xs transition-[color,box-shadow] outline-none",
        "data-[size=default]:h-9 data-[size=sm]:h-8",
        "hover:border-[var(--color-border-strong)]",
        "focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
        "disabled:cursor-not-allowed disabled:bg-[var(--color-bg-disabled)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-disabled)]",
        "aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "truncate",
          value == null || value === ""
            ? "text-[var(--color-text-hint)]"
            : "text-[var(--color-text-default)]"
        )}
      >
        {value == null || value === "" ? placeholder : value}
      </span>
      {icon && (
        <span className="shrink-0 text-[var(--color-text-muted)] [&>svg]:size-4">{icon}</span>
      )}
    </button>
  )
}

export { FieldTrigger }
export type { FieldTriggerProps }
