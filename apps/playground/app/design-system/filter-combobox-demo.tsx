"use client"

import { useState } from "react"
import type { CategoryValue, AmountValue } from "@/components/ui/filter-combobox"
import { FilterCombobox } from "@/components/ui/filter-combobox"
import { FilterChip } from "@/components/ui/filter-chip"

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
    id: "participant",
    label: "Participant",
    type: "list" as const,
    values: [
      "Alice Johnson", "Bob Martinez", "Carol White", "David Kim",
      "Eva Rossi", "Frank Lee", "Grace Patel", "Henry Brown",
    ],
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

function labelForValue(categoryId: string, value: CategoryValue): string {
  if (categoryId === "date" && typeof value === "object" && "from" in value && value.from instanceof Date) {
    const from = value.from.toLocaleDateString("default", { month: "short", day: "numeric" })
    const to   = value.to instanceof Date ? value.to.toLocaleDateString("default", { month: "short", day: "numeric" }) : undefined
    return to ? `${from} – ${to}` : `From ${from}`
  }
  if (categoryId === "amount" && typeof value === "object") {
    const fmt = (n: number) => "$" + n.toLocaleString("en-US")
    if ("exact" in value) return fmt((value as AmountValue & { exact: number }).exact)
    const { min, max } = value as { min?: number; max?: number }
    if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`
    if (min != null) return `> ${fmt(min)}`
    if (max != null) return `< ${fmt(max)}`
  }
  return value as string
}

export function FilterComboboxDemo() {
  const [filters, setFilters] = useState<Record<string, CategoryValue[]>>({})

  function handleApply(categoryId: string, values: CategoryValue[]) {
    setFilters(prev => ({ ...prev, [categoryId]: values }))
  }

  function handleRemoveValue(categoryId: string, value: CategoryValue) {
    setFilters(prev => {
      const next = (prev[categoryId] ?? []).filter(v => v !== value)
      if (next.length === 0) {
        const { [categoryId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [categoryId]: next }
    })
  }

  const activeCategories = Object.entries(filters).filter(([, vals]) => vals.length > 0)
  const hasFilters = activeCategories.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-caption text-[var(--color-text-muted)]">Filter bar</p>
        <div className="flex flex-wrap items-center gap-3">
          {activeCategories.map(([categoryId, values]) => {
            const cat = CATEGORIES.find(c => c.id === categoryId)
            return (
              <FilterChip
                key={categoryId}
                label={cat?.label ?? categoryId}
                values={values.map(v => ({
                  label: labelForValue(categoryId, v),
                  onRemove: () => handleRemoveValue(categoryId, v),
                }))}
                onLabelClick={() => {}}
              />
            )
          })}
          <FilterCombobox
            categories={CATEGORIES}
            onApply={handleApply}
            activeFilters={filters}
          />
          {hasFilters && (
            <FilterChip variant="clear-all" className="ml-auto" onClear={() => setFilters({})} />
          )}
        </div>
      </div>
    </div>
  )
}
