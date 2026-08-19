"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "../../lib/utils"

/**
 * Single-select from a visible set of options. Distinct from Select: a select hides
 * the options behind a trigger and suits recall from a long list, a radio group
 * shows them all and suits a comparison between a few.
 *
 * Same focus, disabled and checked tokens as Checkbox and Switch, so the three read
 * as siblings.
 *
 * Arrow keys move between options and only the selected one is a tab stop. That is
 * Radix's roving focus, and it is the main reason this is a component rather than
 * styled markup.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 shrink-0 cursor-pointer rounded-full border border-[var(--color-border-strong)] shadow-xs transition-[color,background-color,border-color,box-shadow] outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50 focus-visible:border-[var(--color-border-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-[var(--color-action-primary-default)] data-[state=checked]:bg-[var(--color-action-primary-default)]",
        "aria-invalid:border-[var(--color-border-error)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--color-border-error)]/20",
        className
      )}
      {...props}
    >
      {/* An inset ring rather than shadcn's filled CircleIcon: the dot is punched
          out of the filled control, which matches how Checkbox draws its tick
          against the same primary fill. */}
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        <span className="size-1.5 rounded-full bg-[var(--color-text-inverse)]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

/**
 * A radio as a bordered row: a label, an optional line explaining what choosing it
 * does, and the control. The whole row is the target, so the reader is not aiming
 * at a 16px circle.
 *
 * `label` is a node rather than a string because the label is often not plain text,
 * and the caller owns its typography. A status choice passes a `StatusCell`, so the
 * option is rendered by the same component that renders that state everywhere else.
 * Plain-text labels should be wrapped in the type style they want.
 *
 * A disabled card stays visible rather than being dropped from the list. An option
 * missing without explanation looks like a bug, so pass `description` to say why it
 * cannot be picked.
 */
function RadioCard({
  value,
  label,
  description,
  expanded,
  disabled,
  className,
  ...props
}: Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children"> & {
  label: React.ReactNode
  description?: React.ReactNode
  /**
   * Content revealed inside the card, e.g. a field the choice requires. Rendered
   * outside the button element, since a button cannot legally contain an input and
   * clicks inside it must not re-trigger the radio.
   *
   * Pass this only while the card is SELECTED. An unselected card has nothing to
   * reveal, and the wrapper it introduces would flatten the card's own border.
   */
  expanded?: React.ReactNode
}) {
  // Keyed on PRESENCE, not on `expanded` itself: a ReactNode is a new object every
  // render, so depending on it would re-run this effect constantly and re-flip the row.
  const hasExpanded = expanded != null && expanded !== false

  // The content has to outlive the prop for the collapse to be visible: a caller drops
  // `expanded` the instant the selection moves elsewhere. Held in a ref rather than
  // state because `expanded` is a new object every render, so state here would mean
  // set-state-in-render on every pass. Nothing needs to re-render when it changes — the
  // render reads the live prop while it exists and only falls back to this on collapse.
  const retainedRef = React.useRef<React.ReactNode>(null)
  if (hasExpanded) retainedRef.current = expanded

  // Drives the wrapper's lifetime. Set true alongside the content, cleared once the
  // collapse has played, so this is what the render gates on.
  const [retaining, setRetaining] = React.useState(false)
  const [revealed, setRevealed] = React.useState(false)

  if (hasExpanded && !retaining) setRetaining(true)

  React.useEffect(() => {
    if (hasExpanded) {
      // A 0fr -> 1fr transition needs the element to render at 0fr for one frame before
      // it flips, or the browser has no start value and the row snaps open.
      const id = requestAnimationFrame(() => setRevealed(true))
      return () => cancelAnimationFrame(id)
    }
    setRevealed(false)

    // Backstop for the unmount. `transitionend` is the primary signal, but it never
    // fires under prefers-reduced-motion (transition-none) or if the row is hidden
    // mid-collapse, and without this the card would stay flattened forever.
    const id = setTimeout(() => setRetaining(false), 260)
    return () => clearTimeout(id)
  }, [hasExpanded])

  /** True while the content is showing OR animating away, so the wrapper persists. */
  const wrapped = hasExpanded || retaining

  const card = (
    <RadioGroupPrimitive.Item
      data-slot="radio-card"
      value={value}
      disabled={disabled}
      className={cn(
        "group flex w-full items-start gap-2.5 [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-2.5 text-left outline-none",
        "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
        "focus-visible:border-[var(--color-border-focus)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-border-focus)]/50",
        "cursor-pointer hover:border-[var(--color-border-strong)]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-[var(--color-border-default)]",
        // Selected: the primary action colour on the outline, matching the radio, and a
        // soft grey fill. bg-canvas is the system's neutral soft grey and inverts on a
        // dark ground, where a tint like bg-info would read as a colour wash. The ring
        // doubles the border's weight without the 1px layout shift a 2px border causes.
        "data-[state=checked]:border-[var(--color-action-primary-default)] data-[state=checked]:ring-1 data-[state=checked]:ring-[var(--color-action-primary-default)] data-[state=checked]:bg-[var(--color-bg-canvas)]",
        // Wrapped (see `expanded`): the WRAPPER owns the border, radius and fill, so
        // the card goes flat. Last in the list so it wins — cn() resolves conflicts by
        // source order, and these have to beat the checked styles above.
        wrapped &&
          "rounded-none border-transparent bg-transparent data-[state=checked]:border-transparent data-[state=checked]:bg-transparent data-[state=checked]:ring-0",
        className
      )}
      {...props}
    >
      {/* The control leads the row, on the title's first line. It is decorative: the
          card itself is the radio, so this must not be a second focusable element.

          Centred on the first LINE BOX rather than the block, so it holds its position
          when a description wraps. 4px = (24px line box for text-body - 16px control)
          / 2. A caller passing a different type size may need to nudge this via
          className; there is no line-height to derive it from, since the card sets
          none of its own. */}
      <span
        aria-hidden
        className={cn(
          "mt-[4px] flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border border-[var(--color-border-strong)] shadow-xs transition-colors",
          "group-data-[state=checked]:border-[var(--color-action-primary-default)] group-data-[state=checked]:bg-[var(--color-action-primary-default)]",
        )}
      >
        <span className="size-1.5 rounded-full bg-[var(--color-text-inverse)] opacity-0 transition-opacity group-data-[state=checked]:opacity-100" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        {label}
        {/* One step below the label, not two: at text-caption against a text-body label
            the pair read as separate ranks rather than a label and its explanation. */}
        {description && (
          <span className="text-body-sm text-[var(--color-text-muted)]">{description}</span>
        )}
      </span>
    </RadioGroupPrimitive.Item>
  )

  if (!wrapped) return card

  // The card and its revealed content are wrapped in one bordered block so the
  // content reads as INSIDE the card. The card itself drops its own border and
  // radius, and the wrapper carries the selected outline instead — a nested border
  // would draw a box inside a box.
  return (
    <div
      data-slot="radio-card-expandable"
      // :has() rather than a prop, so the wrapper follows the radio's real state
      // without the caller having to tell it twice.
      className={cn(
        "overflow-hidden [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)]",
        "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
        "has-[[data-slot=radio-card][data-state=checked]]:border-[var(--color-action-primary-default)] has-[[data-slot=radio-card][data-state=checked]]:ring-1 has-[[data-slot=radio-card][data-state=checked]]:ring-[var(--color-action-primary-default)] has-[[data-slot=radio-card][data-state=checked]]:bg-[var(--color-bg-canvas)]",
      )}
    >
      {card}
      {/* Height reveal via grid-template-rows 0fr -> 1fr, which animates to the
          content's OWN height. A max-height transition would need a magic number, and
          the tw-animate utilities are not compiled in this project. The inner div must
          carry the overflow clip, since the animating row is the grid track. */}
      <div
        className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out data-[reveal=open]:grid-rows-[1fr] motion-reduce:transition-none"
        data-reveal={revealed ? "open" : "closed"}
        // Unmount only after the collapse has actually played. Guarded on the property
        // name because a transition on any descendant also bubbles to here.
        onTransitionEnd={e => {
          if (e.propertyName !== "grid-template-rows") return
          if (!hasExpanded) setRetaining(false)
        }}
      >
        <div className="overflow-hidden">
          <div className="px-3 pb-3 pl-[2.375rem]">{hasExpanded ? expanded : retainedRef.current}</div>
        </div>
      </div>
    </div>
  )
}

export { RadioGroup, RadioGroupItem, RadioCard }
