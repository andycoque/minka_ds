import * as React from "react"
import { cn } from "@/lib/utils"

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center gap-1 h-5 font-sans [border-radius:var(--radius-tooltip)] border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] px-1.5 text-caption text-[var(--color-text-muted)]",
        className
      )}
    >
      {children}
    </kbd>
  )
}
