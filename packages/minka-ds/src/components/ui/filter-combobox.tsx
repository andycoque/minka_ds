"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { Tabs, TabsList, TabsTrigger } from "./tabs"

// ── Types ──────────────────────────────────────────────────────────────────────

interface FilterCategory {
  id: string
  label: string
  type?: "list" | "date" | "amount"
  values?: string[]
  renderValue?: (value: string) => React.ReactNode
}

type AmountValue   = { exact: number } | { min?: number; max?: number }
type CategoryValue = string | DateRange | AmountValue


type Step = 1 | 2 | 3

// ── Main component ─────────────────────────────────────────────────────────────

function FilterCombobox({
  categories,
  onApply,
  activeFilters = {},
  trigger,
  dropdownAlign = "left",
  className,
}: {
  categories: FilterCategory[]
  onApply: (categoryId: string, values: CategoryValue[]) => void
  activeFilters?: Record<string, CategoryValue[]>
  trigger?: (props: { open: boolean; onClick: () => void }) => React.ReactNode
  dropdownAlign?: "left" | "right"
  className?: string
}) {
  const [open, setOpen]                         = React.useState(false)
  const [step, setStep]                         = React.useState<Step>(1)
  const [selectedCategory, setSelectedCategory] = React.useState<FilterCategory | null>(null)
  const [selectedValues, setSelectedValues]     = React.useState<Set<string>>(new Set())
  const [dateRange, setDateRange]               = React.useState<DateRange | undefined>()
  const [amountMode, setAmountMode]             = React.useState<"exact" | "range">("exact")
  const [amountExact, setAmountExact]           = React.useState("")
  const [amountMin, setAmountMin]               = React.useState("")
  const [amountMax, setAmountMax]               = React.useState("")
  const [search, setSearch]                     = React.useState("")

  const containerRef = React.useRef<HTMLDivElement>(null)
  const searchRef    = React.useRef<HTMLInputElement>(null)
  const isSingle     = categories.length === 1

  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) handleClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  // Auto-focus search when entering step 2
  React.useEffect(() => {
    if (open && step === 2) setTimeout(() => searchRef.current?.focus(), 30)
  }, [open, step])

  function handleClose() {
    setOpen(false)
    setStep(1)
    setSelectedCategory(null)
    setSelectedValues(new Set())
    setDateRange(undefined)
    setSearch("")
    setAmountMode("exact")
    setAmountExact("")
    setAmountMin("")
    setAmountMax("")
  }

  function handleToggle() {
    if (open) {
      handleClose()
      return
    }
    // Single-category: skip step 1 and jump straight to options
    if (isSingle) {
      openCategory(categories[0])
    }
    setOpen(true)
  }

  function openCategory(cat: FilterCategory) {
    const existing = activeFilters[cat.id] ?? []

    if (cat.type === "date") {
      const custom = existing.find((v): v is DateRange => typeof v === "object" && "from" in v)
      setSelectedCategory(cat)
      setDateRange(custom)
      setSelectedValues(new Set())
      setSearch("")
      setStep(3)
      return
    }

    if (cat.type === "amount") {
      const custom = existing.find((v): v is AmountValue =>
        typeof v === "object" && ("exact" in v || "min" in v || "max" in v)
      )
      setSelectedCategory(cat)
      setSelectedValues(new Set())
      setSearch("")
      if (custom) {
        if ("exact" in custom) {
          setAmountMode("exact")
          setAmountExact(String(custom.exact))
          setAmountMin("")
          setAmountMax("")
        } else {
          const r = custom as { min?: number; max?: number }
          setAmountMode("range")
          setAmountExact("")
          setAmountMin(r.min != null ? String(r.min) : "")
          setAmountMax(r.max != null ? String(r.max) : "")
        }
      }
      setStep(3)
      return
    }

    setSelectedValues(new Set(existing.filter((v): v is string => typeof v === "string")))
    setSelectedCategory(cat)
    setSearch("")
    setStep(2)
  }

  function applyValues() {
    if (!selectedCategory) return
    onApply(selectedCategory.id, Array.from(selectedValues))
    handleClose()
  }

  function applyCustomDate() {
    if (!selectedCategory || !dateRange?.from) return
    onApply(selectedCategory.id, [dateRange])
    handleClose()
  }

  function applyCustomAmount() {
    if (!selectedCategory) return
    let value: AmountValue
    if (amountMode === "exact") {
      const n = parseFloat(amountExact)
      if (isNaN(n)) return
      value = { exact: n }
    } else {
      const min = amountMin !== "" ? parseFloat(amountMin) : undefined
      const max = amountMax !== "" ? parseFloat(amountMax) : undefined
      if (min == null && max == null) return
      value = { min, max }
    }
    onApply(selectedCategory.id, [value])
    handleClose()
  }

  function toggleValue(value: string, singleSelect = false) {
    setSelectedValues(prev => {
      if (singleSelect) return prev.has(value) ? new Set() : new Set([value])
      const next = new Set(prev)
      next.has(value) ? next.delete(value) : next.add(value)
      return next
    })
  }

  // ── Derived values ───────────────────────────────────────────────────────────

  const isDate   = selectedCategory?.type === "date"
  const isAmount = selectedCategory?.type === "amount"

  const step2AllValues = selectedCategory?.values ?? []

  const showSearch    = step2AllValues.length > 4
  const step2Filtered = showSearch
    ? step2AllValues.filter(v => v.toLowerCase().includes(search.toLowerCase()))
    : step2AllValues

  const canApplyAmount = amountMode === "exact"
    ? amountExact !== "" && !isNaN(parseFloat(amountExact))
    : amountMin !== "" || amountMax !== ""

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {trigger ? trigger({ open, onClick: handleToggle }) : (
        <Button variant="default" size="sm" className="h-7 text-caption gap-1.5 px-2.5" onClick={handleToggle}>
          <PlusIcon className="size-3.5" />
          Add filter
        </Button>
      )}

      {open && (
        <div className={cn(
          dropdownAlign === "right" ? "absolute right-0 top-full mt-1.5 overflow-hidden [border-radius:var(--radius-popover)]" : "absolute left-0 top-full mt-1.5 overflow-hidden [border-radius:var(--radius-popover)]",
          "bg-[var(--color-bg-overlay)] shadow-[var(--shadow-popover)] ring-1 ring-[var(--color-border-subtle)]",
          "[z-index:var(--z-floating)]",
          step === 3 && isDate ? "w-auto" : "w-56"
        )}>

          {/* Step 1 — category list (multi-category mode only) */}
          {step === 1 && (
            <ul className="p-1">
              {categories.map(cat => (
                <li key={cat.id}>
                  <PickerRow onClick={() => openCategory(cat)}>{cat.label}</PickerRow>
                </li>
              ))}
            </ul>
          )}

          {/* Step 2 — value list */}
          {step === 2 && selectedCategory && (
            <>
              {!isSingle && (
                <StepHeader
                  title={selectedCategory.label}
                  onBack={() => { setStep(1); setSearch("") }}
                />
              )}
              {showSearch && (
                <div className="px-1 pt-1">
                  <SearchInput ref={searchRef} value={search} onChange={setSearch} />
                </div>
              )}
              <ul className="max-h-52 overflow-y-auto p-1">
                {step2Filtered.length === 0
                  ? <EmptyRow />
                  : step2Filtered.map(value => (
                    <li key={value}>
                      <CheckRow
                        checked={selectedValues.has(value)}
                        onToggle={() => toggleValue(value)}
                      >
                        {selectedCategory.renderValue?.(value) ?? value}
                      </CheckRow>
                    </li>
                  ))
                }
              </ul>
              {selectedValues.size > 0 && (
                <div className="p-1">
                  <Button size="sm" className="w-full" onClick={applyValues}>
                    Apply
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Step 3 — custom date range */}
          {step === 3 && isDate && (
            <>
              {!isSingle && (
                <StepHeader
                  title={selectedCategory?.label ?? "Date"}
                  onBack={() => setStep(1)}
                />
              )}
              <div className="p-1">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={1} />
              </div>
              {dateRange?.from && (
                <div className="p-1">
                  <Button size="sm" className="w-full" onClick={applyCustomDate}>
                    Apply
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Step 3 — custom amount */}
          {step === 3 && isAmount && (
            <>
              {!isSingle && (
                <StepHeader
                  title="Amount"
                  onBack={() => setStep(1)}
                />
              )}
              <div className="p-2 flex flex-col gap-2">
                <Tabs
                  value={amountMode}
                  onValueChange={v => setAmountMode(v as "exact" | "range")}
                  className="w-full"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="exact" className="flex-1">Exact</TabsTrigger>
                    <TabsTrigger value="range" className="flex-1">Range</TabsTrigger>
                  </TabsList>
                </Tabs>

                {amountMode === "exact" ? (
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-[var(--color-text-muted)]">$</span>
                    <Input
                      type="number"
                      min="0"
                      value={amountExact}
                      onChange={e => setAmountExact(e.target.value)}
                      placeholder="0"
                      className="pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-[var(--color-text-muted)]">$</span>
                      <Input
                        type="number"
                        min="0"
                        value={amountMin}
                        onChange={e => setAmountMin(e.target.value)}
                        placeholder="Min"
                        className="pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <span className="text-body-sm text-[var(--color-text-muted)] shrink-0">–</span>
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body-sm text-[var(--color-text-muted)]">$</span>
                      <Input
                        type="number"
                        min="0"
                        value={amountMax}
                        onChange={e => setAmountMax(e.target.value)}
                        placeholder="Max"
                        className="pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                )}

                {canApplyAmount && (
                  <Button size="sm" className="w-full" onClick={applyCustomAmount}>
                    Apply
                  </Button>
                )}
              </div>
            </>
          )}

        </div>
      )}
    </div>
  )
}

// ── Internal sub-components ────────────────────────────────────────────────────

const SearchInput = React.forwardRef<
  HTMLInputElement,
  { value: string; onChange: (v: string) => void }
>(({ value, onChange }, ref) => (
  <div className="flex h-8 items-center gap-2 [border-radius:var(--radius-input)] border border-[var(--color-border-default)]/30 bg-[var(--color-bg-canvas)]/60 px-2">
    <SearchIcon className="size-3.5 shrink-0 text-[var(--color-text-muted)]" />
    <input
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search…"
      className="min-w-0 flex-1 bg-transparent text-body-sm outline-none placeholder:text-[var(--color-text-hint)]"
    />
  </div>
))
SearchInput.displayName = "SearchInput"

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-1 px-1 pt-1">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center [border-radius:var(--radius-tag)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-action-ghost-hover)] transition-colors"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <span className="text-body-sm font-medium text-[var(--color-text-default)]">{title}</span>
    </div>
  )
}

function PickerRow({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center gap-2 [border-radius:var(--radius-tag)] py-1.5 pl-2 pr-8 text-body-sm text-[var(--color-text-default)] hover:bg-[var(--color-action-ghost-hover)] transition-colors"
    >
      {children}
      <ChevronRightIcon className="pointer-events-none absolute right-2 size-3.5 text-[var(--color-text-muted)]" />
    </button>
  )
}

function CheckRow({
  children,
  checked,
  onToggle,
}: {
  children: React.ReactNode
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative flex w-full items-center gap-2 [border-radius:var(--radius-tag)] py-1.5 pl-2 pr-8 text-body-sm text-[var(--color-text-default)] hover:bg-[var(--color-action-ghost-hover)] transition-colors"
    >
      {children}
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        {checked && <CheckIcon className="size-4 text-[var(--color-text-default)]" />}
      </span>
    </button>
  )
}

function EmptyRow() {
  return <li className="py-2 text-center text-body-sm text-[var(--color-text-muted)]">No results</li>
}

// ── Exports ────────────────────────────────────────────────────────────────────

export { FilterCombobox }
export type { FilterCategory, CategoryValue, AmountValue }
