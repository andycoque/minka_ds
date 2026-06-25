"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent } from "./collapsible"
import { Button } from "./button"
import { cn } from "../../lib/utils"

// A composed expand/collapse panel: a header row (title + optional subtitle on
// the left, optional meta + chevron on the right) over a styled body that
// expands. Built on the DS Collapsible primitive. Domain-agnostic — pass any
// content as children.
//
// When rendered inside an <ExpandablePanelGroup>, panels drop their own border +
// rounding (the Group owns the frame + shared dividers).

const GroupContext = React.createContext(false)

export interface ExpandablePanelProps {
  title: React.ReactNode
  /** Secondary line under the title (e.g. a timestamp). */
  subtitle?: React.ReactNode
  /** Right-aligned meta beside the chevron (e.g. "1 proof"). */
  meta?: React.ReactNode
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Controlled open state (pair with onOpenChange). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Body content, revealed when expanded. */
  children?: React.ReactNode
  className?: string
  /** Extra classes for the body region. */
  contentClassName?: string
}

function ExpandablePanel({
  title, subtitle, meta, defaultOpen = false, open, onOpenChange, children, className, contentClassName,
}: ExpandablePanelProps) {
  // Controlled or uncontrolled open state. The whole header row toggles it; the
  // chevron is the DS ghost icon Button (carries the hover), wired to the same state.
  const [internal, setInternal] = React.useState(defaultOpen)
  const isOpen = open ?? internal
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternal(next)
    onOpenChange?.(next)
  }
  const toggle = () => setOpen(!isOpen)
  const inGroup = React.useContext(GroupContext)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setOpen}
      data-slot="expandable-panel"
      className={cn(
        "overflow-hidden bg-[var(--color-bg-raised)]",
        // standalone: own border + rounded frame. In a group, the Group owns the
        // frame and the shared dividers, so the panel is borderless/square.
        !inGroup && "[border-radius:var(--radius-card)] border border-[var(--color-border-default)]",
        className,
      )}
    >
      <style>{`
        @keyframes expandable-down { from { height: 0 } to { height: var(--radix-collapsible-content-height) } }
        @keyframes expandable-up   { from { height: var(--radix-collapsible-content-height) } to { height: 0 } }
        [data-slot="expandable-panel-content"][data-state="open"]  { animation: expandable-down .22s ease-out }
        [data-slot="expandable-panel-content"][data-state="closed"]{ animation: expandable-up .2s ease-in }
      `}</style>

      {/* Header — the whole row is clickable; only the chevron Button shows hover. */}
      <div
        data-slot="expandable-panel-header"
        onClick={toggle}
        className="flex w-full cursor-pointer items-center gap-4 px-5 py-3.5 text-left select-none"
      >
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <span className="text-label text-[var(--color-text-default)]">{title}</span>
          {subtitle && <span className="truncate text-caption-light text-[var(--color-text-muted)]">{subtitle}</span>}
        </div>
        {meta && <span className="shrink-0 text-overline text-[var(--color-text-muted)]">{meta}</span>}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={isOpen ? "Collapse" : "Expand"}
          aria-expanded={isOpen}
          onClick={(e) => { e.stopPropagation(); toggle() }}
        >
          <ChevronDown className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")} />
        </Button>
      </div>

      {/* Body — white like the header, no divider */}
      <CollapsibleContent data-slot="expandable-panel-content" className="overflow-hidden">
        <div className={cn("bg-[var(--color-bg-raised)] px-5 pb-4", contentClassName)}>
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

// A stacked group of ExpandablePanels that read as one connected unit: the
// group owns the outer border + rounded corners (top of first / bottom of last),
// inner edges are square, and adjacent panels share a single divider. Children
// drop their own border/rounding via context. `overflow-hidden` clips the inner
// panels' square corners to the group's rounded frame.
export interface ExpandablePanelGroupProps {
  children: React.ReactNode
  className?: string
}

function ExpandablePanelGroup({ children, className }: ExpandablePanelGroupProps) {
  return (
    <GroupContext.Provider value={true}>
      <div
        data-slot="expandable-panel-group"
        className={cn(
          "overflow-hidden [border-radius:var(--radius-card)] border border-[var(--color-border-default)]",
          "divide-y divide-[var(--color-border-default)]",
          className,
        )}
      >
        {children}
      </div>
    </GroupContext.Provider>
  )
}

export { ExpandablePanel, ExpandablePanelGroup }
