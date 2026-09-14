"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

/**
 * Builds the fade mask for whichever edges currently clip content.
 *
 * Returns undefined when nothing is clipped, so no mask is applied at all — a mask is a
 * compositing layer, and there is no reason to pay for one when both ends are resolved.
 * Mirrors `PageHelp`'s `maskFor`, horizontal instead of vertical.
 */
function maskForX({ left, right }: { left: boolean; right: boolean }): string | undefined {
  if (!left && !right) return undefined
  const stops: string[] = []
  stops.push(left ? "transparent 0" : "#000 0")
  if (left) stops.push("#000 1.25rem")
  if (right) stops.push("#000 calc(100% - 1.25rem)", "transparent 100%")
  else stops.push("#000 100%")
  return `linear-gradient(to right, ${stops.join(", ")})`
}

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
        // min-w-0: a flex item's default min-width is its content's natural size, which
        // overrides any min-w-0 set further down the tree (on TabsList). Without it here,
        // a page's own `flex justify-between` row could never actually compress this past
        // its tabs' full combined width — the exact bug TabsList's own scroll container
        // was built to prevent, just reasserted one level up.
        "group/tabs flex min-w-0 gap-2 data-[orientation=horizontal]:flex-col",
        className
      )}
      {...props}
    />
  )
}

// Split in two because the scroll container and the flex row it scrolls can no longer be
// the same element (see TabsList): `tabsListVariants` is the outer box's CHROME (padding,
// border, background, radius, height) — nothing that depends on being a flex container.
// `tabsListRowVariants` is the actual flex row — alignment and gap — applied to the inner
// div that holds the triggers at their natural width.
const tabsListVariants = cva(
  // w-full, not w-fit — this took three attempts to get right, so the reasoning is worth
  // spelling out.
  //
  // `Tabs` root is `flex-col` for horizontal orientation, which makes TabsList's WIDTH a
  // CROSS-axis property, not a main-axis one. flex-shrink and min-width — the tools that
  // let an item concede space to a sibling — only apply on the MAIN axis. On the cross
  // axis, sizing is governed by align-items (stretch, by default) versus the item's own
  // width. An explicit width always wins over stretch, so w-fit here was telling TabsList
  // to ignore whatever narrower box `Tabs` root's own (correctly working) shrink math had
  // computed, and just render at its full content width regardless — which is exactly why
  // overflow-x-auto had nothing to clip: TabsList was never actually narrower than its
  // content in the first place, no matter how much the tabs overflowed the page.
  //
  // w-full makes TabsList stretch to fill `Tabs` root's box instead — genuinely capped at
  // whatever width the surrounding layout leaves it, which is what gives overflow-x-auto a
  // real edge to clip against. The short-list margin bug (two attempts ago) is solved a
  // different way now: by the INNER row staying w-fit with default left alignment (see
  // tabsListRowVariants) rather than by constraining this outer element's width at all.
  //
  // max-w-fit caps the OTHER direction: w-full alone means TabsList always fills whatever
  // `Tabs` root is given, even when that is far more than the tabs need (e.g. a caller
  // wrapping `Tabs` in its own `max-w-md` for unrelated layout reasons) — visible empty
  // space to the right of a short, left-packed row. max-width: fit-content still lets the
  // element shrink below its content when a narrower container demands it (this is a
  // max, not a fixed width, so it never fights the overflow case above), it only stops
  // growth past what the tabs actually need when nothing is squeezing it.
  "group/tabs-list inline-flex w-full max-w-fit min-w-0 p-[3px] text-[var(--color-text-muted)] group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] shadow-xs",
        subtle:  "[border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-base)]",
        line:    "rounded-none bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsListRowVariants = cva(
  // w-fit and default (left) alignment, deliberately NOT stretched or centered: this row
  // is always exactly as wide as its own tabs. The outer TabsList is the one that now
  // stretches to fill its container (see tabsListVariants — w-full there, for real reasons
  // involving flex-col's cross axis); if this inner row also stretched or centered, a short
  // tab list would be back to the "active tab flush against one edge" bug two attempts of
  // this fix already produced. Left this row alone once the OUTER element's width was the
  // actual problem, and it has been correct since.
  // h-full: TabsTrigger sizes itself with h-[calc(100%-1px)], resolved against ITS
  // containing block — this row, not the outer h-9 element two levels up. Without an
  // explicit height here the row has none of its own (a flex container's height is
  // otherwise just whatever its content needs), so every trigger's percentage height
  // had nothing real to resolve against and fell back to its own content size instead
  // of the uniform 9px-minus-padding tab height every trigger is meant to share. That
  // is what actually produced the broken margins: the active tab's background/shadow
  // box was a different height than its siblings, not (as first suspected) a width or
  // centering issue.
  "flex h-full w-fit items-center group-data-[orientation=vertical]/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "",
        subtle: "",
        line: "gap-1",
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
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  // Whether tabs are clipped at each edge of the scroll region, so the fade only appears
  // where there is something to scroll INTO. Ported from PageHelp's `edges` pattern.
  // A single flag would either fog the first tab at rest or leave the last tab
  // permanently half-visible.
  //
  // Horizontal only: this addresses the overlap bug on `orientation="horizontal"`, the
  // only orientation any caller in this codebase currently uses. `orientation="vertical"`
  // still renders (untouched otherwise) but has no scroll/fade help of its own here — its
  // overflow axis is y, and extending this to that axis with no real usage to verify
  // against would be guessing at a shape nobody has needed yet.
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [edges, setEdges] = React.useState({ left: false, right: false })

  const syncEdges = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setEdges({
      left: scrollLeft > 1,
      // 1px of slack: fractional scroll widths mean exact equality never lands.
      right: scrollLeft + clientWidth < scrollWidth - 1,
    })
  }, [])

  // Re-measure on mount, on scroll, and whenever the row or its content resizes — a
  // trigger's label changing width (e.g. bold on select) or the container being given
  // less room by a sibling both change what is clipped, without necessarily a scroll.
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    syncEdges()
    el.addEventListener("scroll", syncEdges, { passive: true })
    const ro = new ResizeObserver(syncEdges)
    ro.observe(el)
    for (const child of Array.from(el.children)) ro.observe(child)
    return () => {
      el.removeEventListener("scroll", syncEdges)
      ro.disconnect()
    }
  }, [syncEdges])

  return (
    <TabsPrimitive.List
      ref={scrollRef}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        tabsListVariants({ variant }),
        // Scrollable, native scrollbar hidden: a visible bar under a 36px-tall tab row
        // would eat into the row rather than sit politely under it, unlike `ds-scroll`'s
        // taller panels. The mask is the affordance instead — direction-aware, so it only
        // shows where there genuinely is more to scroll to.
        "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      style={{
        maskImage: maskForX(edges),
        WebkitMaskImage: maskForX(edges),
      }}
      {...props}
    >
      {/* The actual row of triggers, at its natural width — this is what scrolls inside
          the (possibly narrower) container above. Kept as a separate element from the
          scroll/mask container because Radix's Tabs.List renders a single node, and that
          node has to be the one with overflow-x-auto for the mask and scroll listener to
          agree on the same box. */}
      <div className={tabsListRowVariants({ variant })}>{children}</div>
    </TabsPrimitive.List>
  )
}

function TabsTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const ref = React.useRef<HTMLButtonElement>(null)

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      data-slot="tabs-trigger"
      onClick={(e) => {
        onClick?.(e)
        // Bring a partially-clipped tab fully into view on select. `inline: "nearest"`
        // is the point: it moves only as far as needed to clear whichever edge is cut
        // off, and does nothing at all for a tab that is already fully visible — unlike
        // "center", which would shift an already-visible row for no reason.
        ref.current?.scrollIntoView({
          inline: "nearest",
          block: "nearest",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }}
      className={cn(
        // flex-1 = flex: 1 1 0%. The 0% basis only matters when there is free space to
        // grow into, which never happens now — the row is always w-fit, exactly its
        // tabs' combined width, so flex-grow has nothing to distribute either way.
        // shrink-0 is what actually matters: without it, a 0% basis has nothing to fall
        // back to except shrinking below the trigger's own label width if anything ever
        // squeezes the row (the browser's flex algorithm can do this before overflow
        // kicks in). Pins the floor to the trigger's natural content size.
        "relative inline-flex h-[calc(100%-1px)] flex-1 shrink-0 items-center justify-center gap-1.5 [border-radius:var(--radius-button)] border border-transparent px-2 py-1 text-body-sm whitespace-nowrap transition-all outline-none",
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
      {/* Grid overlap reserves bold width at all times — prevents layout shift on weight change.
          Each stacked layer is itself an inline-flex row, not plain inline content: a label
          plus a TabCount are two separate children, and without a flex row here they just fall
          back to normal text flow — no gap between them, and the count's own box (it centers
          only ITS OWN content) sits on the text's baseline rather than centered against it. */}
      <span className="grid items-center justify-items-center [grid-template-areas:'stack']">
        <span
          className="[grid-area:stack] invisible inline-flex items-center gap-1.5 font-bold pointer-events-none select-none"
          aria-hidden
        >
          {children}
        </span>
        <span className="[grid-area:stack] inline-flex items-center gap-1.5">{children}</span>
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

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants, tabsListRowVariants }
