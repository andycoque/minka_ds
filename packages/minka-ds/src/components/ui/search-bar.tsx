"use client"

import * as React from "react"
import { PlusIcon, SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react"
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
  if (typeof value === "object" && "operator" in value) {
    const v = value as { operator: string; value: string }
    return `${v.operator} "${v.value}"`
  }
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

  /**
   * An escalation out of the plain text search, for criteria that do not fit
   * a single query string — e.g. a field the real backend can only search as
   * its own targeted column (an account number), not as part of a broad
   * multi-column text match. Rendered as a ghost icon button at the end of
   * the search input; clicking it reveals `advancedSearchContent` in its own
   * row, directly below the input and above the filter bar. The plain search
   * box and any active filters stay live the whole time — this only ADDS
   * criteria, it never replaces the simple search.
   *
   * Left to the caller whether opening resets or preserves the fields: the
   * transactions list, the first consumer, clears them on collapse so a
   * hidden row can never keep silently narrowing results.
   */
  advancedSearchOpen?: boolean
  onAdvancedSearchToggle?: () => void
  advancedSearchContent?: React.ReactNode

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
  advancedSearchOpen = false,
  onAdvancedSearchToggle,
  advancedSearchContent,
  children,
  className,
}: SearchBarProps) {
  const hasActiveFilters = Object.values(activeFilters).some(v => v.length > 0)
  const showFilterBar    = hasActiveFilters || alwaysShowFilterBar
  const hasAdvancedSearch = !!onAdvancedSearchToggle

  return (
    <div data-search-bar className={cn("relative flex flex-col", className)}>

      {/* Search input row */}
      <InputGroup
        className={cn(
          size === "sm" ? "h-9" : "h-12",
          (showFilterBar || advancedSearchOpen) &&
            "[border-bottom-left-radius:0] [border-bottom-right-radius:0]",
          // Only advanced search removes the divider below the input: the
          // input and the advanced fields read as one continuous search
          // surface. The regular state (just the filter bar below) keeps its
          // divider — the filter bar is a distinct row of applied criteria,
          // not part of the search itself, so the seam stays meaningful there.
          advancedSearchOpen && "border-b-0"
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
        {(!!value || (!value && !!kbdHint) || hasAdvancedSearch) && (
          <InputGroupAddon align="inline-end">
            {value && (
              <InputGroupButton size="sm" variant="ghost" onClick={() => onChange("")} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]">
                <XIcon className="size-4" />
              </InputGroupButton>
            )}
            {!value && kbdHint && <Kbd>{kbdHint}</Kbd>}
            {hasAdvancedSearch && (
              <InputGroupButton
                size="icon-xs"
                variant="ghost"
                aria-label="Advanced search"
                aria-pressed={advancedSearchOpen}
                onClick={onAdvancedSearchToggle}
                className={cn(
                  "text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]",
                  advancedSearchOpen && "text-[var(--color-text-default)] bg-[var(--color-action-ghost-hover)]"
                )}
              >
                <SlidersHorizontalIcon className="size-4" />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        )}
      </InputGroup>

      {/* Advanced search row — criteria that do not fit the plain text search
          (a field the backend can only search as its own targeted column).
          Sits directly below the input, above the filter bar: always visible
          while open rather than a popover, and pushes the filter bar/table
          down like the filter bar itself already does. */}
      {advancedSearchOpen && (
        <div
          className={cn(
            // Up to 3 fields per row, label beside its field rather than
            // above it: each field is its own [label, input] pair, laid out
            // as a 2-column sub-grid so every label takes only the width its
            // own text needs and every input lines up with the others.
            "grid grid-cols-1 gap-x-6 gap-y-3 border border-t-0 border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-3 py-2.5 sm:grid-cols-2 lg:grid-cols-3",
            showFilterBar ? "" : "[border-bottom-left-radius:var(--radius-card)] [border-bottom-right-radius:var(--radius-card)]"
          )}
        >
          {advancedSearchContent}
        </div>
      )}

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
