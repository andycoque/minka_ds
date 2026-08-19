"use client"

import { Input, Label } from "minka-ds"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * States playground for Input.
 *
 * Input has no `variant` prop, so its Variants section is a STATES panel instead.
 * That is the pattern for every control whose appearance changes by condition
 * rather than by a prop the author picks: Input, Textarea, Checkbox, Switch.
 *
 * Unlike Button, `invalid` genuinely belongs here. A field is the thing that can
 * hold a value that fails validation; a button is an action and has no value to
 * be wrong about.
 *
 * Focus is absent from the chips on purpose. It is keyboard-only by design, so
 * the honest way to see it is to tab into the specimen.
 */

const CONTROLS: Control[] = [
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

function InputStatesDemo() {
  return (
    <Playground controls={CONTROLS} minHeight={160}>
      {(state) => {
        const s = String(state.state)
        return (
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="ds-input-demo">Participant name</Label>
            <Input
              id="ds-input-demo"
              placeholder="Banco Davivienda"
              defaultValue={s === "filled" || s === "invalid" ? "Banco Daviviend" : undefined}
              aria-invalid={s === "invalid" || undefined}
              disabled={s === "disabled"}
              // A key so switching state remounts the field and the defaultValue
              // actually changes; without it React keeps the first value.
              key={s}
            />
            {s === "invalid" ? (
              <p className="text-caption text-[var(--color-feedback-error)]">
                No participant matches that name.
              </p>
            ) : (
              <p className="text-caption text-[var(--color-text-muted)]">
                The registered legal name.
              </p>
            )}
          </div>
        )
      }}
    </Playground>
  )
}

export { InputStatesDemo }
