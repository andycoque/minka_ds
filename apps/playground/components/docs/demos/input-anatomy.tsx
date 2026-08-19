"use client"

import * as React from "react"
import { Eye, EyeOff, Search } from "lucide-react"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  Label,
} from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Anatomy playground for Input.
 *
 * Every composition past Plain is an `InputGroup`, not an `Input`: a bare Input
 * has no slot for an icon, an affix or a trailing button.
 *
 * All four are taken from real product code rather than invented, because a docs
 * page that shows a plausible-looking composition nobody uses teaches the wrong
 * thing. Sources:
 *
 *   Amount           participants/[id]/accounts/[accountId] — $ prefix, currency suffix
 *   Prefix + suffix  login — https:// and .minka.io around a ledger slug
 *   Password         reset, login/_auth-form — reveal button, and NO lock icon
 *   Leading icon     the one shape with no product instance; SearchBar covers
 *                    search, so this is the generic form of the addon slot
 */

const CONTROLS: Control[] = [
  {
    type: "select",
    name: "shape",
    label: "Composition",
    options: [
      { value: "plain", label: "Plain" },
      { value: "amount", label: "Amount" },
      { value: "wrapped", label: "Prefix and suffix" },
      { value: "password", label: "Password" },
      { value: "icon", label: "Leading icon" },
    ],
    defaultValue: "plain",
  },
]

const LABELS: Record<string, string> = {
  plain: "Participant name",
  amount: "Opening balance",
  wrapped: "Ledger URL",
  password: "New password",
  icon: "Search",
}

const NOTES: Record<string, string> = {
  plain: "A bare Input. No slots for anything around the field.",
  amount: "InputGroupAddon at both edges, from the account balance field.",
  wrapped: "InputGroupText sits directly in the group, no Addon wrapper.",
  password: "A reveal button in a trailing Addon. No lock icon in the real one.",
  icon: "An icon in a leading Addon.",
}

function InputAnatomyDemo() {
  const [visible, setVisible] = React.useState(false)

  return (
    <Playground
      controls={CONTROLS}
      minHeight={170}
      // The parts list follows the composition, so the reader never reads about a
      // slot that is not on screen. The prose above the panel names the full set,
      // so filtering does not hide `InputGroupText` from discovery.
      details={(state) => {
        const shape = String(state.shape)
        const group = shape !== "plain"
        return (
          <Anatomy>
            <Part name="Label">
              Bound with <Code>htmlFor</Code>. Not a placeholder.
            </Part>
            <Part name={group ? "InputGroupInput" : "Input"}>
              The field itself.
            </Part>
            {shape === "amount" || shape === "icon" ? (
              <Part name="InputGroupAddon">
                A short string or an icon at either edge.
              </Part>
            ) : null}
            {shape === "wrapped" ? (
              <Part name="InputGroupText">
                A longer affix that reads as part of the value. No Addon wrapper.
              </Part>
            ) : null}
            {shape === "password" ? (
              <Part name="InputGroupButton">
                A button inside the field, in a trailing Addon.
              </Part>
            ) : null}
            <Part name="Help text" optional>
              One line under the field. Becomes the error message when invalid.
            </Part>
          </Anatomy>
        )
      }}
    >
      {(state) => {
        const shape = String(state.shape)

        return (
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="ds-input-anatomy">{LABELS[shape]}</Label>

            {shape === "plain" ? (
              <Input id="ds-input-anatomy" placeholder="Banco Davivienda" />
            ) : null}

            {shape === "amount" ? (
              <InputGroup>
                <InputGroupAddon align="inline-start">$</InputGroupAddon>
                <InputGroupInput
                  id="ds-input-anatomy"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                />
                <InputGroupAddon align="inline-end">COP</InputGroupAddon>
              </InputGroup>
            ) : null}

            {shape === "wrapped" ? (
              <InputGroup>
                <InputGroupText className="pr-0">https://</InputGroupText>
                <InputGroupInput id="ds-input-anatomy" placeholder="your-ledger" />
                <InputGroupText className="pl-0">.minka.io</InputGroupText>
              </InputGroup>
            ) : null}

            {shape === "password" ? (
              <InputGroup>
                <InputGroupInput
                  id="ds-input-anatomy"
                  type={visible ? "text" : "password"}
                  defaultValue="correct-horse-battery"
                  autoComplete="new-password"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setVisible((v) => !v)}
                    aria-label="Toggle password"
                  >
                    {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            ) : null}

            {shape === "icon" ? (
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Search className="size-4 text-[var(--color-text-hint)]" />
                </InputGroupAddon>
                <InputGroupInput id="ds-input-anatomy" placeholder="Search participants" />
              </InputGroup>
            ) : null}

            <p className="text-caption text-[var(--color-text-muted)]">{NOTES[shape]}</p>
          </div>
        )
      }}
    </Playground>
  )
}

export { InputAnatomyDemo }
