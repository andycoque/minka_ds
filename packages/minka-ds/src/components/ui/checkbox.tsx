"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { CheckIcon } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * A checkbox, for acknowledging or selecting. Distinct from Switch: a switch turns a
 * setting on and stays that way, a checkbox records a one-off answer — so a consent
 * or acknowledgement gate is a checkbox, not a toggle.
 *
 * Same focus, disabled and checked tokens as Switch so the two read as siblings.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 cursor-pointer [border-radius:var(--radius-tag)] border border-[var(--color-border-strong)] shadow-xs transition-[color,background-color,border-color,box-shadow] outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50 focus-visible:border-[var(--color-border-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-[var(--color-action-primary-default)] data-[state=checked]:bg-[var(--color-action-primary-default)]",
        "aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-[var(--color-text-inverse)]"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
