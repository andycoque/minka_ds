"use client"

import * as React from "react"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
  DialogClose, DialogTrigger, DialogPanel,
  Button, Input, Label,
  InputGroup, InputGroupAddon, InputGroupInput,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "minka-ds"
import { FlowDiagram, type FlowNode } from "minka-ds"

const ACH_BALANCE = 50_000_000_000
const PARTICIPANTS = [
  { id: "bancolombia", name: "Bancolombia", balance: 1_500_000_000 },
  { id: "davivienda",  name: "Davivienda",  balance: 950_000_000 },
  { id: "bogota",      name: "Banco de Bogotá", balance: 510_000_000 },
]

export function BalanceActionDemo({
  container,
  type = "Top-up",
}: {
  container?: HTMLElement | null
  type?: "Top-up" | "Withdraw"
}) {
  const [participantId, setParticipantId] = React.useState("")
  const [amountRaw, setAmountRaw] = React.useState("")
  const [reference, setReference] = React.useState("")

  const amount = parseFloat(amountRaw.replace(/,/g, "")) || 0
  const participant = PARTICIPANTS.find(p => p.id === participantId)
  const isTopUp = type === "Top-up"

  // Fixed positions: participant on top, ACH master at the bottom (foundation).
  // Only the flow direction changes: top-up sends funds up (→ participant),
  // withdraw sends them down (→ ACH).
  const achNode: FlowNode = {
    name: "ACH master",
    current: ACH_BALANCE,
    after: amount > 0 ? (isTopUp ? ACH_BALANCE - amount : ACH_BALANCE + amount) : null,
    subtitle: "Master balance",
  }
  const pNode: FlowNode = {
    name: participant?.name ?? "Select participant",
    current: participant?.balance ?? null,
    after: participant && amount > 0 ? (isTopUp ? participant.balance + amount : participant.balance - amount) : null,
    empty: !participant,
  }
  const direction = isTopUp ? "up" : "down"

  function handleAmount(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^\d]/g, "")
    setAmountRaw(raw ? Number(raw).toLocaleString("en-US") : "")
  }

  return (
    <Dialog onOpenChange={(o) => { if (!o) { setParticipantId(""); setAmountRaw(""); setReference("") } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">{type} · flow</Button>
      </DialogTrigger>

      <DialogContent container={container} className="sm:max-w-3xl">
        {/* ── Live flow diagram, on a subtle dot-grid surface ── */}
        <DialogPanel
          placement="side"
          inset
          className="bg-[var(--color-bg-base)] sm:w-[44%] justify-center"
          style={{
            // orthogonal hairline grid — echoes the brand's vertical/horizontal
            // line motifs (the substrate the texture SVGs are drawn on)
            backgroundImage:
              "linear-gradient(to right, var(--color-border-subtle) 1px, transparent 1px), " +
              "linear-gradient(to bottom, var(--color-border-subtle) 1px, transparent 1px)",
            backgroundSize: "8px 8px",
          }}
        >
          <FlowDiagram top={pNode} bottom={achNode} amount={amount} direction={direction} />
        </DialogPanel>

        {/* ── Form body ── */}
        <DialogHeader>
          <DialogTitle className="pr-10">{type} funds</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Participant <span className="text-[var(--color-feedback-error)]">*</span></Label>
            <Select value={participantId} onValueChange={setParticipantId}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select participant" /></SelectTrigger>
              <SelectContent>
                {PARTICIPANTS.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Amount <span className="text-[var(--color-feedback-error)]">*</span></Label>
            <InputGroup>
              <InputGroupAddon align="inline-start">$</InputGroupAddon>
              <InputGroupInput placeholder="0" value={amountRaw} onChange={handleAmount} />
              <InputGroupAddon align="inline-end">COP</InputGroupAddon>
            </InputGroup>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Reference <span className="text-[var(--color-feedback-error)]">*</span></Label>
            <Input placeholder="e.g. JIRA-1234" value={reference} onChange={e => setReference(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-auto pt-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button aria-disabled={!(amount > 0 && participant && reference.trim())}
            className={!(amount > 0 && participant && reference.trim()) ? "opacity-50 cursor-not-allowed" : ""}>
            Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
