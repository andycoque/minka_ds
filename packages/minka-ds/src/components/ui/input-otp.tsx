"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

interface InputOTPProps {
  /** Number of digit boxes. */
  length?: number
  value: string
  onChange: (value: string) => void
  /** Fires when all boxes are filled. */
  onComplete?: (value: string) => void
  invalid?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
}

function InputOTP({
  length = 6,
  value,
  onChange,
  onComplete,
  invalid,
  disabled,
  autoFocus,
  className,
}: InputOTPProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? "")

  function setAt(index: number, char: string) {
    const next = digits.slice()
    next[index] = char
    const joined = next.join("").slice(0, length)
    onChange(joined)
    if (joined.length === length) onComplete?.(joined)
  }

  function handleChange(index: number, raw: string) {
    const char = raw.replace(/\D/g, "").slice(-1) // keep last typed digit
    if (!char) return
    setAt(index, char)
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault()
      if (digits[index]) {
        setAt(index, "")
      } else if (index > 0) {
        refs.current[index - 1]?.focus()
        setAt(index - 1, "")
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      refs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!pasted) return
    onChange(pasted)
    if (pasted.length === length) onComplete?.(pasted)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div data-slot="input-otp" className={cn("flex items-center gap-2", className)} onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={d}
          disabled={disabled}
          autoFocus={autoFocus && i === 0}
          aria-invalid={invalid || undefined}
          aria-label={`Digit ${i + 1}`}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onFocus={e => e.target.select()}
          className={cn(
            "size-11 text-center text-heading-4 [border-radius:var(--radius-input)] border bg-[var(--color-bg-raised)] outline-none transition-[color,box-shadow]",
            "border-[var(--color-border-default)]",
            "focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
            "aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      ))}
    </div>
  )
}

export { InputOTP }
export type { InputOTPProps }
