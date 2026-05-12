"use client"

import { useState } from "react"
import { FilterChip } from "@/components/ui/filter-chip"

const INITIAL_STATUS = ["Active", "Pending"]
const INITIAL_TYPE = ["Income"]

export function FilterChipDemo() {
  const [status, setStatus] = useState(INITIAL_STATUS)
  const [type, setType] = useState(INITIAL_TYPE)

  const clearAll = () => {
    setStatus([])
    setType([])
  }

  const hasFilters = status.length > 0 || type.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">Filter bar</p>
        <div className="flex flex-wrap items-center gap-3">
          {status.length > 0 && (
            <FilterChip
              label="Status"
              values={status.map((s) => ({
                label: s,
                onRemove: () => setStatus((prev) => prev.filter((v) => v !== s)),
              }))}
              onLabelClick={() => {}}
            />
          )}
          {type.length > 0 && (
            <FilterChip
              label="Type"
              values={type.map((t) => ({
                label: t,
                onRemove: () => setType((prev) => prev.filter((v) => v !== t)),
              }))}
              onLabelClick={() => {}}
            />
          )}
          {hasFilters && <FilterChip variant="clear-all" onClear={clearAll} />}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">Clear all (standalone)</p>
        <FilterChip variant="clear-all" onClear={() => {}} />
      </div>
    </div>
  )
}
