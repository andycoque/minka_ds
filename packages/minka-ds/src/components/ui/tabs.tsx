"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "../../lib/utils"

/**
 * Builds the fade mask for whichever edges currently clip content.
 *
 * Returns undefined when nothing is clipped, so no mask is applied at all — a mask is a
 * compositing layer, and there is no reason to pay for one when both ends are resolved.
 * Mirrors `PageHelp`'s `maskFor`, horizontal instead of vertical.
 */
// How far TabsList's wrapper pads each edge when that side's scroll button is
// showing (pl-5/pr-5 below) — shared with TabsTrigger's own scroll-into-view so
// the two agree on where "visible" actually ends. A tab landing flush with the
// SCROLL CONTAINER's true edge is not the same as landing flush with the
// READER'S visible edge once a button is floating on top of that space; only
// the reserved-edge boundary is the one a reader can actually see past.
const EDGE_RESERVE_PX = 20

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
    const row = el.firstElementChild
    const tabs = row ? (Array.from(row.children) as HTMLElement[]) : []
    const first = tabs[0]
    const last = tabs[tabs.length - 1]
    // Measured the same way scrollByTab decides its target: the LAST/FIRST TAB's own
    // edge against the container's edge, both via getBoundingClientRect. Not
    // scrollWidth/clientWidth (both integers, truncated) versus scrollLeft (fractional)
    // — that mix disagreed with the tab geometry by several px in practice (scrollWidth
    // includes the row's own padding/border, which the actual "is the last tab fully
    // visible" question has nothing to do with), so a button could keep rendering, and
    // re-clicking it would land on a no-op scroll, after every tab was already fully in
    // view by any measure a reader could perceive.
    const elRect = el.getBoundingClientRect()
    setEdges({
      left: !!first && first.getBoundingClientRect().left < elRect.left - 1,
      right: !!last && last.getBoundingClientRect().right > elRect.right + 1,
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

  // Click affordance for anyone without a trackpad's native horizontal-scroll gesture —
  // the fade alone tells you there is more, but not how to reach it. Scrolls by one tab
  // at a time rather than a fixed pixel amount, so it adapts to whatever widths the
  // triggers actually have instead of over- or under-shooting a real tab boundary.
  const scrollByTab = React.useCallback((direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    // The row's own children (the triggers) live one level down, inside the w-fit div —
    // scrollRef is the scrolling element itself, not the row, so its own .children is
    // that single wrapper div, not the triggers. Reach into it for the real trigger list.
    const row = el.firstElementChild
    const tabs = row ? Array.from(row.children) as HTMLElement[] : []
    // getBoundingClientRect() for BOTH edges, not clientWidth for one side: clientWidth
    // is always an integer (truncated), while getBoundingClientRect() is fractional, so
    // mixing them (rowLeft + clientWidth) computes a boundary up to ~1px more permissive
    // than the container's true right edge. A tab sitting almost exactly flush against
    // that true edge then reads as "still clipped" under the truncated math, gets handed
    // to scrollIntoView, and — because it is not actually clipped — the browser scrolls
    // it by nothing, which looked like the button had silently stopped working.
    const { left: rowLeft, right: rowRight } = el.getBoundingClientRect()
    const target =
      direction === "right"
        // First tab whose right edge is still beyond the visible area's right edge —
        // i.e. the next one not fully in view — scrolled just enough to bring it flush.
        ? tabs.find(t => t.getBoundingClientRect().right > rowRight + 1)
        // Same from the other side: last tab still starting before the visible area's
        // left edge.
        : [...tabs].reverse().find(t => t.getBoundingClientRect().left < rowLeft - 1)
    if (!target) return
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    // scrollIntoView alone lands the target tab exactly flush with the edge — correct
    // by distance, but it reads as still half-clipped: flush against the fade/button is
    // visually indistinguishable from "still cut off" until the reader looks closely.
    // scrollBy an extra 20% of that tab's own width past flush so it lands with real
    // clearance, using the same getBoundingClientRect the flush-detection above already
    // trusts rather than introducing a second measurement (e.g. offsetWidth) that could
    // disagree with it.
    const targetRect = target.getBoundingClientRect()
    const overshoot = targetRect.width * 0.2
    const distance =
      direction === "right"
        ? targetRect.right - rowRight + overshoot
        : rowLeft - targetRect.left + overshoot
    el.scrollBy({ left: direction === "right" ? distance : -distance, behavior })
  }, [])

  return (
    <div
      className={cn(
        "relative min-w-0",
        // Real layout padding, not just extra room inside this box: a floating
        // button is positioned via `translate`, which only moves it visually and
        // never changes the LAYOUT box a flex sibling measures against. Without
        // this, a caller using plain `justify-between` (no explicit gap) between
        // Tabs and something beside it — the liquidity page's timestamp label is
        // the case that surfaced this — had nothing reserving space for the
        // button, so it rendered flush against that neighbor with a caller-owned
        // `gap-3` being the only thing that happened to save it elsewhere.
        edges.left && "pl-5",
        edges.right && "pr-5"
      )}
    >
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

      {/* Floating, not inline: pushing the chrome box's own layout every time a button
          appears/disappears would shift whatever sits next to Tabs (a CTA, a count) on
          every scroll-position change. Overlapping the fade instead keeps the row's own
          footprint constant regardless of scroll state.

          Inset INWARD (left-1.5/right-1.5) with ONLY a vertical translate, not a
          horizontal one: `translate-x-1/2` (tried first) shifts the button by half its
          OWN width AFTER the left/right offset positions it, which moved it back
          outside the padded space `pl-5`/`pr-5` above just reserved — net result, still
          overlapping whatever sat beside Tabs, just by a smaller margin than the flush
          version. left-1.5/right-1.5 alone, with no horizontal translate, keeps the
          whole button within that reserved padding. */}
      {edges.left && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Scroll tabs left"
          onClick={() => scrollByTab("left")}
          className="absolute top-1/2 left-1.5 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] text-[var(--color-text-muted)] shadow-[var(--shadow-popover)] transition-colors hover:text-[var(--color-text-default)]"
        >
          <ChevronLeftIcon className="size-3.5" />
        </button>
      )}
      {edges.right && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Scroll tabs right"
          onClick={() => scrollByTab("right")}
          className="absolute top-1/2 right-1.5 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] text-[var(--color-text-muted)] shadow-[var(--shadow-popover)] transition-colors hover:text-[var(--color-text-default)]"
        >
          <ChevronRightIcon className="size-3.5" />
        </button>
      )}
    </div>
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
        // Bring a partially-clipped tab fully into view on select — moving only as
        // far as needed to clear whichever edge is cut off, and doing nothing at
        // all for a tab that is already fully visible.
        //
        // NOT native scrollIntoView({inline: "nearest"}): that computes "visible"
        // against the SCROLL CONTAINER's own box, with no idea that a floating
        // scroll button (an absolutely-positioned sibling, not part of the
        // container's own layout) may be sitting on top of part of it. It landed
        // a just-selected tab flush with the true container edge while a chevron
        // button still covered the last ~20px of it — "flush" by the DOM's
        // measure, still visibly clipped by the reader's. Measuring against the
        // reserved-edge boundary instead (EDGE_RESERVE_PX) is the fix used by
        // scrollByTab above; this reuses the same idea for the auto-scroll-on-
        // select path so the two cannot disagree about where "visible" ends.
        // rAF, not measured synchronously in this handler: selecting a tab can
        // itself change the ROW's own width (the active trigger goes bold, per
        // `data-[state=active]:font-bold` — a wider label), so the overflow this
        // scroll is meant to fix may not exist yet in the DOM at click time. React
        // applies that state change before the browser's next paint, so one rAF
        // is enough to measure against the real, post-selection layout instead of
        // a stale one — this was previously the difference between correctly
        // clearing the clipped edge and moving a few px in the wrong direction
        // because a tab that was not yet overflowing looked already "visible".
        requestAnimationFrame(() => {
          const trigger = ref.current
          const scrollEl = trigger?.closest('[data-slot="tabs-list"]') as HTMLElement | null
          if (!trigger || !scrollEl) return
          const triggerRect = trigger.getBoundingClientRect()
          const scrollRect = scrollEl.getBoundingClientRect()
          const visibleLeft = scrollRect.left + EDGE_RESERVE_PX
          const visibleRight = scrollRect.right - EDGE_RESERVE_PX
          let distance = 0
          if (triggerRect.right > visibleRight) distance = triggerRect.right - visibleRight
          else if (triggerRect.left < visibleLeft) distance = triggerRect.left - visibleLeft
          if (distance === 0) return
          scrollEl.scrollBy({
            left: distance,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          })
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
