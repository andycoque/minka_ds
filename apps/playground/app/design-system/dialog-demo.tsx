"use client"

import * as React from "react"
import { Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

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

  React.useEffect(() => { setContainer(containerRef.current) }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-[400px] overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] flex flex-col [transform:translateZ(0)]"
    >
      {/* Fake app header */}
      <div className="flex items-center h-12 shrink-0 border-b border-[var(--color-border-subtle)] px-4">
        <span className="text-label text-[var(--color-text-default)]">Workspace</span>
      </div>

      <FakeAppBg />

      {/* Trigger row */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)] px-4 py-3 flex gap-2 flex-wrap bg-[var(--color-bg-canvas)]">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Confirm action</Button>
          </DialogTrigger>
          <DialogContent container={container}>
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
          <DialogContent container={container}>
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription>
                Enter the details of the person you'd like to invite to this workspace.
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
          <DialogContent container={container}>
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
      </div>
    </div>
  )
}
