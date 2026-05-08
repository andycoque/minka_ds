import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 text-body-sm [border-radius:var(--radius-input)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-1 text-[var(--color-text-default)] shadow-xs transition-[color,box-shadow] outline-none",
        "placeholder:text-[var(--color-text-hint)]",
        "selection:bg-[var(--color-action-primary-default)] selection:text-[var(--color-action-primary-foreground)]",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-label-sm file:text-[var(--color-text-default)]",
        "focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[var(--color-bg-disabled)] disabled:text-[var(--color-text-disabled)] disabled:border-[var(--color-border-disabled)]",
        "aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
