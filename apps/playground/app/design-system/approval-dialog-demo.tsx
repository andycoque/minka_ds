"use client"

import * as React from "react"
import { Check } from "lucide-react"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
  DialogClose, DialogTrigger, DialogPanel,
  Button, Input, Textarea, Badge,
} from "minka-ds"

// Realistic sample (from the liquidity approvals mock: a1)
const APPROVAL = {
  type: "Withdraw",
  participant: "Davivienda",
  amount: -200_000_000,
  currency: "COP",
  transactionId: "1490247",
  createdBy: "María Rodríguez",
  date: "Apr 29, 2026 14:55",
  reference: "OPS-4471",
  justification: "Excess reserve rebalancing — end of day settlement",
  quorumCurrent: 1,
  quorumRequired: 2,
}

// Sender/receiver balance flow (Withdraw: participant → RTP System)
const SENDER = { name: "Davivienda", current: 950_000_000, after: 750_000_000 }
const RECEIVER = { name: "RTP System", current: 50_000_000_000, after: 50_200_000_000 }

const fmt = (n: number) => n.toLocaleString("en-US")

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-caption text-[var(--color-text-muted)] pt-px">{label}</span>
      <span className="text-body-sm-light text-[var(--color-text-default)]">{value}</span>
    </>
  )
}

function BalanceSide({ label, name, current, after, className = "" }: { label: string; name: string; current: number; after: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-3 pt-3 pb-4 ${className}`}>
      <span className="text-caption text-[var(--color-text-muted)]">{label}</span>
      <span className="text-body-sm-light text-[var(--color-text-default)]">{name}</span>
      <div className="flex flex-col gap-0.5">
        <span className="text-caption text-[var(--color-text-muted)]">Current</span>
        <span className="text-label-mono text-[var(--color-text-default)]">{fmt(current)}</span>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-caption text-[var(--color-text-muted)]">After</span>
        <span className={`text-label-mono ${after < 0 ? "text-[var(--color-feedback-error)]" : "text-[var(--color-text-default)]"}`}>
          {fmt(after)}
        </span>
      </div>
    </div>
  )
}

// Summary content shared by both layouts. `inset` controls the bleed for the
// balance divider (matches the panel's own padding).
function SummaryContent({ insetClass }: { insetClass: string }) {
  const absAmount = Math.abs(APPROVAL.amount)
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <Badge variant="default" className="text-sm">{APPROVAL.type}</Badge>
        <span className="text-heading-4 text-[var(--color-text-default)]">
          −{fmt(absAmount)}
          <span className="text-body-sm font-normal text-[var(--color-text-muted)] ml-1.5">{APPROVAL.currency}</span>
        </span>
      </div>

      <div className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-2">
        <Meta label="Transaction ID" value={APPROVAL.transactionId} />
        <Meta label="Participant" value={APPROVAL.participant} />
        <Meta label="Requested by" value={APPROVAL.createdBy} />
        <Meta label="Date" value={APPROVAL.date} />
        <Meta label="Reference" value={APPROVAL.reference} />
        <Meta label="Justification" value={APPROVAL.justification} />
      </div>

      <div className={`grid grid-cols-2 divide-x divide-[var(--color-border-default)] border-t border-[var(--color-border-default)] mt-1 ${insetClass}`}>
        <BalanceSide label="Sender" {...SENDER} className="px-4" />
        <BalanceSide label="Receiver" {...RECEIVER} className="px-4" />
      </div>
    </>
  )
}

function ActionBody() {
  const word = "approve"
  const [input, setInput] = React.useState("")
  const [comments, setComments] = React.useState("")
  const confirmed = input.trim().toLowerCase() === word

  return (
    <>
      <DialogHeader>
        <DialogTitle>Approve {APPROVAL.type}</DialogTitle>
        <p className="text-body-sm-light text-[var(--color-text-default)]">
          <span className="font-medium">{APPROVAL.quorumCurrent}/{APPROVAL.quorumRequired}</span> approvals received
        </p>
      </DialogHeader>

      <div className="flex flex-col gap-1.5">
        <label className="text-body-sm-light text-[var(--color-text-default)]">
          Comments <span className="text-caption text-[var(--color-text-muted)]">(optional)</span>
        </label>
        <Textarea
          placeholder="Add any notes for the audit log"
          value={comments}
          onChange={e => setComments(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-body-sm-light text-[var(--color-text-default)]">
          Type <span className="font-bold">&ldquo;{word}&rdquo;</span> to confirm
        </label>
        <Input value={input} onChange={e => setInput(e.target.value)} placeholder={word} />
      </div>

      <DialogFooter className="mt-auto pt-2">
        <DialogClose asChild>
          <Button variant="ghost">Cancel</Button>
        </DialogClose>
        <Button aria-disabled={!confirmed} className={!confirmed ? "opacity-50 cursor-not-allowed" : ""}>
          {confirmed && <Check className="size-4" />}
          Approve
        </Button>
      </DialogFooter>
    </>
  )
}

export function ApprovalDialogDemo({
  container,
  layout = "side",
  inset = false,
}: {
  container?: HTMLElement | null
  layout?: "side" | "top"
  inset?: boolean
}) {
  const label =
    layout === "side"
      ? (inset ? "summary side · inset" : "summary side")
      : "summary top"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Approve · {label}</Button>
      </DialogTrigger>

      <DialogContent container={container} className={layout === "side" ? "sm:max-w-3xl" : "sm:max-w-lg"}>
        <DialogPanel
          placement={layout}
          inset={inset}
          className={
            layout === "side"
              ? "bg-[var(--color-bg-base)] sm:w-[44%] justify-start gap-4"
              : "bg-[var(--color-bg-base)] justify-start gap-4"
          }
        >
          <SummaryContent insetClass={inset ? "-mx-4 -mb-4" : "-mx-6 -mb-6"} />
        </DialogPanel>

        <ActionBody />
      </DialogContent>
    </Dialog>
  )
}
