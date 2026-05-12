"use client"

import * as React from "react"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FilterChip } from "@/components/ui/filter-chip"
import { FilterCombobox } from "@/components/ui/filter-combobox"
import type { FilterCategory, CategoryValue } from "@/components/ui/filter-combobox"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

// ── Default label formatter ────────────────────────────────────────────────────

function defaultFilterValueLabel(_categoryId: string, value: CategoryValue): string {
  if (typeof value === "string") return value
  if (typeof value === "object" && "from" in value) {
    const v = value as DateRange
    if (!v.from) return ""
    const from = v.from.toLocaleDateString("default", { month: "short", day: "numeric" })
    const to   = v.to?.toLocaleDateString("default", { month: "short", day: "numeric" })
    return to ? `${from} – ${to}` : `From ${from}`
  }
  if (typeof value === "object" && "exact" in value) {
    return (value as { exact: number }).exact.toLocaleString("en-US")
  }
  if (typeof value === "object") {
    const { min, max } = value as { min?: number; max?: number }
    if (min != null && max != null) return `${min.toLocaleString()} – ${max.toLocaleString()}`
    if (min != null) return `> ${min.toLocaleString()}`
    if (max != null) return `< ${max.toLocaleString()}`
  }
  return ""
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface SearchBarProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onFocus?: () => void
  inputRef?: React.RefObject<HTMLInputElement | null>
  kbdHint?: React.ReactNode

  filterCategories?: FilterCategory[]
  activeFilters?: Record<string, CategoryValue[]>
  onApplyFilter?: (categoryId: string, values: CategoryValue[]) => void
  onRemoveFilter?: (categoryId: string, value: CategoryValue) => void
  onClearFilters?: () => void
  filterValueLabel?: (categoryId: string, value: CategoryValue) => string

  children?: React.ReactNode
  className?: string
}

// ── Component ──────────────────────────────────────────────────────────────────

function SearchBar({
  placeholder,
  value,
  onChange,
  onKeyDown,
  onFocus,
  inputRef,
  kbdHint,
  filterCategories = [],
  activeFilters = {},
  onApplyFilter,
  onRemoveFilter,
  onClearFilters,
  filterValueLabel = defaultFilterValueLabel,
  children,
  className,
}: SearchBarProps) {
  const hasActiveFilters    = Object.values(activeFilters).some(v => v.length > 0)
  const hasFilterCategories = filterCategories.length > 0

  return (
    <div data-search-bar className={cn("relative flex flex-col", className)}>

      {/* Search input row */}
      <InputGroup
        className={cn(
          "h-12",
          hasActiveFilters && "[border-bottom-left-radius:0] [border-bottom-right-radius:0]"
        )}
      >
        <InputGroupAddon align="inline-start">
          <SearchIcon className="size-4" />
        </InputGroupAddon>
        <InputGroupInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          autoComplete="off"
        />
        {(!!value || (hasFilterCategories && !hasActiveFilters)) && (
          <InputGroupAddon align="inline-end">
            {value && (
              <InputGroupButton size="sm" variant="ghost" onClick={() => onChange("")} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]">
                <XIcon className="size-4" />
              </InputGroupButton>
            )}
            {hasFilterCategories && !hasActiveFilters && (
              <>
                {!value && kbdHint && <Kbd>{kbdHint}</Kbd>}
                <span className="h-4 w-px bg-[var(--color-border-default)]" />
                <FilterCombobox
                  categories={filterCategories}
                  onApply={onApplyFilter ?? (() => {})}
                  activeFilters={activeFilters}
                  dropdownAlign="right"
                  trigger={({ onClick }) => (
                    <InputGroupButton size="sm" variant="ghost" onClick={onClick} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]">
                      Advanced search
                    </InputGroupButton>
                  )}
                />
              </>
            )}
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Filter bar — visible only when filters are active */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 [border-bottom-left-radius:var(--radius-card)] [border-bottom-right-radius:var(--radius-card)] border border-t-0 border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-2.5">
          {Object.entries(activeFilters)
            .filter(([, vals]) => vals.length > 0)
            .map(([categoryId, values]) => {
              const cat = filterCategories.find(c => c.id === categoryId)
              return (
                <FilterChip
                  key={categoryId}
                  label={cat?.label ?? categoryId}
                  values={values.map(v => ({
                    label: filterValueLabel(categoryId, v),
                    onRemove: () => onRemoveFilter?.(categoryId, v),
                  }))}
                  onLabelClick={() => {}}
                />
              )
            })}
          <FilterCombobox
            categories={filterCategories}
            onApply={onApplyFilter ?? (() => {})}
            activeFilters={activeFilters}
            trigger={({ onClick }) => (
              <Button variant="default" size="sm" className="h-7 text-caption gap-1.5 px-2.5" onClick={onClick}>
                <PlusIcon className="size-3.5" />
                Add
              </Button>
            )}
          />
          <FilterChip
            variant="clear-all"
            className="ml-auto"
            onClear={onClearFilters ?? (() => {})}
          />
        </div>
      )}

      {/* Results dropdown — consumer-provided slot */}
      {children}
    </div>
  )
}

// ── Exports ────────────────────────────────────────────────────────────────────

export { SearchBar }
export type { SearchBarProps }
