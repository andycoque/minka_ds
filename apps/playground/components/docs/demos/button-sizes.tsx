"use client"

import { Plus } from "lucide-react"
import { Button } from "minka-ds"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Sizes playground for Button.
 *
 * Every size in the chosen mode is on screen at once, because a size only means
 * something next to the sizes around it. The chip switches between labelled and
 * icon-only rather than showing both, so neither row is crowded.
 */

const CONTROLS: Control[] = [
  {
    type: "select",
    name: "mode",
    label: "Content",
    options: [
      { value: "label", label: "With label" },
      { value: "icon", label: "Icon only" },
    ],
    defaultValue: "label",
  },
]

// Smallest to largest, so the row reads as the scale it is.
const LABEL_SIZES = ["xs", "sm", "default", "lg"] as const
const ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const

function ButtonSizesDemo() {
  return (
    <Playground controls={CONTROLS} minHeight={150}>
      {(state) => {
        const iconOnly = state.mode === "icon"

        // items-end in both modes: the sizes differ in height, and resting them
        // on a shared bottom edge is how they appear in a real toolbar. Switching
        // modes must not move the specimens, or the chip reads as a layout change
        // rather than a content change.
        if (iconOnly) {
          return (
            <div className="flex flex-wrap items-end justify-center gap-3">
              {ICON_SIZES.map((size) => (
                <Button key={size} size={size} aria-label={`Add (${size})`}>
                  <Plus />
                </Button>
              ))}
            </div>
          )
        }

        return (
          <div className="flex flex-wrap items-end justify-center gap-3">
            {LABEL_SIZES.map((size) => (
              <Button key={size} size={size}>
                {size}
              </Button>
            ))}
          </div>
        )
      }}
    </Playground>
  )
}

export { ButtonSizesDemo }
