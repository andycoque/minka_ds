"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"
import { Button } from "./button"

/**
 * Shared enter/exit motion for every dialog — a soft dissolve mirrored in both
 * directions (the intro/onboarding outro, run forward on open and backward on
 * close). The backdrop dissolves; the card settles in / drifts up as it fades.
 *
 * Self-contained @keyframes (this project's Tailwind has no tw-animate utilities).
 * They are injected ONCE into <head> at module load — NOT rendered inside the
 * portal. If they lived in the portal, unmounting on close would remove the
 * @keyframes before Radix's exit animation could play, so the close animation
 * would be dropped in some paths. Living in <head>, they persist through the whole
 * data-[state=closed] phase, so the exit always plays before unmount.
 */
const DIALOG_ENTER_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"  // soft settle (matches intro-in)
const DIALOG_EXIT_EASE   = "cubic-bezier(0.4, 0, 1, 1)"     // ease-in drift (matches intro-out)

const DIALOG_MOTION_CSS = `
  @keyframes ds-dialog-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
  @keyframes ds-dialog-backdrop-out { from { opacity: 1 } to { opacity: 0 } }
  /* Transforms compose the -50%/-50% centering so the dialog stays centered while it settles/drifts. */
  @keyframes ds-dialog-card-in  { from { opacity: 0; transform: translate(-50%, calc(-50% + 8px)) scale(0.97) } to { opacity: 1; transform: translate(-50%, -50%) scale(1) } }
  @keyframes ds-dialog-card-out { from { opacity: 1; transform: translate(-50%, -50%) scale(1) } to { opacity: 0; transform: translate(-50%, calc(-50% - 10px)) scale(0.97) } }
  /* Backdrop: fades in behind the card on open, and clears last on close. */
  [data-slot="dialog-overlay"][data-state="open"]  { animation: ds-dialog-backdrop-in .45s ${DIALOG_ENTER_EASE} both }
  [data-slot="dialog-overlay"][data-state="closed"] { animation: ds-dialog-backdrop-out .5s ease-out .1s both }
  /* Card + content settle in on open; drift up + shrink out on close (mirror). */
  [data-slot="dialog-content"][data-state="open"]  { animation: ds-dialog-card-in .5s ${DIALOG_ENTER_EASE} .06s both }
  [data-slot="dialog-content"][data-state="closed"] { animation: ds-dialog-card-out .3s ${DIALOG_EXIT_EASE} both }
  @media (prefers-reduced-motion: reduce) {
    [data-slot="dialog-overlay"][data-state],
    [data-slot="dialog-content"][data-state] { animation: none !important }
  }
`

// Inject the motion CSS once, at module load, into <head> so it never unmounts
// with the portal. Guarded by a data attribute so repeated imports/HMR don't dupe.
if (typeof document !== "undefined" && !document.getElementById("ds-dialog-motion")) {
  const styleEl = document.createElement("style")
  styleEl.id = "ds-dialog-motion"
  styleEl.textContent = DIALOG_MOTION_CSS
  document.head.appendChild(styleEl)
}

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 [z-index:var(--z-modal)] bg-[var(--color-bg-backdrop-blur)] backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

type PanelPlacement = "side" | "top"

/**
 * Optional contextual panel rendered inside DialogContent. Holds supporting
 * media or guidance (illustration, brand texture, action summary, help text).
 * Place it as a direct child of DialogContent; the content adapts its layout.
 *
 * By default the panel bleeds to the dialog edges. Pass `inset` to float it
 * inside the dialog with an 8px frame and rounded corners.
 */
function DialogPanel({
  className,
  placement = "side",
  inset = false,
  ...props
}: React.ComponentProps<"div"> & { placement?: PanelPlacement; inset?: boolean }) {
  return (
    <div
      data-slot="dialog-panel"
      data-placement={placement}
      data-inset={inset || undefined}
      className={cn(
        "relative flex flex-col justify-center bg-[var(--color-bg-canvas)]",
        // inset panels are tighter — the 8px frame already adds breathing room
        inset ? "p-4" : "p-6",
        // side: a column down the left; top: a banner across the top
        placement === "side" ? "shrink-0 sm:w-2/5" : "min-h-32",
        // inset: float inside the dialog with an 8px frame on the dialog-facing
        // edges only — the interior edge stays flush, the body padding separates
        inset && "overflow-hidden [border-radius:var(--radius-card)]",
        inset && (placement === "side" ? "ml-2 my-2" : "mt-2 mx-2"),
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  container,
  attachment,
  contentBlurred = false,
  flow = false,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  container?: HTMLElement | null
  /**
   * Optional element rendered attached just below the content box, inside the
   * same portal but OUTSIDE the (optionally blurred) box — e.g. a contextual
   * confirmation strip. Keeps the box focus-trapped while the attachment stays
   * sharp and interactive.
   */
  attachment?: React.ReactNode
  /** Blur + dim the content box (not the attachment) to shift focus to it. */
  contentBlurred?: boolean
  /**
   * Cap the dialog to the viewport and let a child manage its own scroll, instead
   * of growing past the screen. Caps at calc(100dvh - 12.5rem) so a tall dialog never
   * fills the viewport: it always leaves fixed clearance (top + bottom) for the
   * attachment strip and breathing room. Children lay out as a flex column with
   * min-h-0 so an inner `flex-1 overflow-y-auto` region scrolls. Short dialogs are
   * unaffected (they shrink-wrap below the cap).
   */
  flow?: boolean
}) {
  // Detect an optional DialogPanel child and split it out from the body.
  const childArray = React.Children.toArray(children)
  const panel = childArray.find(
    (c): c is React.ReactElement<{ placement?: PanelPlacement; children?: React.ReactNode }> =>
      React.isValidElement(c) && (c.type as { displayName?: string })?.displayName === "DialogPanel"
  )
  const body = childArray.filter(c => c !== panel)
  const placement = panel?.props.placement ?? "side"
  const hasPanel = Boolean(panel)

  const closeButton = showCloseButton && (
    <DialogPrimitive.Close asChild>
      <Button
        data-slot="dialog-close"
        variant="ghost"
        size="icon-sm"
        aria-label="Close"
        className="absolute top-5 right-5 z-10 translate-y-[5px] text-current opacity-70 hover:opacity-100"
      >
        <XIcon />
      </Button>
    </DialogPrimitive.Close>
  )

  const box = (
    <div
      data-slot="dialog-box"
      className={cn(
        // the box is the centered anchor and stays put; the attachment floats
        // below it (absolute) so it never shifts the box.
        "relative w-full overflow-hidden [border-radius:var(--radius-modal)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-modal)]",
        // blur/dim transitions both ways so focus shifts smoothly.
        "transition-[filter,opacity] duration-200 ease-out",
        // layout: plain (padded grid) vs panelled (flex split, panel bleeds to edges)
        hasPanel
          ? placement === "side"
            ? "flex flex-col sm:flex-row"
            : "flex flex-col"
          : "grid gap-4 p-5",
        // flow: the box is a bounded flex child of the capped wrapper. min-h-0 lets it
        // shrink; it can't exceed the wrapper's capped height, so short dialogs
        // shrink-wrap while tall ones are capped and their inner region scrolls.
        flow && "min-h-0",
        contentBlurred && "pointer-events-none blur-[2px] opacity-60"
      )}
    >
      {/* top: close lives inside the panel so it inherits the panel's foreground */}
      {placement === "top" && panel
        ? React.cloneElement(panel, {}, panel.props.children, closeButton)
        : panel}
      {hasPanel ? (
        <div data-slot="dialog-body" className={cn("relative flex flex-1 flex-col gap-4 p-5", flow && "min-h-0")}>
          {body}
        </div>
      ) : (
        body
      )}
      {/* side / no panel: close sits over the content body */}
      {placement !== "top" && closeButton}
    </div>
  )

  return (
    <DialogPortal container={container}>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-panel={hasPanel ? placement : undefined}
        className={cn(
          // Anchor = the box, always centered. The attachment is absolutely
          // positioned relative to this wrapper's box, so its presence never
          // re-centers the dialog.
          "fixed top-[50%] left-[50%] [z-index:var(--z-modal)] w-full max-w-[calc(100%-2rem)] [transform:translate(-50%,-50%)] outline-none",
          hasPanel && placement === "side" ? "sm:max-w-2xl" : "sm:max-w-lg",
          // flow: cap the height so the dialog never fills the viewport, and make this
          // wrapper a bounded flex column so the cap actually cascades to the box
          // (max-h-full / min-h-0 / flex-1 below need a definite parent height to
          // resolve against — without `flex flex-col` here the box just grows to
          // content and never scrolls/resizes). The 12.5rem reserve is split top +
          // bottom (box is centered); at max height it leaves ~24px below the
          // attachment strip so it never touches the screen edge: gap = reserve/2
          // - (strip ~64px + mt-3 12px) = 100 - 76 = ~24px. dvh so mobile browser
          // chrome doesn't clip.
          flow && "flex flex-col max-h-[calc(100dvh-12.5rem)]",
          className
        )}
        {...props}
      >
        {box}
        {attachment && (
          <div
            data-slot="dialog-attachment"
            className="absolute top-full right-0 left-0 mt-3"
            style={{ animation: "dialog-attachment-in .2s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <style>{`@keyframes dialog-attachment-in { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }`}</style>
            {attachment}
          </div>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
DialogPanel.displayName = "DialogPanel"

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-heading-2-serif", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-body-sm text-[var(--color-text-muted)]", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
