"use client"

import * as React from "react"
import { Label, Switch } from "minka-ds"
import { cn } from "@/lib/utils"

/**
 * Playground — a live specimen the reader can operate, with the controls that
 * matter for the section it sits in.
 *
 * Deliberately NOT a prop debugger. Each section passes only the controls that
 * section is about, so the page keeps a point of view instead of handing the
 * reader a matrix and asking them to work it out. Variants and Sizes stay
 * comparison grids elsewhere on the page, because their whole point is seeing
 * several specimens at once — something a playground rendering one at a time
 * would destroy.
 *
 * No attached code panel. The specimen is what is being documented, so it gets
 * the whole stage; the source belongs behind a disclosure, not beside it.
 *
 * Layout is controls-above-stage: the reader reads the settings, then looks
 * down at the result. Reversing it makes the controls feel like a caption.
 */

type SelectControl<V extends string = string> = {
  type: "select"
  /** Stable key, used as the value in the render callback. */
  name: string
  label: string
  options: { value: V; label: string }[]
  defaultValue: V
}

/**
 * A boolean modifier, rendered as the DS `Switch`.
 *
 * The distinction is worth the second control shape: chips are one-of-many, and a
 * chip that happens to be a standalone boolean gives no hint that pressing it
 * turns something on rather than selecting it. A switch says on-or-off in its
 * form.
 */
type ToggleControl = {
  type: "toggle"
  name: string
  label: string
  defaultValue: boolean
}

type Control = SelectControl | ToggleControl

/** The resolved control values handed to the render callback. */
type PlaygroundState = Record<string, string | boolean>

function initialState(controls: Control[]): PlaygroundState {
  const state: PlaygroundState = {}
  for (const c of controls) state[c.name] = c.defaultValue
  return state
}

function Playground({
  controls,
  children,
  details,
  dark,
  minHeight = 200,
  overflowVisible = false,
  className,
}: {
  controls: Control[]
  /** Receives the current control values and returns the specimen. */
  children: (state: PlaygroundState) => React.ReactNode
  /**
   * Optional content below the stage that reacts to the same state — a parts
   * list that shows only the parts the current selection actually uses, so the
   * reader is never reading about a slot that is not on screen.
   */
  details?: (state: PlaygroundState) => React.ReactNode
  /**
   * Given the current state, whether the whole panel should render dark.
   *
   * The panel flips rather than just the specimen, because a dark-token button on
   * a light surface cannot be judged: half of what the variant does is how it
   * sits against its ground. Applying `.dark` here also means the chips and the
   * dot texture resolve to the dark palette, so the panel demonstrates the token
   * layer rather than special-casing one component.
   */
  dark?: (state: PlaygroundState) => boolean
  /**
   * Lets a specimen's overlay escape the stage.
   *
   * The stage clips by default so the dot texture stops at its rounded corners. That
   * also clips any overlay positioned inside the stage rather than portaled — the
   * filter dropdown on SearchBar, for instance, which renders `absolute top-full`.
   * Set this where the specimen has such an overlay, so the reader sees all of it
   * instead of the top third.
   */
  overflowVisible?: boolean
  /** Stage height floor, so switching options does not resize the panel. */
  minHeight?: number
  className?: string
}) {
  const [state, setState] = React.useState<PlaygroundState>(() => initialState(controls))

  function set(name: string, value: string | boolean) {
    setState((prev) => ({ ...prev, [name]: value }))
  }

  const isDark = dark ? dark(state) : false

  const selects = controls.filter(
    (c): c is SelectControl => c.type === "select",
  )
  const toggles = controls.filter(
    (c): c is ToggleControl => c.type === "toggle",
  )

  return (
    <div className={cn("not-prose flex flex-col gap-3", className)}>
      {/* One bounded surface holding both the controls and the specimen.
          The controls live inside because what the panel demonstrates is not
          just a component, it is a component under a set of conditions, so the
          chips are part of the specimen rather than a caption on it. Binding
          them structurally also survives a page with two playgrounds, where
          proximity alone would stop telling the reader which drives which.

          No divider between them. The chips are dark enough to hold their own
          against the dot texture, and a rule here brings back the stacked-panel
          reading that a separate control bar had. */}
      <div
        className={cn(
          "ds-playground-stage flex flex-col border border-[var(--color-border-default)] transition-colors duration-200",
          // Clipping is the default so the dot texture respects the corner radius.
          overflowVisible ? "overflow-visible" : "overflow-hidden",
          // `.dark` is the DS token context, so everything inside resolves to the
          // dark palette: the panel, the chips, the dot texture, the specimen.
          isDark && "dark bg-[var(--color-bg-base)]",
        )}
      >
        {/* Selects left, toggles right. They are different kinds of control:
            a select picks which specimen you are looking at, a toggle modifies
            whichever one that is. Splitting them to opposite ends says that
            without a label, and keeps the modifiers in the same place on every
            panel across the site. */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 pt-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {selects.map((control) => (
              <ChipField
                key={control.name}
                control={control}
                value={String(state[control.name])}
                onChange={(v) => set(control.name, v)}
              />
            ))}
          </div>
          {toggles.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {toggles.map((control) => (
                <ToggleField
                  key={control.name}
                  control={control}
                  value={Boolean(state[control.name])}
                  onChange={(v) => set(control.name, v)}
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* minHeight sits on the stage rather than the panel, so a playground
            with two rows of chips gives its specimen the same room as one with
            a single row. */}
        <div
          className="flex flex-1 items-center justify-center px-6 py-10"
          style={{ minHeight }}
        >
          {children(state)}
        </div>
      </div>

      {details ? details(state) : null}
    </div>
  )
}

/**
 * Chip styling, shared by the select and toggle controls so a pressed-in
 * modifier and a selected option read as the same kind of thing.
 *
 * The fill stays opaque because the chips sit on the dot texture: a transparent
 * chip would take the dots through its label and stop being readable. Every
 * colour is a token, so the whole control bar follows the panel into dark mode.
 */
function chipClass(active: boolean) {
  return cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-caption outline-none transition-colors focus-visible:border-[var(--color-border-focus)]",
    active
      ? "border-[var(--color-border-strong)] bg-[var(--color-bg-inverted)] text-[var(--color-text-inverse)]"
      : "border-[var(--color-border-default)] bg-[var(--color-bg-raised)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-default)]",
  )
}

/**
 * Single-select chips.
 *
 * Same pattern as the report catalog's category chips in studio: rounded-full,
 * text-caption, inverted when active. Not the DS `FilterChip`, which renders an
 * ACTIVE filter (label plus removable values) and has no selected state, the one
 * thing a single-select picker needs. Not `Tabs` either: tabs claim to switch
 * between views of a whole, where these set one property of one specimen.
 */
function ChipField({
  control,
  value,
  onChange,
}: {
  control: SelectControl
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <span className="text-caption text-[var(--color-text-muted)] whitespace-nowrap">
        {control.label}
      </span>
      {control.options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={chipClass(active)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** A boolean modifier, using the DS Switch so on-or-off reads from the form. */
function ToggleField({
  control,
  value,
  onChange,
}: {
  control: ToggleControl
  value: boolean
  onChange: (v: boolean) => void
}) {
  const id = React.useId()
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={value} onCheckedChange={onChange} />
      <Label
        htmlFor={id}
        className="text-caption whitespace-nowrap text-[var(--color-text-muted)]"
      >
        {control.label}
      </Label>
    </div>
  )
}

export { Playground }
export type { Control, PlaygroundState }
