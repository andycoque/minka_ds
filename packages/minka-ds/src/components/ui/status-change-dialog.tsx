"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

import { Info, TriangleAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Button } from "./button"
import { STATUS_DOT, type StatusCellVariant } from "./cell"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from "./dialog"
import { Input } from "./input"
import { Label } from "./label"
import { RadioCard, RadioGroup } from "./radio-group"

/**
 * Change the status of a policy-managed record.
 *
 * Status on this ledger is not a boolean and not a fixed enum: a policy defines
 * the states, they vary by ledger, and a record can usually move to any of them
 * rather than flipping between two. So the UI cannot hardcode the transition the
 * way a Deactivate button does.
 *
 * The SELECTION is the deliberate act. Picking a named state out of a list is a
 * decision the reader has to make on purpose, so an ordinary confirm is enough for
 * most transitions and type-to-confirm would just be ceremony. A state marked
 * `destructive` adds the typed word back, for the ones that cannot be walked back.
 *
 * States the record can reach only by itself are left out of the list: an instrument
 * becomes `expired` when its timeout elapses, so offering it would imply a person can
 * set it. Pass `reachable: false` and it is dropped, because an option that can never
 * be picked is noise in a list of choices.
 */

interface StatusOption {
  value: string
  label: string
  variant: StatusCellVariant
  /** What choosing this does, in one line. Shown on the option row. */
  description?: string
  /**
   * The immediate consequence: what happens the moment this state is set. One short
   * sentence, shown as the alert's lead line in the side panel. Falls back to nothing
   * rather than repeating `description`.
   */
  outcome?: string
  /**
   * What that means afterwards: whether it can be walked back, what survives, any
   * caveat. Shown as the alert's second line, in muted ink.
   *
   * Split from `outcome` because a single long sentence in a narrow panel reads as a
   * paragraph to work through rather than a fact plus its consequence.
   */
  outcomeDetail?: string
  /**
   * False for a state only the system can set, e.g. one driven by a timeout. Dropped
   * from the list rather than shown as an option nobody can choose.
   */
  reachable?: boolean
  /**
   * Cannot be undone. Adds a typed confirmation before the action is enabled, and
   * forces the dot to `error` whatever `variant` says: irrevocable is a warning, and
   * the colour has to say so before the reader commits.
   */
  destructive?: boolean
}

interface StatusChangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** What the record is, for the title: "alias", "QR code". */
  recordLabel: string
  /** The record's own name, shown under the title. */
  recordName?: React.ReactNode
  current: string
  options: StatusOption[]
  onConfirm: (next: string) => void
  /**
   * The record's own detail, rendered in the side panel above the status block, so
   * the thing being changed stays in view while the reader picks a state. Pass the
   * same content the record's creation flow shows, e.g. its resolution diagram.
   */
  detail?: React.ReactNode
  /** Styling for the panel that holds `detail`, e.g. the creation flow's dot grid. */
  detailClassName?: string
  detailStyle?: React.CSSProperties
}

function StatusChangeDialog({
  open,
  onOpenChange,
  recordLabel,
  recordName,
  current,
  options,
  onConfirm,
  detail,
  detailClassName,
  detailStyle,
}: StatusChangeDialogProps) {
  const [next, setNext] = React.useState<string | null>(null)
  const [typed, setTyped] = React.useState("")

  // Reset on every open, so a dialog reopened after a cancel does not remember the
  // state the reader backed out of.
  React.useEffect(() => {
    if (!open) return
    setNext(null)
    setTyped("")
  }, [open])

  const selectable = options.filter(o => o.value !== current && o.reachable !== false)
  const currentOption = options.find(o => o.value === current)
  const selected = options.find(o => o.value === next)
  const needsTyped = !!selected?.destructive
  const typedOk = !needsTyped || typed.trim().toLowerCase() === selected!.label.toLowerCase()
  const canConfirm = next != null && typedOk

  /** Destructive states are red regardless of `variant`: irrevocable is a warning. */
  function dotVariant(o: StatusOption | undefined): StatusCellVariant {
    if (!o) return "neutral"
    return o.destructive ? "error" : o.variant
  }

  // The outcome alert animates its height rather than mounting, so the panel grows into
  // it. That needs two pieces of state: whether the row is open, and what to render
  // while it closes — a state with no `outcome` would otherwise blank the copy instantly
  // and leave an empty box collapsing.
  const outcomeSource = selected?.outcome ? selected : undefined
  // A stable dependency for the effect below. `outcomeSource` is an object from a
  // caller-owned array, so depending on it directly would re-fire on every render if
  // that array is rebuilt inline.
  const outcomeKey = outcomeSource?.value ?? null
  const heldOutcome = React.useRef<StatusOption | undefined>(undefined)
  if (outcomeSource) heldOutcome.current = outcomeSource

  const [outcomeOpen, setOutcomeOpen] = React.useState(false)
  const [outcomeRetained, setOutcomeRetained] = React.useState(false)
  if (outcomeSource && !outcomeRetained) setOutcomeRetained(true)

  React.useEffect(() => {
    if (outcomeKey != null) {
      // One frame at 0fr first, or there is no start value to animate from.
      const raf = requestAnimationFrame(() => setOutcomeOpen(true))
      return () => cancelAnimationFrame(raf)
    }
    setOutcomeOpen(false)
    const id = setTimeout(() => setOutcomeRetained(false), 260)
    return () => clearTimeout(id)
  }, [outcomeKey])

  const outcomeShown = outcomeSource ?? (outcomeRetained ? heldOutcome.current : undefined)

  function confirm() {
    if (!canConfirm || next == null) return
    onConfirm(next)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* The panel keeps the record itself in view while the reader picks a state,
            so the context stays present through the action. The status sits above the
            object, centred, and the warning below it: the consequence belongs with the
            object it applies to, not next to the control. */}
        <DialogPanel
          placement="side"
          inset
          className={cn("items-stretch justify-center gap-4 overflow-y-auto", detailClassName)}
          style={detailStyle}
        >
          {/* The centred group is the panel's anchor: it stays put whatever appears
              below it, so choosing a state never shifts the object card. */}
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-caption text-[var(--color-text-muted)]">
                {selected ? "Changing to" : "Current status"}
              </span>
              {/* Same shape either way, so the panel does not reflow on selection. */}
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-2 shrink-0 rounded-full transition-colors duration-200",
                    STATUS_DOT[dotVariant(selected ?? currentOption)],
                  )}
                />
                <span className="text-heading-4 text-[var(--color-text-default)]">
                  {(selected ?? currentOption)?.label ?? current}
                </span>
              </span>
            </div>

            {detail}
          </div>

          {/* The alert's height is animated rather than mounted, so the panel grows into
              it instead of snapping. grid-rows 0fr -> 1fr animates to the content's own
              height, which is unknown here because the outcome copy varies per state.

              The content is held through the collapse (see `outcomeShown`) so switching
              from a state with copy to one without still animates out. */}
          <div
            className={cn(
              "mt-auto grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
              outcomeOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              {/* pt-4 lives on the inner element, not the grid, so the spacing collapses
                  with the content rather than leaving a gap at 0fr. */}
              <div className="pt-4">
                {outcomeShown && (
                  <Alert
                    variant={outcomeShown.destructive ? "warning" : "info"}
                    className="text-left"
                  >
                    {outcomeShown.destructive ? <TriangleAlert /> : <Info />}
                    <AlertTitle>{outcomeShown.outcome}</AlertTitle>
                    {/* Second line carries the aftermath. For a destructive state the
                        irreversibility outranks any caveat, so it wins the slot. */}
                    {(outcomeShown.destructive || outcomeShown.outcomeDetail) && (
                      <AlertDescription className="text-[var(--color-text-muted)]">
                        {outcomeShown.destructive
                          ? "This cannot be undone."
                          : outcomeShown.outcomeDetail}
                      </AlertDescription>
                    )}
                  </Alert>
                )}
              </div>
            </div>
          </div>

        </DialogPanel>

        <DialogHeader>
          <DialogTitle>Change {recordLabel} status</DialogTitle>
          {recordName && <DialogDescription>{recordName}</DialogDescription>}
        </DialogHeader>

        {/* A radio group rather than a Select: there are few states and seeing them
            all at once is the point, since the reader is choosing between them
            rather than recalling one. */}
        <RadioGroup
          aria-label="New status"
          value={next ?? ""}
          onValueChange={setNext}
        >
          {selectable.map(o => (
              <RadioCard
                key={o.value}
                value={o.value}
                // Not a StatusCell: that colours the label and leads with the dot,
                // which is right when REPORTING a state. Here the state is an option
                // being chosen, so the label stays in the default text colour and
                // the dot trails as a quiet marker of which state it is.
                label={
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-body text-[var(--color-text-default)]">{o.label}</span>
                    <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[dotVariant(o)])} />
                  </span>
                }
                description={o.description}
                // Only the selected destructive card reveals the field, so an
                // unselected card keeps its own border (see RadioCard's `expanded`).
                expanded={
                  o.destructive && next === o.value ? (
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="status-change-confirm" className="block">
                        Type <span className="font-medium">{o.label}</span> to confirm
                      </Label>
                      <Input
                        id="status-change-confirm"
                        value={typed}
                        placeholder={o.label}
                        autoFocus
                        onChange={e => setTyped(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && canConfirm) confirm()
                        }}
                      />
                    </div>
                  ) : undefined
                }
              />
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {/* aria-disabled rather than disabled, matching the Wizard: the click
              still lands, so a reader who has not chosen yet is not left wondering
              why nothing happens. */}
          <Button
            variant={selected?.destructive ? "destructive" : "default"}
            onClick={confirm}
            aria-disabled={!canConfirm}
            className={!canConfirm ? "opacity-50 cursor-not-allowed" : ""}
          >
            Change status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { StatusChangeDialog }
export type { StatusChangeDialogProps, StatusOption }
