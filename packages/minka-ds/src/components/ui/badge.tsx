import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden [border-radius:var(--radius-badge)] border px-2 py-0.5 text-label-sm whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-bg-raised)] text-[var(--color-text-default)] border-transparent [a&]:hover:bg-[var(--color-action-secondary-hover)]",
        filled:
          "bg-[var(--color-action-primary-default)] text-[var(--color-action-primary-foreground)] border-transparent [a&]:hover:bg-[var(--color-action-primary-hover)]",
        secondary:
          "bg-[var(--color-bg-disabled)] text-[var(--color-text-default)] border-transparent",
        destructive:
          "bg-[var(--color-action-destructive-default)] text-[var(--color-action-destructive-foreground)] border-transparent focus-visible:ring-destructive/20 [a&]:hover:bg-[var(--color-action-destructive-hover)]",
        success:
          "bg-[var(--color-bg-success)] text-[var(--color-feedback-success)] border-transparent",
        warning:
          "bg-[var(--color-bg-warning)] text-[var(--color-text-default)] border-transparent",
        error:
          "bg-[var(--color-bg-error)] text-[var(--color-feedback-error)] border-transparent",
        info:
          "bg-[var(--color-bg-info)] text-[var(--color-feedback-info)] border-transparent",
        outline:
          "border-[var(--color-border-default)] text-[var(--color-text-default)] [a&]:hover:bg-[var(--color-action-ghost-hover)]",
        ghost:
          "border-transparent text-[var(--color-text-default)] [a&]:hover:bg-[var(--color-action-ghost-hover)]",
        link:
          "border-transparent text-[var(--color-text-link)] underline-offset-4 [a&]:hover:text-[var(--color-text-link-hover)] [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
