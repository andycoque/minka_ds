"use client"

import { Checkbox, Input, Label, Switch } from "minka-ds"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Anatomy playground for Label.
 *
 * All three bindings on screen at once rather than behind a chip. There are only
 * three and they are small, so showing them together lets the reader compare how
 * the label sits against each control, which is the useful comparison. A chip
 * would hide two thirds of that to save no space.
 *
 * The Disabled toggle stays a control, because it is a condition the author sets
 * rather than something the reader can produce by clicking.
 */

const CONTROLS: Control[] = [
  {
    type: "toggle",
    name: "disabled",
    label: "Disabled",
    defaultValue: false,
  },
]

function LabelAnatomyDemo() {
  return (
    <Playground controls={CONTROLS} minHeight={190}>
      {(state) => {
        const disabled = Boolean(state.disabled)

        return (
          <div className="flex w-full max-w-xs flex-col gap-5">
            {/* The control comes BEFORE the label in the markup so
                `peer-disabled` can reach it: it is a CSS sibling selector, so it
                only looks forward. `flex-col-reverse` puts the label back on top
                visually. */}
            <div className="flex flex-col-reverse gap-1.5">
              <Input
                id="ds-label-field"
                placeholder="Banco Davivienda"
                disabled={disabled}
                className="peer"
              />
              <Label htmlFor="ds-label-field">Participant name</Label>
            </div>

            <span className="flex items-center gap-2.5">
              <Checkbox id="ds-label-cb" disabled={disabled} className="peer" />
              <Label htmlFor="ds-label-cb">Single use</Label>
            </span>

            <span className="flex items-center gap-3">
              <Switch id="ds-label-sw" disabled={disabled} className="peer" />
              <Label htmlFor="ds-label-sw">Notify on failure</Label>
            </span>
          </div>
        )
      }}
    </Playground>
  )
}

export { LabelAnatomyDemo }
