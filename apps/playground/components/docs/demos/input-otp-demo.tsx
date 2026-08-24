"use client"

import * as React from "react"
import { InputOTP, Label } from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * InputOTP, taken from the login two-factor step, which is its only usage.
 *
 * The specimen is real and typeable, which matters more here than on most
 * components: the whole point of this input is what happens as you type into it.
 * Paste a six-digit code and it distributes across the boxes; backspace on an
 * empty box steps back to the previous one.
 *
 * `length` is a chip rather than a fixed 6, because it is a genuine prop and a
 * four-box code looks materially different from a six-box one.
 */

const CONTROLS: Control[] = [
  {
    type: "select",
    name: "length",
    label: "Length",
    options: [
      { value: "4", label: "4 digits" },
      { value: "6", label: "6 digits" },
    ],
    defaultValue: "6",
  },
]

/** Invalid and disabled are states, not things the author sets to shape the field. */
const STATE_CONTROLS: Control[] = [
  {
    type: "select",
    name: "state",
    label: "State",
    options: [
      { value: "default", label: "Default" },
      { value: "invalid", label: "Invalid" },
      { value: "disabled", label: "Disabled" },
    ],
    defaultValue: "default",
  },
]

function InputOTPDemo() {
  const [code, setCode] = React.useState("")

  return (
    <Playground
      controls={CONTROLS}
      minHeight={170}
      details={() => (
        <Anatomy>
          <Part name="value / onChange">
            Controlled, as one string rather than an array of digits.
          </Part>
          <Part name="onComplete" optional>
            Fires when the last box fills. Submit from here rather than making the
            reader press a button they have already earned.
          </Part>
          <Part name="length" optional>
            Number of boxes. Six by default.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        const length = Number(state.length)
        return (
          <div className="flex flex-col items-start gap-2.5">
            <Label>Authentication code</Label>
            <InputOTP
              key={length}
              length={length}
              value={code.slice(0, length)}
              onChange={setCode}
            />
            <p className="text-caption text-[var(--color-text-muted)]">
              Type into it, or paste a {length}-digit code.
            </p>
          </div>
        )
      }}
    </Playground>
  )
}

/**
 * The same field in each of its states. Seeded with a partial code so invalid has
 * something to mark: an empty field in error reads as untouched rather than wrong.
 */
function InputOTPStatesDemo() {
  const [code, setCode] = React.useState("1234")

  return (
    <Playground
      controls={STATE_CONTROLS}
      minHeight={150}
      details={(state) => (
        <Anatomy>
          <Part name="invalid" optional>
            {state.state === "invalid"
              ? "Draws the error border on every box. Clear it on the next keystroke, so it describes this attempt rather than the last one."
              : "Draws the error border on every box."}
          </Part>
          <Part name="disabled" optional>
            Blocks input and drops opacity. For a code that is being verified, not
            for one the reader has not reached yet.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="flex flex-col items-start gap-2.5">
          <Label>Authentication code</Label>
          <InputOTP
            length={6}
            value={code}
            onChange={setCode}
            invalid={state.state === "invalid"}
            disabled={state.state === "disabled"}
          />
        </div>
      )}
    </Playground>
  )
}

export { InputOTPDemo, InputOTPStatesDemo }
