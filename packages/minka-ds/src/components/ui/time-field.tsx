"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * A 24-hour time field.
 *
 * NOT `<input type="time">`. That control renders AM/PM whenever the browser decides
 * the locale is 12-hour, and it decides that from OS settings — `lang="en-GB"` on the
 * input is ignored by Chrome, and setting `<html lang>` would change every other
 * locale-sensitive thing in the app to fix one input. Since the product writes times
 * as "14:12" everywhere else, the only reliable way to get that is to render the text
 * ourselves.
 *
 * Value is always "HH:MM" 24-hour, or "" when empty — the same contract
 * `type="time"` had, so callers do not change.
 */
function TimeField({
  value,
  onChange,
  disabled,
  className,
  placeholder = "00:00",
  "aria-invalid": ariaInvalid,
  ...props
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
} & Omit<React.ComponentProps<"input">, "value" | "onChange" | "type">) {
  // Local draft so a half-typed value ("1", "14:") is not fought by the parent. The
  // parent only hears about complete, valid times.
  const [draft, setDraft] = React.useState(value)
  // Track the last value we told the parent, so an external change (a reset, or the
  // picker defaulting to 00:00) still lands while typing is idle.
  const lastSent = React.useRef(value)
  React.useEffect(() => {
    if (value !== lastSent.current) {
      setDraft(value)
      lastSent.current = value
    }
  }, [value])

  function commit(next: string) {
    lastSent.current = next
    onChange(next)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Digits and one colon only. Typing "1430" auto-formats to "14:30", so the colon
    // is optional rather than something to remember.
    const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 4)
    if (digits === "") { setDraft(""); commit(""); return }

    const m = digits.length > 2 ? /^(\d{2})(\d{1,2})$/.exec(digits) : null
    if (!m) { setDraft(digits); return }

    // Clamp the DRAFT, not only the committed value: typing "2400" must show "23:00",
    // not display 24:00 while sending 23:00.
    const h = Math.min(23, Number(m[1]))
    const min = Math.min(59, Number(m[2].padEnd(2, "0")))
    const shown = m[2].length === 2
      ? `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`
      : `${String(h).padStart(2, "0")}:${m[2]}`
    setDraft(shown)
    if (m[2].length === 2) commit(shown)
  }

  /** Pad a partial entry on blur: "9" -> "09:00", "14:3" -> "14:30". */
  function handleBlur() {
    if (draft === "") { commit(""); return }
    const digits = draft.replace(/[^\d]/g, "")
    if (digits.length === 0) { setDraft(""); commit(""); return }
    const h = Math.min(23, Number(digits.slice(0, 2)))
    const min = digits.length > 2 ? Math.min(59, Number(digits.slice(2).padEnd(2, "0"))) : 0
    const out = `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`
    setDraft(out)
    commit(out)
  }

  /** Up/down nudge the minutes, the same affordance the native control has. */
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return
    e.preventDefault()
    const m = /^(\d{1,2}):?(\d{0,2})$/.exec(draft || "00:00")
    if (!m) return
    const base = (Number(m[1] || 0) * 60 + Number(m[2] || 0) + (e.key === "ArrowUp" ? 1 : -1) + 1440) % 1440
    const out = `${String(Math.floor(base / 60)).padStart(2, "0")}:${String(base % 60).padStart(2, "0")}`
    setDraft(out)
    commit(out)
  }

  return (
    <input
      data-slot="time-field"
      // `text`, not `time`: see the note above. inputMode numeric brings up the number
      // pad on touch without the locale-formatted control.
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      value={draft}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-invalid={ariaInvalid}
      // Same classes as Input, so it is visually identical to every other field.
      className={cn(
        "h-9 w-full min-w-0 [border-radius:var(--radius-input)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-1 text-body-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-[var(--color-action-primary-default)] selection:text-[var(--color-action-primary-foreground)] placeholder:text-[var(--color-text-hint)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
        "aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
        className
      )}
      {...props}
    />
  )
}

export { TimeField }
