import * as React from "react"

import { cn } from "../../lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // `bg-bg-raised`, matching Input. This was `bg-transparent`, which is
        // invisible on a white page but shows whatever is behind it on any
        // textured or tinted surface, so the field stopped reading as a field.
        "flex field-sizing-content min-h-16 w-full [border-radius:var(--radius-input)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-2 text-body-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-[var(--color-text-hint)] focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
