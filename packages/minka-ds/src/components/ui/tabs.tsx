"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center p-[3px] text-[var(--color-text-muted)] group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] shadow-xs",
        subtle:  "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-base)]",
        line:    "gap-1 rounded-none bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 [border-radius:var(--radius-button)] border border-transparent px-2 py-1 text-body-sm whitespace-nowrap transition-all outline-none",
        "text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] data-[state=active]:font-bold",
        "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        "focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
        "disabled:pointer-events-none disabled:text-[var(--color-text-disabled)]",
        // default variant — active tab gets raised surface
        "group-data-[variant=default]/tabs-list:data-[state=active]:bg-[var(--color-bg-inverted)] group-data-[variant=default]/tabs-list:data-[state=active]:text-[var(--color-bg-raised)] group-data-[variant=default]/tabs-list:data-[state=active]:shadow-[var(--shadow-card)]",
        // subtle variant — active tab gets raised bg with default text, no inversion
        "group-data-[variant=subtle]/tabs-list:data-[state=active]:bg-[var(--color-bg-raised)] group-data-[variant=subtle]/tabs-list:data-[state=active]:text-[var(--color-text-default)] group-data-[variant=subtle]/tabs-list:data-[state=active]:shadow-xs",
        // line variant — active tab is transparent, underline indicator
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-[var(--color-text-default)] group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none",
        // underline indicator for line variant
        "after:absolute after:bg-[var(--color-text-default)] after:opacity-0 after:transition-opacity",
        "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5",
        "group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5",
        "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {/* Grid overlap reserves bold width at all times — prevents layout shift on weight change */}
      <span className="grid items-center justify-items-center [grid-template-areas:'stack']">
        <span className="[grid-area:stack] invisible font-bold pointer-events-none select-none" aria-hidden>{children}</span>
        <span className="[grid-area:stack]">{children}</span>
      </span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
