"use client"

import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-label select-none text-[var(--color-text-default)]",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-[var(--color-text-disabled)]",
        "peer-disabled:cursor-not-allowed peer-disabled:text-[var(--color-text-disabled)]",
        className
      )}
      {...props}
    />
  )
}

export { Label }
