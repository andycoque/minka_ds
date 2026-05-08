"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet, SheetContent, SheetDescription, SheetFooter,
  SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet"

const CLIENTS = [
  { name: "María García",    company: "Empresa SAS",  status: "Active"   },
  { name: "Carlos Mendoza",  company: "Tech Latam",   status: "Active"   },
  { name: "Laura Castillo",  company: "Finco Group",  status: "Inactive" },
  { name: "Andrés Restrepo", company: "DataMind Co.", status: "Active"   },
]

export function SheetDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [container, setContainer] = React.useState<HTMLElement | null>(null)

  React.useEffect(() => { setContainer(containerRef.current) }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-[400px] overflow-hidden rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-canvas)] flex flex-col [transform:translateZ(0)]"
    >
      {/* Fake app header */}
      <div className="flex items-center justify-between h-12 shrink-0 border-b border-[var(--color-border-subtle)] px-4">
        <span className="text-label text-[var(--color-text-default)]">Clients</span>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="sm">Open details</Button>
          </SheetTrigger>
          <SheetContent side="right" container={container}>
            <SheetHeader>
              <SheetTitle>Client details</SheetTitle>
              <SheetDescription>
                View and edit the selected client's information.
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <div className="px-4 flex-1 space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="sheet-name">Full name</Label>
                <Input id="sheet-name" defaultValue="María García" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sheet-email">Email</Label>
                <Input id="sheet-email" type="email" defaultValue="maria@empresa.co" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sheet-company">Company</Label>
                <Input id="sheet-company" defaultValue="Empresa SAS" />
              </div>
            </div>
            <SheetFooter>
              <Button className="w-full">Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Fake client list */}
      <div className="flex-1 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <th className="text-left px-4 py-2.5 text-label-sm text-[var(--color-text-muted)] font-normal">Name</th>
              <th className="text-left px-4 py-2.5 text-label-sm text-[var(--color-text-muted)] font-normal">Company</th>
              <th className="text-left px-4 py-2.5 text-label-sm text-[var(--color-text-muted)] font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {CLIENTS.map((client) => (
              <tr key={client.name} className="border-b border-[var(--color-border-subtle)] last:border-0">
                <td className="px-4 py-3 text-body-sm text-[var(--color-text-default)]">{client.name}</td>
                <td className="px-4 py-3 text-body-sm text-[var(--color-text-muted)]">{client.company}</td>
                <td className="px-4 py-3">
                  <span className={`text-label-sm ${client.status === "Active" ? "text-[var(--color-text-success)]" : "text-[var(--color-text-muted)]"}`}>
                    {client.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
