"use client"

import { useState } from "react"
import { InputOTP } from "minka-ds"

export function OtpDemo() {
  const [value, setValue] = useState("")
  const complete = value.length === 6
  const invalid  = complete && value !== "123456"
  const valid    = complete && value === "123456"

  return (
    <div className="flex flex-col gap-3">
      <InputOTP value={value} onChange={setValue} invalid={invalid} />
      <p className="text-caption text-[var(--color-text-muted)]">
        {!complete
          ? "Enter a 6-digit code (try 123456). Auto-advances, supports paste & backspace."
          : invalid
            ? <span className="text-[var(--color-feedback-error)]">Invalid code — try 123456.</span>
            : valid && <span className="text-[var(--color-feedback-success)]">Code accepted ✓</span>}
      </p>
    </div>
  )
}
