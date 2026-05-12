"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterChipProps =
  | {
      variant?: "filter"
      label: string
      values: { label: string; onRemove: () => void }[]
      onLabelClick?: () => void
      className?: string
    }
  | {
      variant: "clear-all"
      onClear: () => void
      className?: string
    }

function FilterChip(props: FilterChipProps) {
  if (props.variant === "clear-all") {
    const { onClear, className } = props
    return (
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "text-caption text-[var(--color-text-muted)] underline-offset-2 hover:underline cursor-pointer",
          className
        )}
      >
        Clear all
      </button>
    )
  }

  const { label, values, onLabelClick, className } = props

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={onLabelClick}
        className={cn(
          "text-caption text-[var(--color-text-muted)] underline-offset-2 hover:underline cursor-pointer",
          !onLabelClick && "pointer-events-none"
        )}
      >
        {label}:
      </button>
      {values.map((value, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-default)] px-2 py-0.5 text-caption text-[var(--color-text-default)]"
        >
          {value.label}
          <button
            type="button"
            onClick={value.onRemove}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] transition-colors"
            aria-label={`Remove ${value.label}`}
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

export { FilterChip }
