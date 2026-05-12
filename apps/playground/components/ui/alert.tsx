import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full [border-radius:var(--radius-card)] border px-4 py-3 text-body-sm grid grid-cols-[0_1fr] has-[>svg]:grid-cols-[1.25rem_1fr] gap-x-3 gap-y-1 items-start [&>svg]:mt-0.5 [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-bg-raised)] border-[var(--color-border-default)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-text-muted)]",
        info:
          "bg-[var(--color-bg-info)] border-[var(--color-border-info)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-text-default)]",
        success:
          "bg-[var(--color-bg-success)] border-[var(--color-border-success)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-text-default)]",
        warning:
          "bg-[var(--color-bg-warning)] border-[var(--color-border-warning)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-text-default)]",
        error:
          "bg-[var(--color-bg-error)] border-[var(--color-border-error)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-text-default)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 text-body-sm opacity-80 [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
