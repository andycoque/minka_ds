import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full text-body-sm [border-radius:var(--radius-input)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-2 text-[var(--color-text-default)] shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-[var(--color-text-hint)]",
        "focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
        "disabled:cursor-not-allowed disabled:bg-[var(--color-bg-disabled)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-disabled)]",
        "aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
