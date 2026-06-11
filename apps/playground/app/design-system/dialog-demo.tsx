"use client"

import * as React from "react"
import { Trash2, UserPlus, Info, ShieldCheck, PanelLeft, PanelTop } from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogPanel,
  Button, Input, Label,
  FullWidthLTexture,
} from "minka-ds"
import { ApprovalDialogDemo } from "./approval-dialog-demo"
import { BalanceActionDemo } from "./balance-action-demo"

function FakeAppBg() {
  return (
    <div className="flex-1 p-4 space-y-3 pointer-events-none select-none overflow-hidden">
      <div className="h-4 w-1/4 rounded bg-[var(--color-bg-disabled)]" />
      <div className="grid grid-cols-3 gap-3 pt-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-[var(--color-border-subtle)] p-3 space-y-2 bg-[var(--color-bg-raised)]">
            <div className="h-3 w-2/3 rounded bg-[var(--color-bg-disabled)]" />
            <div className="h-3 w-1/2 rounded bg-[var(--color-bg-disabled)]" />
            <div className="h-3 w-3/4 rounded bg-[var(--color-bg-disabled)]" />
          </div>
        ))}
      </div>
      <div className="space-y-2 pt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-3 rounded bg-[var(--color-bg-disabled)]" style={{ width: `${70 + i * 10}%` }} />
        ))}
      </div>
    </div>
  )
}

export function DialogDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  const [fullScreen, setFullScreen] = React.useState(false)

  React.useEffect(() => { setContainer(containerRef.current) }, [])

  // When full-screen is on, dialogs portal to the real viewport (no container).
  const portalContainer = fullScreen ? undefined : container

  return (
    <div
      ref={containerRef}
      className="relative h-[640px] overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] flex flex-col [transform:translateZ(0)]"
    >
      {/* Fake app header */}
      <div className="flex items-center justify-between h-12 shrink-0 border-b border-[var(--color-border-subtle)] px-4">
        <span className="text-label text-[var(--color-text-default)]">Workspace</span>
        <Button
          variant={fullScreen ? "default" : "outline"}
          size="sm"
          onClick={() => setFullScreen(v => !v)}
        >
          {fullScreen ? "Full view: on" : "Full view: off"}
        </Button>
      </div>

      <FakeAppBg />

      {/* Trigger row */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)] px-4 py-3 flex gap-2 flex-wrap bg-[var(--color-bg-canvas)]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Confirm action</Button>
          </DialogTrigger>
          <DialogContent container={portalContainer}>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><UserPlus />Invite member</Button>
          </DialogTrigger>
          <DialogContent container={portalContainer}>
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>
                Enter the details of the person you&apos;d like to invite to this workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="invite-name">Full name</Label>
                <Input id="invite-name" placeholder="Jane Doe" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-email">Email address</Label>
                <Input id="invite-email" type="email" placeholder="jane@company.com" />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button>Send invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><Trash2 />Delete record</Button>
          </DialogTrigger>
          <DialogContent container={portalContainer}>
            <DialogHeader>
              <DialogTitle>Delete this record?</DialogTitle>
              <DialogDescription>
                This will permanently delete the client record and all associated data.
                This action cannot be reversed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Panel · side ───────────────────────────────────────────── */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><PanelLeft />Panel · side</Button>
          </DialogTrigger>
          <DialogContent container={portalContainer}>
            <DialogPanel
              placement="side"
              className="bg-[var(--color-pair-blue-navy-light)] text-[var(--color-pair-blue-navy-dark)] gap-3"
            >
              <ShieldCheck className="size-6" />
              <p className="text-body-sm-serif">
                Approvals require quorum. Once submitted, signers are notified to review and
                co-sign before the movement executes.
              </p>
            </DialogPanel>

            <DialogHeader>
              <DialogTitle>Approve movement</DialogTitle>
              <DialogDescription>
                You&apos;re approving a withdrawal of $200,000,000 to Davivienda.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="approve-note">Note (optional)</Label>
                <Input id="approve-note" placeholder="Add a note for other signers" />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button>Approve</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Approval (real-world replica) ──────────────────────────── */}
        <ApprovalDialogDemo container={portalContainer} layout="side" />
        <ApprovalDialogDemo container={portalContainer} layout="side" inset />
        <ApprovalDialogDemo container={portalContainer} layout="top" />

        {/* ── Live flow diagram (top-up / withdraw) ──────────────────── */}
        <BalanceActionDemo container={portalContainer} type="Top-up" />
        <BalanceActionDemo container={portalContainer} type="Withdraw" />

        {/* ── Panel · top ────────────────────────────────────────────── */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm"><PanelTop />Panel · top</Button>
          </DialogTrigger>
          <DialogContent container={portalContainer}>
            <DialogPanel
              placement="top"
              className="bg-[var(--color-pair-blue-navy-dark)] text-[var(--color-pair-blue-navy-light)] min-h-36 overflow-hidden p-0"
            >
              <div className="absolute inset-0 opacity-90">
                <FullWidthLTexture preserveAspectRatio="xMidYMid slice" className="size-full" />
              </div>
            </DialogPanel>

            <DialogHeader>
              <div className="flex items-center gap-2 text-[var(--color-text-link)]">
                <Info className="size-4" />
                <span className="text-label-sm">What is an alias?</span>
              </div>
              <DialogTitle>Aliases</DialogTitle>
              <DialogDescription>
                An alias is a human-friendly handle (a phone, ID, email, or custom value) that
                points to a participant account, so payments can be routed without sharing raw
                account numbers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
              <Button>Got it</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
