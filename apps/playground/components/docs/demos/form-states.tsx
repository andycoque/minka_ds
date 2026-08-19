"use client"

import * as React from "react"
import { Checkbox, Label, Switch, Textarea } from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * States playgrounds for the controls that have no `variant` prop.
 *
 * A State chip rather than a Variant chip, because appearance changes by
 * condition rather than by a prop the author picks. Focus is deliberately not a
 * chip anywhere; it is keyboard-only, so the honest way to see it is to tab into
 * the specimen.
 *
 * Checked is NOT a chip either: the specimen is a real control, so the reader
 * sets that by clicking it.
 */

const FIELD_STATES: Control[] = [
  {
    type: "select",
    name: "state",
    label: "State",
    options: [
      { value: "default", label: "Default" },
      { value: "filled", label: "Filled" },
      { value: "invalid", label: "Invalid" },
      { value: "disabled", label: "Disabled" },
    ],
    defaultValue: "default",
  },
]

function TextareaStatesDemo() {
  return (
    <Playground controls={FIELD_STATES} minHeight={190}>
      {(state) => {
        const s = String(state.state)
        return (
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="ds-textarea-demo">Reason for rejection</Label>
            <Textarea
              key={s}
              id="ds-textarea-demo"
              placeholder="Explain what the operator should fix."
              defaultValue={
                s === "filled" || s === "invalid"
                  ? "Beneficiary name does not match the account holder on record."
                  : undefined
              }
              aria-invalid={s === "invalid" || undefined}
              disabled={s === "disabled"}
            />
            <p
              className={
                s === "invalid"
                  ? "text-caption text-[var(--color-feedback-error)]"
                  : "text-caption text-[var(--color-text-muted)]"
              }
            >
              {s === "invalid"
                ? "A reason is required before rejecting."
                : "Shown to the participant who submitted the request."}
            </p>
          </div>
        )
      }}
    </Playground>
  )
}

// Checkbox and Switch share both panels: they are the same control shape with
// different meanings, and the DS gives them the same focus, disabled and checked
// tokens so they read as siblings.
const TOGGLE_LAYOUT: Control[] = [
  {
    type: "select",
    name: "layout",
    label: "Label",
    options: [
      { value: "one", label: "One line" },
      { value: "two", label: "With description" },
    ],
    defaultValue: "one",
  },
]

const TOGGLE_STATES: Control[] = [
  {
    type: "select",
    name: "state",
    label: "State",
    options: [
      { value: "active", label: "Active" },
      { value: "disabled", label: "Disabled" },
    ],
    defaultValue: "active",
  },
]

function CheckboxAnatomyDemo() {
  return (
    <Playground
      controls={TOGGLE_LAYOUT}
      minHeight={140}
      details={(state) => (
        <Anatomy>
          <Part name="Checkbox">The box.</Part>
          <Part name="Label">
            Bound with <Code>htmlFor</Code>, so the text is a second hit target.
          </Part>
          {String(state.layout) === "two" ? (
            <Part name="Description">
              One line under the label, for what the answer commits the reader to.
            </Part>
          ) : null}
        </Anatomy>
      )}
    >
      {(state) => {
        const two = String(state.layout) === "two"
        return (
          <div className="flex items-start gap-2.5">
            {/* mt-0.5 only on the two-line form, where the box has to meet the
                first line rather than centre on the block. */}
            <Checkbox id="ds-checkbox-anatomy" className={two ? "mt-0.5" : undefined} />
            {two ? (
              <div className="space-y-0.5">
                <Label htmlFor="ds-checkbox-anatomy">
                  I confirm the beneficiary details are correct
                </Label>
                <p className="text-caption text-[var(--color-text-muted)]">
                  Recorded against this approval.
                </p>
              </div>
            ) : (
              <Label htmlFor="ds-checkbox-anatomy">Single use</Label>
            )}
          </div>
        )
      }}
    </Playground>
  )
}

function CheckboxStatesDemo() {
  return (
    <Playground controls={TOGGLE_STATES} minHeight={120}>
      {(state) => {
        const disabled = String(state.state) === "disabled"
        return (
          <div className="flex items-center gap-2.5">
            {/* No `defaultChecked` tied to `disabled`. Disabled and checked are
                unrelated, and coupling them made the disabled specimen look like
                it was documenting a checked-disabled combination. */}
            <Checkbox id="ds-checkbox-demo" disabled={disabled} />
            <Label htmlFor="ds-checkbox-demo">Single use</Label>
          </div>
        )
      }}
    </Playground>
  )
}

function SwitchAnatomyDemo() {
  return (
    <Playground
      controls={TOGGLE_LAYOUT}
      minHeight={140}
      details={(state) => (
        <Anatomy>
          <Part name="Switch">The track and knob.</Part>
          <Part name="Label">
            Bound with <Code>htmlFor</Code>. Names the thing being turned on.
          </Part>
          {String(state.layout) === "two" ? (
            <Part name="Description">
              One line under the label, for what the setting changes.
            </Part>
          ) : null}
        </Anatomy>
      )}
    >
      {(state) => {
        const two = String(state.layout) === "two"
        return (
          // max-w-xs, not max-w-sm: at the wider measure `justify-between` left a
          // gulf between the label and the switch, so the pair stopped reading as
          // one control.
          <div className="flex w-full max-w-xs items-center justify-between gap-6">
            {two ? (
              <div className="space-y-0.5">
                <Label htmlFor="ds-switch-anatomy">Single use</Label>
                <p className="text-caption text-[var(--color-text-muted)]">
                  The instrument closes after one payment.
                </p>
              </div>
            ) : (
              <Label htmlFor="ds-switch-anatomy">Single use</Label>
            )}
            <Switch id="ds-switch-anatomy" />
          </div>
        )
      }}
    </Playground>
  )
}

function SwitchStatesDemo() {
  return (
    <Playground controls={TOGGLE_STATES} minHeight={120}>
      {(state) => {
        const disabled = String(state.state) === "disabled"
        return (
          <div className="flex w-full max-w-xs items-center justify-between gap-6">
            <Label htmlFor="ds-switch-demo">Single use</Label>
            <Switch id="ds-switch-demo" disabled={disabled} />
          </div>
        )
      }}
    </Playground>
  )
}

export {
  TextareaStatesDemo,
  CheckboxAnatomyDemo,
  CheckboxStatesDemo,
  SwitchAnatomyDemo,
  SwitchStatesDemo,
}
