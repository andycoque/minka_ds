"use client"

import * as React from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  StatusCell,
} from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Dialog compositions, all taken from product code.
 *
 * `flow` appears in 42 studio files and `DialogPanel` in 10, but neither is
 * documented anywhere, so both get a chip here rather than a paragraph.
 *
 * Sources:
 *   Plain    the confirm dialogs throughout, e.g. liquidity/operator
 *   Flow     the standard for any dialog with a form in it
 *   Panel    liquidity/operator movement action, settings avatar
 */

const CONTROLS: Control[] = [
  {
    type: "select",
    name: "shape",
    label: "Composition",
    options: [
      { value: "plain", label: "Plain" },
      { value: "flow", label: "Flow" },
      { value: "panel", label: "With panel" },
    ],
    defaultValue: "plain",
  },
]

function DialogDemo() {
  return (
    <Playground
      controls={CONTROLS}
      minHeight={140}
      details={(state) => {
        const shape = String(state.shape)
        return (
          <Anatomy>
            <Part name="DialogTrigger">
              Opens it. Use <Code>asChild</Code> to keep your own button.
            </Part>
            <Part name="DialogHeader">
              Holds <Code>DialogTitle</Code> and <Code>DialogDescription</Code>.
            </Part>
            {shape === "panel" ? (
              <Part name="DialogPanel">
                A context surface for the thing being acted on.{" "}
                <Code>placement</Code> is <Code>side</Code> or <Code>top</Code>;{" "}
                <Code>inset</Code> floats it with an 8px frame.
              </Part>
            ) : null}
            <Part name="DialogFooter">The actions, primary last.</Part>
            {shape === "flow" ? (
              <Part name="flow">
                Caps the height and makes the children a scrolling flex column.
              </Part>
            ) : null}
          </Anatomy>
        )
      }}
    >
      {(state) => {
        const shape = String(state.shape)

        if (shape === "panel") {
          return (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open with panel</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogPanel
                  placement="side"
                  inset
                  className="justify-start gap-4 bg-[var(--color-bg-base)] sm:w-[44%]"
                >
                  <div className="space-y-1">
                    <p className="text-caption text-[var(--color-text-muted)]">Movement</p>
                    <p className="text-heading-4">$1,250,000.00</p>
                  </div>
                  <StatusCell variant="warning">Pending approval</StatusCell>
                  <p className="text-body-sm text-[var(--color-text-muted)]">
                    Banco Davivienda requested a top-up against their operating
                    wallet.
                  </p>
                </DialogPanel>
                <DialogHeader>
                  <DialogTitle>Approve movement</DialogTitle>
                  <DialogDescription>
                    The funds move as soon as this is approved.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-1.5">
                  <Label htmlFor="dlg-note">Note</Label>
                  <Input id="dlg-note" placeholder="Optional" />
                </div>
                <DialogFooter>
                  <Button variant="ghost">Cancel</Button>
                  <Button>Approve</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

        if (shape === "flow") {
          return (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open long form</Button>
              </DialogTrigger>
              <DialogContent flow>
                <DialogHeader>
                  <DialogTitle>Register participant</DialogTitle>
                  <DialogDescription>
                    The form scrolls inside the dialog rather than growing past
                    the screen.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 space-y-4 overflow-y-auto">
                  {[
                    "Legal name",
                    "Trading name",
                    "Tax identifier",
                    "Registered address",
                    "City",
                    "Contact email",
                    "Settlement account",
                  ].map((f) => (
                    <div key={f} className="space-y-1.5">
                      <Label htmlFor={`dlg-${f}`}>{f}</Label>
                      <Input id={`dlg-${f}`} />
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="ghost">Cancel</Button>
                  <Button>Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Revoke API key</DialogTitle>
                <DialogDescription>
                  This cannot be undone. Anything using this key stops working
                  immediately.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancel</Button>
                <Button variant="destructive">Revoke</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }}
    </Playground>
  )
}

export { DialogDemo }
