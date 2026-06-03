"use client"

import { Switch } from "minka-ds"
import { Label } from "@/components/ui/label"

export function SwitchDemo() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-2"><Switch id="sw1" defaultChecked /><Label htmlFor="sw1">Enabled</Label></div>
      <div className="flex items-center gap-2"><Switch id="sw2" /><Label htmlFor="sw2">Off</Label></div>
      <div className="flex items-center gap-2"><Switch id="sw3" disabled defaultChecked /><Label htmlFor="sw3">Disabled on</Label></div>
      <div className="flex items-center gap-2"><Switch id="sw4" disabled /><Label htmlFor="sw4">Disabled off</Label></div>
    </div>
  )
}
