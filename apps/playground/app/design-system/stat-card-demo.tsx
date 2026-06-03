"use client"

import { StatCard } from "minka-ds"
import { Download, RefreshCw } from "lucide-react"

export function StatCardActionsDemo() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        type="amount"
        label="Available balance"
        value="$1,240,000"
        unit="COP"
        actions={[
          { label: "Withdraw", icon: <Download className="size-3.5" />, onClick: () => {} },
        ]}
      />
      <StatCard
        type="amount"
        label="Reserved funds"
        value="$380,000"
        unit="COP"
        color="error"
        actions={[
          { label: "Release", onClick: () => {} },
          { label: "Review", icon: <RefreshCw className="size-3.5" />, onClick: () => {} },
        ]}
      />
    </div>
  )
}
