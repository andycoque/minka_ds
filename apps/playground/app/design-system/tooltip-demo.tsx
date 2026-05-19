"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipLabel,
  TooltipDescription,
} from "@/components/ui/tooltip"

export function TooltipDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Label only</Button>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipLabel>Balance alert</TooltipLabel>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Label + description</Button>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipLabel>Balance alert</TooltipLabel>
          <TooltipDescription>Last sent Today at 09:23</TooltipDescription>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm">Description only</Button>
        </TooltipTrigger>
        <TooltipContent>
          <TooltipDescription>Needs approval before processing</TooltipDescription>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
