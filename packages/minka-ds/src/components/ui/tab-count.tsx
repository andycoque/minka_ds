import * as React from "react"
import { cn } from "../../lib/utils"

interface TabCountProps {
  count: number
  className?: string
}

function TabCount({ count, className }: TabCountProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[var(--color-bg-disabled)] text-[var(--color-text-default)] text-[10px] font-semibold leading-none min-w-4 h-4 px-1 shrink-0",
        className
      )}
    >
      {count}
    </span>
  )
}

export { TabCount }
export type { TabCountProps }
