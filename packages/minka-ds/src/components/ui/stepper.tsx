import * as React from "react"
import { cn } from "../../lib/utils"

interface StepperProps {
  /** Total number of steps, or per-step labels. */
  steps: number | string[]
  /** Current step, 1-based. Segments up to and including this fill. */
  current: number
  /** Optional caption shown beneath the bar. Falls back to the current step's
   *  label when `steps` is an array. */
  label?: React.ReactNode
  className?: string
}

/**
 * Segmented progress stepper: a row of thin rounded segments that fill as the
 * user advances through a multi-step flow, with an optional caption beneath.
 * Purely presentational — the parent owns the step state.
 */
function Stepper({ steps, current, label, className }: StepperProps) {
  const labels = Array.isArray(steps) ? steps : null
  const count = Array.isArray(steps) ? steps.length : steps
  const caption = label ?? (labels ? labels[current - 1] : undefined)

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: count }, (_, i) => {
          const filled = i < current
          return (
            <span
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-300 ease-out"
              style={{
                backgroundColor: filled
                  ? "var(--color-action-primary-default)"
                  : "var(--color-bg-disabled)",
              }}
            />
          )
        })}
      </div>
      {caption != null && (
        <span className="text-caption text-[var(--color-text-muted)]">{caption}</span>
      )}
    </div>
  )
}

export { Stepper }
export type { StepperProps }
