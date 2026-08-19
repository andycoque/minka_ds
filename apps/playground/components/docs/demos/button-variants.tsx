"use client"

import { Button } from "minka-ds"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Variants playground for Button.
 *
 * Every variant is on screen at once, each under its own name. The grid is the
 * point of this section: a variant choice is always relative to the buttons
 * beside it, so showing one at a time behind a selector would remove the only
 * thing worth looking at.
 *
 * The two controls are modifiers on the whole set rather than a way to pick one
 * specimen. Disabled is here (and not only in States) because the useful question
 * is what all six look like disabled together, which a per-variant row cannot
 * answer.
 */

// `On dark` is deliberately absent for now: the dark panel needs polish before
// it earns a place here. The Playground still supports it via the `dark` prop.
const CONTROLS: Control[] = [
  { type: "toggle", name: "disabled", label: "Disabled", defaultValue: false },
]

// Ordered by emphasis, loudest first, so the row reads as a ladder. `link` is
// last because it is barely a button.
//
// The variant name IS the label. A caption underneath repeated the same word in a
// second place, and the prose below the panel already carries which variant suits
// which job, so the specimen only has to be identifiable.
const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const

function ButtonVariantsDemo() {
  return (
    <Playground controls={CONTROLS} minHeight={190}>
      {(state) => {
        const disabled = Boolean(state.disabled)

        return (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} disabled={disabled}>
                {variant}
              </Button>
            ))}
          </div>
        )
      }}
    </Playground>
  )
}

export { ButtonVariantsDemo }
