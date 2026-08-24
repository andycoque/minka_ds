"use client"

import * as React from "react"
import { Button, StatusCell } from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Playground } from "@/components/docs/playground"

/**
 * The three layers on one ordinary card.
 *
 * No chips: the point is not something the reader configures, it is that every value
 * on this card comes from the token layer. Naming each one beside the card is what
 * makes the layering visible; a control to toggle it would imply bypassing the tokens
 * is a supported option.
 */

/** One row: what the card uses, and what it resolves through. */
function TokenRow({
  label,
  token,
  primitive,
}: {
  label: string
  token: string
  primitive: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-caption text-[var(--color-text-muted)]">{label}</span>
      <span className="flex flex-wrap items-baseline gap-1.5">
        <span
          className="text-caption text-[var(--color-text-default)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {token}
        </span>
        <span aria-hidden className="text-caption text-[var(--color-text-hint)]">
          →
        </span>
        <span
          className="text-caption text-[var(--color-text-hint)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {primitive}
        </span>
      </span>
    </div>
  )
}

function LayerDemo() {
  return (
    <Playground
      controls={[]}
      minHeight={250}
      details={() => (
        <Anatomy>
          <Part name="Components">
            <code>StatusCell</code> and <code>Button</code>, unmodified. They resolve
            their own tokens, so they follow a theme without the page doing anything.
          </Part>
          <Part name="Semantic tokens">
            Every colour, radius and type style on the card. Redefining these is what a
            theme does; the card itself needs no change.
          </Part>
          <Part name="Primitives">
            The values underneath, reached only through a semantic token.
          </Part>
        </Anatomy>
      )}
    >
      {() => (
        <div className="flex w-full max-w-lg flex-col gap-4 sm:flex-row sm:items-start">
          {/* An ordinary directory-key card, built the way a product surface builds
              one: nothing here names a value. */}
          <div className="flex flex-1 flex-col gap-3 [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] p-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-body text-[var(--color-text-default)]">
                pay.bancolombia
              </span>
              <StatusCell variant="success">Active</StatusCell>
            </div>
            <span className="text-body-sm text-[var(--color-text-muted)]">
              Resolves to account 0345 6678 9012
            </span>
            <div className="flex justify-end">
              <Button size="sm" variant="outline">
                Change status
              </Button>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:w-52">
            <TokenRow
              label="Surface"
              token="--color-bg-raised"
              primitive="neutral-0"
            />
            <TokenRow
              label="Outline"
              token="--color-border-default"
              primitive="neutral-200"
            />
            <TokenRow
              label="Title"
              token="--color-text-default"
              primitive="neutral-950"
            />
            <TokenRow
              label="Corner"
              token="--radius-card"
              primitive="radius-lg"
            />
          </div>
        </div>
      )}
    </Playground>
  )
}

export { LayerDemo }
