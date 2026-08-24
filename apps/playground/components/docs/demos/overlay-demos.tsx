"use client"

import { Ban, Info, MoreHorizontal, Pencil, Trash2, Wallet } from "lucide-react"
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * The three anchored overlays.
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

/**
 * Content shape rather than position: `side` resolves against the viewport, so it is
 * rarely set by hand. What varies in the product is how much the tooltip carries.
 */
const TOOLTIP_CONTROLS: Control[] = [
  {
    type: "select",
    name: "kind",
    label: "Content",
    options: [
      { value: "label", label: "Label" },
      { value: "explanation", label: "Explanation" },
      { value: "legend", label: "Legend" },
    ],
    defaultValue: "label",
  },
]

function TooltipDemo() {
  return (
    <Playground
      controls={TOOLTIP_CONTROLS}
      minHeight={160}
      details={(state) => (
        <Anatomy>
          <Part name="TooltipTrigger">
            The control being explained. Must be focusable, or keyboard readers never
            see the tooltip.
          </Part>
          <Part name="TooltipContent">
            {state.kind === "label"
              ? "Names an icon-only control. A few words, no punctuation."
              : state.kind === "explanation"
              ? "Explains a rule the label cannot carry. Takes max-w-56 so it wraps rather than stretching across the page."
              : "A short list, e.g. what each status colour means. Takes its own padding, since rows need more room than one line does."}
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        if (state.kind === "legend") {
          return (
            <Tooltip open>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Status legend">
                  <Info />
                </Button>
              </TooltipTrigger>
              {/* The transactions list's status legend, verbatim. */}
              <TooltipContent side="right" className="space-y-1.5 p-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full bg-[var(--color-feedback-success)]" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full bg-[var(--color-feedback-warning)]" />
                  <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rounded-full bg-[var(--primitive-red-500)]" />
                  <span>Failed / Rejected</span>
                </div>
              </TooltipContent>
            </Tooltip>
          )
        }

        if (state.kind === "explanation") {
          return (
            <Tooltip open>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Why can't I edit my email?">
                  <Info />
                </Button>
              </TooltipTrigger>
              {/* The settings page's email tooltip, verbatim. */}
              <TooltipContent side="right" className="max-w-56">
                Your email identifies this account and cannot be changed. Contact your
                admin with any request about it.
              </TooltipContent>
            </Tooltip>
          )
        }

        return (
          <Tooltip open>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Delete">
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Delete this bridge</TooltipContent>
          </Tooltip>
        )
      }}
    </Playground>
  )
}

const MENU_CONTROLS: Control[] = [
  { type: "toggle", name: "icons", label: "With icons", defaultValue: true },
  { type: "toggle", name: "label", label: "Category label", defaultValue: true },
]

function DropdownMenuDemo() {
  return (
    <Playground
      controls={MENU_CONTROLS}
      minHeight={170}
      details={(state) => (
        <Anatomy>
          <Part name="DropdownMenuTrigger">
            Usually a kebab button in an <Code>ActionCell</Code>.
          </Part>
          <Part name="DropdownMenuItem">
            One action. Most carry a leading icon: 30 of the 36 items in the product
            do, so an icon-less item beside them reads as unfinished.
          </Part>
          {state.label ? (
            <Part name="DropdownMenuLabel" optional>
              Names the group when the menu holds more than one kind of action.
              Uncommon: worth it only when the items are not obviously siblings.
            </Part>
          ) : null}
          <Part name="DropdownMenuSeparator" optional>
            Above a destructive action, which goes last.
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
          {/* No `side` chip: position resolves against the viewport, so a menu near the
              bottom of the page flips upward on its own and there is nothing to set. */}
          <DropdownMenuContent align="start">
            {state.label ? <DropdownMenuLabel>Bridge</DropdownMenuLabel> : null}
            <DropdownMenuItem>
              {state.icons ? <Pencil className="size-4" /> : null}Edit configuration
            </DropdownMenuItem>
            <DropdownMenuItem>
              {state.icons ? <Wallet className="size-4" /> : null}Assign wallets
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {state.icons ? <Ban className="size-4" /> : null}Suspend
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </Playground>
  )
}

export { PopoverDemo, TooltipDemo, DropdownMenuDemo }
