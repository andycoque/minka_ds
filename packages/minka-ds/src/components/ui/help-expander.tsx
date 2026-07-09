"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "radix-ui"
import { HelpCircle, X, ExternalLink } from "lucide-react"
import { cn } from "../../lib/utils"

type Anchor = "bottom-right" | "bottom-left" | "top-right" | "top-left"

export interface HelpExpanderProps {
  /** Card heading. */
  title: string
  /** Card body (text or nodes). */
  children: React.ReactNode
  /**
   * "popover" (default) floats the card next to the trigger (portaled — works
   * anywhere). "inset" expands the card inside the nearest positioned container,
   * frosting whatever is behind it — for panels with empty space to fill.
   */
  mode?: "popover" | "inset"
  /** Trigger appearance. Defaults to a circular "?" icon button, no label. */
  trigger?: { icon?: React.ReactNode; label?: string }
  /** inset mode: which corner the button sits in / the card expands from. */
  anchor?: Anchor
  /** Optional doc link rendered under the body. */
  docHref?: string
  docLabel?: string
  className?: string
}

const ANCHOR_POS: Record<Anchor, string> = {
  "bottom-right": "bottom-3 right-3 items-end",
  "bottom-left":  "bottom-3 left-3 items-start",
  "top-right":    "top-3 right-3 items-end",
  "top-left":     "top-3 left-3 items-start",
}

// transform-origin so the card grows out of / shrinks back into the anchor corner
const ANCHOR_ORIGIN: Record<Anchor, string> = {
  "bottom-right": "bottom right",
  "bottom-left":  "bottom left",
  "top-right":    "top right",
  "top-left":     "top left",
}

// shared trigger button
function TriggerButton({ trigger, ...props }: { trigger?: HelpExpanderProps["trigger"] } & React.ComponentProps<"button">) {
  const icon = trigger?.icon ?? <HelpCircle className="size-4" />
  return (
    <button
      type="button"
      aria-label="Help"
      className={cn(
        "flex items-center justify-center gap-1.5 [border-radius:var(--radius-button)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] text-[var(--color-text-muted)] shadow-[var(--shadow-card)] transition-colors hover:text-[var(--color-text-default)] hover:border-[var(--color-border-strong)]",
        trigger?.label ? "h-8 px-3 text-label-sm" : "size-8",
      )}
      {...props}
    >
      {icon}
      {trigger?.label}
    </button>
  )
}

// shared frosted card body
function CardBody({ title, children, docHref, docLabel, onClose, open, origin }: {
  title: string
  children: React.ReactNode
  docHref?: string
  docLabel?: string
  onClose: () => void
  /** When provided, the card scales/fades in and out from `origin` (inset mode). */
  open?: boolean
  origin?: string
}) {
  const animated = origin != null
  return (
    <div
      className={cn(
        "w-full [border-radius:var(--radius-card)] border border-[var(--color-border-default)] backdrop-blur-md shadow-[var(--shadow-popover)] p-4",
        animated && "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
        animated && (open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"),
        !animated && "[animation:help-in_.2s_cubic-bezier(0.16,1,0.3,1)]"
      )}
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg-overlay) 70%, transparent)",
        transformOrigin: origin,
      }}
    >
      <style>{`@keyframes help-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div className="flex items-start justify-between gap-3">
        <span className="text-heading-4-serif text-[var(--color-text-default)]">{title}</span>
        <button
          type="button"
          aria-label="Close help"
          onClick={onClose}
          className="shrink-0 -mr-1 -mt-1 size-6 flex items-center justify-center rounded-[var(--radius-button)] text-[var(--color-text-muted)] hover:bg-[var(--color-action-ghost-hover)] hover:text-[var(--color-text-default)] transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <div className="mt-1.5 text-caption text-[var(--color-text-muted)] leading-relaxed">{children}</div>
      {docHref && (
        <a
          href={docHref}
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 inline-flex items-center gap-1 text-caption text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)]"
        >
          {docLabel ?? "Learn more"}
          <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  )
}

function HelpExpander({
  title, children, mode = "popover", trigger, anchor = "bottom-right", docHref, docLabel, className,
}: HelpExpanderProps) {
  const [open, setOpen] = React.useState(false)

  // Keep the inset card mounted through its close animation before unmounting.
  const [cardMounted, setCardMounted] = React.useState(false)
  const [cardShown, setCardShown] = React.useState(false)
  React.useEffect(() => {
    if (open) {
      setCardMounted(true)
      // next frame → flip to the shown state so the transition runs
      const id = requestAnimationFrame(() => setCardShown(true))
      return () => cancelAnimationFrame(id)
    }
    setCardShown(false)
    const t = setTimeout(() => setCardMounted(false), 200)
    return () => clearTimeout(t)
  }, [open])

  // ── inset: expands inside the nearest positioned container ──
  if (mode === "inset") {
    return (
      <div className={cn("absolute z-10 flex flex-col w-[calc(100%-1.5rem)]", ANCHOR_POS[anchor], className)}>
        {cardMounted ? (
          <CardBody
            title={title}
            docHref={docHref}
            docLabel={docLabel}
            onClose={() => setOpen(false)}
            open={cardShown}
            origin={ANCHOR_ORIGIN[anchor]}
          >
            {children}
          </CardBody>
        ) : (
          <TriggerButton trigger={trigger} onClick={() => setOpen(true)} />
        )}
      </div>
    )
  }

  // ── popover: floats next to the trigger (portaled) ──
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <TriggerButton trigger={trigger} className={className} />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="top"
          align="end"
          sideOffset={8}
          className="z-[var(--z-popover)] w-72 outline-none"
        >
          <CardBody title={title} docHref={docHref} docLabel={docLabel} onClose={() => setOpen(false)}>
            {children}
          </CardBody>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { HelpExpander }
