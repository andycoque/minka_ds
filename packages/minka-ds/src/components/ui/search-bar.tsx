"use client"

import * as React from "react"
import { PlusIcon, SearchIcon, XIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../../lib/utils"
import type { DateTimeRange } from "./date-time-range-picker"
import { FilterChip } from "./filter-chip"
import { FilterCombobox } from "./filter-combobox"
import type { FilterCategory, CategoryValue } from "./filter-combobox"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group"
import { Kbd } from "./kbd"

// ── Default label formatter ────────────────────────────────────────────────────

function formatTime(t: string): string {
  return t || "00:00"
}

function defaultFilterValueLabel(_categoryId: string, value: CategoryValue): string {
  if (typeof value === "string") return value
  if (typeof value === "object" && "startTime" in value) {
    const v = value as DateTimeRange
    const fmtDate = (d: Date) => d.toLocaleDateString("default", { month: "short", day: "numeric" })
    return `${fmtDate(v.from)} ${formatTime(v.startTime)} – ${fmtDate(v.to)} ${formatTime(v.endTime)}`
  }
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
  alwaysShowFilterBar?: boolean
  size?: "default" | "sm"

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
  alwaysShowFilterBar = false,
  size = "default",
  children,
  className,
}: SearchBarProps) {
  const hasActiveFilters = Object.values(activeFilters).some(v => v.length > 0)
  const showFilterBar    = hasActiveFilters || alwaysShowFilterBar

  return (
    <div data-search-bar className={cn("relative flex flex-col", className)}>

      {/* Search input row */}
      <InputGroup
        className={cn(
          size === "sm" ? "h-9" : "h-12",
          showFilterBar && "[border-bottom-left-radius:0] [border-bottom-right-radius:0]"
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
        {(!!value || (!value && !!kbdHint)) && (
          <InputGroupAddon align="inline-end">
            {value && (
              <InputGroupButton size="sm" variant="ghost" onClick={() => onChange("")} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]">
                <XIcon className="size-4" />
              </InputGroupButton>
            )}
            {!value && kbdHint && <Kbd>{kbdHint}</Kbd>}
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Filter bar */}
      {showFilterBar && (
        <div className="flex flex-wrap items-center gap-3 [border-bottom-left-radius:var(--radius-card)] [border-bottom-right-radius:var(--radius-card)] border border-t-0 border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-2.5">
          {/* One trigger per category, active ones show chips */}
          <span className="text-caption text-[var(--color-text-default)] shrink-0">Filters:</span>
          {filterCategories.map(cat => {
            const activeVals = activeFilters[cat.id] ?? []
            const hasActive  = activeVals.length > 0

            if (hasActive) {
              return (
                <FilterCombobox
                  key={cat.id}
                  categories={[cat]}
                  onApply={onApplyFilter ?? (() => {})}
                  activeFilters={activeFilters}
                  trigger={({ onClick }) => (
                    <FilterChip
                      label={cat.label}
                      values={activeVals.map(v => ({
                        label: filterValueLabel(cat.id, v),
                        onRemove: cat.type === "datetime" ? undefined : () => onRemoveFilter?.(cat.id, v),
                      }))}
                      onLabelClick={onClick}
                    />
                  )}
                />
              )
            }

            return (
              <FilterCombobox
                key={cat.id}
                categories={[cat]}
                onApply={onApplyFilter ?? (() => {})}
                activeFilters={activeFilters}
                trigger={({ onClick }) => (
                  <button
                    type="button"
                    onClick={onClick}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border-default)] px-2 py-0.5 text-caption text-[var(--color-text-muted)] hover:text-[var(--color-text-default)] hover:border-[var(--color-border-hover,var(--color-border-default))] transition-colors"
                  >
                    {cat.label}
                    <PlusIcon className="size-3 shrink-0" />
                  </button>
                )}
              />
            )
          })}
          {hasActiveFilters && (
            <FilterChip
              variant="clear-all"
              className="ml-auto"
              onClear={onClearFilters ?? (() => {})}
            />
          )}
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
