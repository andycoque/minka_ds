import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 [border-radius:var(--radius-button)] text-label whitespace-nowrap transition-all outline-none focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50 disabled:pointer-events-none aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-action-primary-default)] text-[var(--color-action-primary-foreground)] hover:bg-[var(--color-action-primary-hover)] active:bg-[var(--color-action-primary-pressed)] disabled:bg-[var(--color-action-primary-disabled)] disabled:text-[var(--color-text-disabled)]",
        destructive:
          "bg-[var(--color-action-destructive-default)] text-[var(--color-action-destructive-foreground)] hover:bg-[var(--color-action-destructive-hover)] active:bg-[var(--color-action-destructive-pressed)] disabled:bg-[var(--color-action-destructive-disabled)] disabled:text-[var(--color-text-disabled)] focus-visible:ring-[var(--color-border-error)]/20",
        outline:
          "border border-[var(--color-border-default)] bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-action-ghost-hover)] active:bg-[var(--color-action-ghost-pressed)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]",
        secondary:
          "bg-[var(--color-action-secondary-default)] text-[var(--color-action-secondary-foreground)] hover:bg-[var(--color-action-secondary-hover)] active:bg-[var(--color-action-secondary-pressed)] disabled:bg-[var(--color-action-secondary-disabled)] disabled:text-[var(--color-text-disabled)]",
        ghost:
          "bg-transparent text-[var(--color-action-ghost-foreground)] hover:bg-[var(--color-action-ghost-hover)] active:bg-[var(--color-action-ghost-pressed)] disabled:text-[var(--color-text-disabled)]",
        link:
          "text-[var(--color-text-link)] underline-offset-4 hover:text-[var(--color-text-link-hover)] hover:underline active:text-[var(--color-text-link-active)] disabled:text-[var(--color-text-disabled)]",
      },
      size: {
        default:   "h-9 px-4 py-2 has-[>svg]:px-3",
        xs:        "h-6 gap-1 px-2 text-label-sm has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm:        "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg:        "h-10 px-6 has-[>svg]:px-4",
        icon:      "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
