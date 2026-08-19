"use client"

import { ArrowRight, Plus } from "lucide-react"
import { Button } from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Anatomy playground for Button.
 *
 * The controls are structural only — which parts are present, not which variant
 * or size. That is the section's job: show the parts a button is assembled from
 * and which of them are optional. Variant and size are compared in their own
 * grids further down the page.
 *
 * The parts list below the stage tracks the selection, so it only ever describes
 * parts that are actually on screen. Reading about a trailing icon while looking
 * at a button that has none is the thing this avoids.
 *
 * The button is real and clickable, with no onClick, so the reader can feel the
 * hover, the press and the focus ring rather than read about them.
 */

// Disabled deliberately absent: it lives in States, alongside the other states.
const CONTROLS: Control[] = [
  {
    type: "select",
    name: "icon",
    label: "Icon",
    options: [
      { value: "none", label: "None" },
      { value: "leading", label: "Leading" },
      { value: "trailing", label: "Trailing" },
      { value: "only", label: "Icon only" },
    ],
    defaultValue: "none",
  },
]

function ButtonAnatomyDemo() {
  return (
    <Playground
      controls={CONTROLS}
      details={(state) => {
        const icon = state.icon
        const iconOnly = icon === "only"

        // One line each, naming what the part IS. Guidance on how to use it
        // belongs in Do / Don't, and the reasoning belongs in prose; a parts
        // list that argues its case stops being scannable.
        return (
          <Anatomy>
            {iconOnly ? (
              <Part name="size">
                One of the <Code>icon*</Code> values. Square, no text child.
              </Part>
            ) : (
              <Part name="children">The label, in sentence case.</Part>
            )}

            {icon === "leading" ? (
              <Part name="Leading icon">
                A <Code>lucide-react</Code> icon as the first child.
              </Part>
            ) : null}

            {icon === "trailing" ? (
              <Part name="Trailing icon">
                A <Code>lucide-react</Code> icon as the last child.
              </Part>
            ) : null}

            {iconOnly ? (
              <>
                <Part name="Icon">The only child.</Part>
                <Part name="aria-label">
                  The accessible name. The icon carries no text.
                </Part>
              </>
            ) : null}
          </Anatomy>
        )
      }}
    >
      {(state) => {
        const icon = state.icon

        // The label changes with the icon, because the pairing is the point. A
        // leading plus means "this creates something"; a trailing arrow means
        // "this continues"; the same words cannot carry both.
        if (icon === "only") {
          return (
            <Button size="icon" aria-label="Add participant">
              <Plus />
            </Button>
          )
        }

        if (icon === "leading") {
          return (
            <Button>
              <Plus />
              Add participant
            </Button>
          )
        }

        if (icon === "trailing") {
          return (
            <Button>
              Continue
              <ArrowRight />
            </Button>
          )
        }

        return <Button>Save changes</Button>
      }}
    </Playground>
  )
}

export { ButtonAnatomyDemo }
