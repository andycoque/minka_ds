"use client"

import { MoreHorizontal, Trash2 } from "lucide-react"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * The three anchored overlays plus Sheet.
 *
 * Popover, Tooltip and DropdownMenu share one Radix shape (trigger, portal,
 * anchored content) and one animation, so their panels are deliberately
 * parallel: a reader who learns one has learned all three.
 */

const SIDES: Control[] = [
  {
    type: "select",
    name: "side",
    label: "Side",
    options: [
      { value: "top", label: "Top" },
      { value: "right", label: "Right" },
      { value: "bottom", label: "Bottom" },
      { value: "left", label: "Left" },
    ],
    defaultValue: "bottom",
  },
]

type Side = "top" | "right" | "bottom" | "left"

function PopoverDemo() {
  return (
    <Playground
      controls={SIDES}
      minHeight={170}
      details={() => (
        <Anatomy>
          <Part name="PopoverTrigger">
            The control it hangs off. <Code>asChild</Code> keeps your own button.
          </Part>
          <Part name="PopoverContent">
            The floating surface. <Code>side</Code> and <Code>align</Code> place
            it; it flips automatically when there is no room.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Set a limit</Button>
          </PopoverTrigger>
          <PopoverContent side={String(state.side) as Side} className="w-64">
            <div className="space-y-1.5">
              <Label htmlFor="pop-limit">Daily limit</Label>
              <Input id="pop-limit" placeholder="1,250,000" />
              <p className="text-caption text-[var(--color-text-muted)]">
                Applies from the next settlement window.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </Playground>
  )
}

function TooltipDemo() {
  return (
    <Playground
      controls={SIDES}
      minHeight={150}
      details={() => (
        <Anatomy>
          <Part name="TooltipTrigger">
            The control being explained. Must be focusable, or keyboard readers
            never see the tooltip.
          </Part>
          <Part name="TooltipContent">
            One short line. Not a place for a paragraph or a control.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Delete">
              <Trash2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent side={String(state.side) as Side}>
            Delete this bridge
          </TooltipContent>
        </Tooltip>
      )}
    </Playground>
  )
}

function DropdownMenuDemo() {
  return (
    <Playground
      controls={SIDES}
      minHeight={170}
      details={() => (
        <Anatomy>
          <Part name="DropdownMenuTrigger">
            Usually a kebab button in an <Code>ActionCell</Code>.
          </Part>
          <Part name="DropdownMenuLabel" optional>
            Names the group when the menu holds more than one kind of action.
          </Part>
          <Part name="DropdownMenuItem">
            One action. Destructive ones go last, under a separator.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={String(state.side) as Side} align="start">
            <DropdownMenuLabel>Bridge</DropdownMenuLabel>
            <DropdownMenuItem>Edit configuration</DropdownMenuItem>
            <DropdownMenuItem>Assign wallets</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Suspend</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Playground>
  )
}

const SHEET_SIDES: Control[] = [
  {
    type: "select",
    name: "side",
    label: "Side",
    options: [
      { value: "right", label: "Right" },
      { value: "left", label: "Left" },
      { value: "top", label: "Top" },
      { value: "bottom", label: "Bottom" },
    ],
    defaultValue: "right",
  },
]

function SheetDemo() {
  return (
    <Playground
      controls={SHEET_SIDES}
      minHeight={140}
      details={() => (
        <Anatomy>
          <Part name="SheetTrigger">Opens it.</Part>
          <Part name="SheetHeader">
            Holds <Code>SheetTitle</Code> and <Code>SheetDescription</Code>.
          </Part>
          <Part name="SheetFooter" optional>
            Actions, when the sheet is editable rather than just a reader.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open sheet</Button>
          </SheetTrigger>
          <SheetContent side={String(state.side) as Side}>
            <SheetHeader>
              <SheetTitle>Delivery detail</SheetTitle>
              <SheetDescription>
                The request and response for this attempt.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </Playground>
  )
}

export { PopoverDemo, TooltipDemo, DropdownMenuDemo, SheetDemo }
