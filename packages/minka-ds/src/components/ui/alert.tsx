import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const alertVariants = cva(
  "relative w-full [border-radius:var(--radius-card)] border px-4 py-3 text-body-sm grid grid-cols-[0_1fr] has-[>svg]:grid-cols-[1rem_1fr] gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-bg-raised)] border-[var(--color-border-default)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-text-muted)]",
        info:
          "bg-[var(--color-bg-info)] border-[var(--color-border-info)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-feedback-info)]",
        success:
          "bg-[var(--color-bg-success)] border-[var(--color-border-success)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-feedback-success)]",
        warning:
          "bg-[var(--color-bg-warning)] border-[var(--color-border-warning)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-text-default)]",
        error:
          "bg-[var(--color-bg-error)] border-[var(--color-border-error)] text-[var(--color-text-default)] [&>svg]:text-[var(--color-feedback-error)]",
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
      className={cn("col-start-2 text-label", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 text-caption-light text-[var(--color-text-default)] [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
