"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/sonner"

export function SonnerDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => toast("Balance alert sent")}>
        Default
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.success("Balance topped up successfully")}>
        Success
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.error("Transaction failed")}>
        Error
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.warning("Balance approaching threshold")}>
        Warning
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.info("New approval request received")}>
        Info
      </Button>
      <Button variant="outline" size="sm" onClick={() => toast.loading("Sending alert...")}>
        Loading
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast("Balance alert sent", {
            description: "Bancolombia · $300,000,000 threshold",
          })
        }
      >
        With description
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.success("Top up approved", {
            description: "+$500,000,000 added to Davivienda",
            action: { label: "View", onClick: () => {} },
          })
        }
      >
        With action
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: "Processing top up...",
            success: "Top up completed",
            error: "Top up failed",
          })
        }
      >
        Promise
      </Button>
    </div>
  )
}
