"use client"

import { useState } from "react"
import { Command } from "lucide-react"
import type { CategoryValue } from "@/components/ui/filter-combobox"
import { SearchBar } from "@/components/ui/search-bar"

const CATEGORIES = [
  {
    id: "status",
    label: "Status",
    type: "list" as const,
    values: ["Active", "Pending", "Cancelled", "Failed"],
  },
  {
    id: "type",
    label: "Type",
    type: "list" as const,
    values: ["Income", "Expense", "Transfer"],
  },
  {
    id: "amount",
    label: "Amount",
    type: "amount" as const,
  },
  {
    id: "date",
    label: "Date",
    type: "date" as const,
  },
]

export function SearchBarDemo() {
  const [query, setQuery]   = useState("")
  const [filters, setFilters] = useState<Record<string, CategoryValue[]>>({})

  function handleApply(categoryId: string, values: CategoryValue[]) {
    setFilters(prev => ({ ...prev, [categoryId]: values }))
  }

  function handleRemove(categoryId: string, value: CategoryValue) {
    setFilters(prev => {
      const next = (prev[categoryId] ?? []).filter(v => v !== value)
      if (next.length === 0) {
        const { [categoryId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [categoryId]: next }
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">With filters</p>
        <SearchBar
          placeholder="Search by ID, name, or description"
          value={query}
          onChange={setQuery}
          kbdHint={<><Command className="size-3" /> K</>}
          filterCategories={CATEGORIES}
          activeFilters={filters}
          onApplyFilter={handleApply}
          onRemoveFilter={handleRemove}
          onClearFilters={() => setFilters({})}
          alwaysShowFilterBar
        />
      </div>
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">Without filters</p>
        <SearchBar
          placeholder="Search transactions…"
          value={query}
          onChange={setQuery}
          kbdHint={<><Command className="size-3" /> K</>}
        />
      </div>
    </div>
  )
}
