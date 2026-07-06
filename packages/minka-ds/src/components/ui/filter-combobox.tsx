"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
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
import { DateTimeRangePicker, type DateTimeRange } from "./date-time-range-picker"

// ── Types ──────────────────────────────────────────────────────────────────────

interface FilterCategory {
  id: string
  label: string
  type?: "list" | "date" | "amount" | "hours" | "datetime" | "text"
  values?: string[]
  maxRangeDays?: number
  renderValue?: (value: string) => React.ReactNode
}

type AmountValue   = { exact: number } | { min?: number; max?: number }
type HoursValue    = { from: string; to: string }
// Free-text value with an operator (type: "text"). is/is not = exact
// (in)equality; matches = case-insensitive substring.
type TextOperator  = "is" | "is not" | "matches"
type TextValue     = { operator: TextOperator; value: string }
type CategoryValue = string | DateRange | AmountValue | HoursValue | DateTimeRange | TextValue

const TEXT_OPERATORS: TextOperator[] = ["is", "is not", "matches"]


type Step = 1 | 2 | 3

// ── Main component ─────────────────────────────────────────────────────────────

function FilterCombobox({
  categories,
  onApply,
  activeFilters = {},
  trigger,
  dropdownAlign = "left",
  singleSelect = false,
  className,
}: {
  categories: FilterCategory[]
  onApply: (categoryId: string, values: CategoryValue[]) => void
  activeFilters?: Record<string, CategoryValue[]>
  trigger?: (props: { open: boolean; onClick: () => void }) => React.ReactNode
  dropdownAlign?: "left" | "right"
  singleSelect?: boolean
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
  const [hoursInput, setHoursInput]             = React.useState("")
  const [hoursInputTo, setHoursInputTo]         = React.useState("")
  const [datetimeValue, setDatetimeValue]       = React.useState<DateTimeRange | null>(null)
  const [search, setSearch]                     = React.useState("")
  const [textOperator, setTextOperator]         = React.useState<TextOperator>("is")
  const [textInput, setTextInput]               = React.useState("")
  const [operatorOpen, setOperatorOpen]         = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const searchRef    = React.useRef<HTMLInputElement>(null)
  const textRef      = React.useRef<HTMLInputElement>(null)
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

  // Auto-focus search (or the text input) when entering step 2
  React.useEffect(() => {
    if (open && step === 2) {
      setTimeout(() => {
        if (selectedCategory?.type === "text") textRef.current?.focus()
        else searchRef.current?.focus()
      }, 30)
    }
  }, [open, step, selectedCategory])

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
    setHoursInput("")
    setHoursInputTo("")
    setDatetimeValue(null)
    setTextOperator("is")
    setTextInput("")
    setOperatorOpen(false)
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

    if (cat.type === "hours") {
      setSelectedCategory(cat)
      setSelectedValues(new Set())
      setHoursInput("")
      setHoursInputTo("")
      setSearch("")
      setStep(2)
      return
    }

    if (cat.type === "datetime") {
      const custom = existing.find((v): v is DateTimeRange =>
        typeof v === "object" && "startTime" in v
      ) ?? null
      setSelectedCategory(cat)
      setDatetimeValue(custom)
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

    if (cat.type === "text") {
      const custom = existing.find((v): v is TextValue =>
        typeof v === "object" && "operator" in v
      )
      setSelectedCategory(cat)
      setSelectedValues(new Set())
      setSearch("")
      setTextOperator(custom?.operator ?? "is")
      setTextInput(custom?.value ?? "")
      setStep(2)
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

  function applyDatetime() {
    if (!selectedCategory || !datetimeValue?.from || !datetimeValue?.to) return
    onApply(selectedCategory.id, [datetimeValue])
    handleClose()
  }

  function applyCustomHours() {
    if (!selectedCategory || !hoursInput || !hoursInputTo) return
    onApply(selectedCategory.id, [{ from: hoursInput, to: hoursInputTo }])
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

  function applyText() {
    if (!selectedCategory) return
    const value = textInput.trim()
    if (!value) return
    onApply(selectedCategory.id, [{ operator: textOperator, value }])
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

  const isDate     = selectedCategory?.type === "date"
  const isAmount   = selectedCategory?.type === "amount"
  const isHours    = selectedCategory?.type === "hours"
  const isDatetime = selectedCategory?.type === "datetime"
  const isText     = selectedCategory?.type === "text"

  const step2AllValues = selectedCategory?.values ?? []

  const showSearch    = step2AllValues.length > 4 && selectedCategory?.type !== "hours"
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
          dropdownAlign === "right" ? "absolute right-0 top-full mt-1.5 [border-radius:var(--radius-popover)]" : "absolute left-0 top-full mt-1.5 [border-radius:var(--radius-popover)]",
          // clip inner content to the rounded corners, EXCEPT on the text step
          // where the operator dropdown must escape the popover bounds.
          isText ? "overflow-visible" : "overflow-hidden",
          "bg-[var(--color-bg-overlay)] shadow-[var(--shadow-popover)] ring-1 ring-[var(--color-border-subtle)]",
          "[z-index:var(--z-floating)]",
          step === 3 && (isDate || isDatetime) ? "w-auto" : step === 3 && isHours ? "w-80" : "w-56"
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

          {/* Step 2 — text value: title + operator on one row, then input. */}
          {step === 2 && selectedCategory && isText && (
            <>
              {/* header row: back chevron (multi-cat) + title on the left,
                  operator selector pinned far right next to the title. */}
              <div className="flex items-center gap-1 px-2 pt-2">
                {!isSingle && (
                  <button
                    type="button"
                    onClick={() => { setStep(1); setTextInput(""); setOperatorOpen(false) }}
                    className="flex items-center justify-center [border-radius:var(--radius-tag)] p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-action-ghost-hover)] transition-colors"
                  >
                    <ChevronLeftIcon className="size-4" />
                  </button>
                )}
                <span className="text-body-sm font-medium text-[var(--color-text-default)]">{selectedCategory.label}</span>
                <div className="ml-auto">
                  <OperatorSelect
                    value={textOperator}
                    open={operatorOpen}
                    onOpenChange={setOperatorOpen}
                    onChange={op => { setTextOperator(op); textRef.current?.focus() }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 p-2">
                <Input
                  ref={textRef}
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") applyText() }}
                  onFocus={() => setOperatorOpen(false)}
                  placeholder="Type a value"
                />
                <Button size="sm" className="w-full" disabled={textInput.trim() === ""} onClick={applyText}>
                  Apply
                </Button>
              </div>
            </>
          )}

          {/* Step 2 — value list */}
          {step === 2 && selectedCategory && !isText && (
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
                      {selectedCategory.type === "hours" || singleSelect ? (
                        <PickerRow
                          onClick={() => { onApply(selectedCategory.id, [value]); handleClose() }}
                          selected={singleSelect && selectedValues.has(value)}
                          hideChevron={singleSelect}
                        >
                          {selectedCategory.renderValue?.(value) ?? value}
                        </PickerRow>
                      ) : (
                        <CheckRow
                          checked={selectedValues.has(value)}
                          onToggle={() => toggleValue(value)}
                        >
                          {selectedCategory.renderValue?.(value) ?? value}
                        </CheckRow>
                      )}
                    </li>
                  ))
                }
                {selectedCategory.type === "hours" && (
                  <li>
                    <PickerRow onClick={() => setStep(3)}>Custom range</PickerRow>
                  </li>
                )}
              </ul>
              {selectedValues.size > 0 && selectedCategory.type !== "hours" && !singleSelect && (
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

          {/* Step 3 — hours custom range */}
          {step === 3 && isHours && (
            <>
              <StepHeader
                title="Custom range"
                onBack={() => setStep(2)}
              />
              <div className="p-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={hoursInput}
                    onChange={e => setHoursInput(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-body-sm text-[var(--color-text-muted)] shrink-0">–</span>
                  <Input
                    type="time"
                    value={hoursInputTo}
                    onChange={e => setHoursInputTo(e.target.value)}
                    className="flex-1"
                  />
                </div>
                {hoursInput !== "" && hoursInputTo !== "" &&
                  !isNaN(parseFloat(hoursInput)) && !isNaN(parseFloat(hoursInputTo)) && (
                  <Button size="sm" className="w-full" onClick={applyCustomHours}>
                    Apply
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Step 3 — datetime range */}
          {step === 3 && isDatetime && (
            <>
              {!isSingle && (
                <StepHeader
                  title={selectedCategory?.label ?? "Date range"}
                  onBack={() => setStep(1)}
                />
              )}
              <div className="p-1">
                <DateTimeRangePicker
                  value={datetimeValue}
                  onChange={setDatetimeValue}
                  maxRangeDays={selectedCategory?.maxRangeDays}
                />
              </div>
              <div className="p-1">
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!datetimeValue?.from || !datetimeValue?.to}
                  onClick={applyDatetime}
                >
                  Apply
                </Button>
              </div>
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

function PickerRow({ children, onClick, selected = false, hideChevron = false }: { children: React.ReactNode; onClick: () => void; selected?: boolean; hideChevron?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center gap-2 [border-radius:var(--radius-tag)] py-1.5 pl-2 pr-8 text-body-sm text-[var(--color-text-default)] hover:bg-[var(--color-action-ghost-hover)] transition-colors"
    >
      {children}
      {!hideChevron && <ChevronRightIcon className="pointer-events-none absolute right-2 size-3.5 text-[var(--color-text-muted)]" />}
      {selected && <CheckIcon className="pointer-events-none absolute right-2 size-3.5 text-[var(--color-text-default)]" />}
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

// Compact inline operator dropdown (is / is not / matches). Rendered inside the
// filter popover container (NOT portaled) so opening it doesn't trip the filter's
// outside-click close.
function OperatorSelect({
  value, open, onOpenChange, onChange,
}: {
  value: TextOperator
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (op: TextOperator) => void
}) {
  return (
    <div className="relative w-fit">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex h-8 items-center gap-1.5 [border-radius:var(--radius-input)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] px-2.5 text-body-sm text-[var(--color-text-default)] hover:bg-[var(--color-action-ghost-hover)] transition-colors"
      >
        {value}
        <ChevronDownIcon className="size-3.5 text-[var(--color-text-muted)]" />
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-10 mt-1 w-32 [border-radius:var(--radius-popover)] bg-[var(--color-bg-overlay)] p-1 shadow-[var(--shadow-popover)] ring-1 ring-[var(--color-border-subtle)]">
          {TEXT_OPERATORS.map(op => (
            <li key={op}>
              <button
                type="button"
                onClick={() => { onChange(op); onOpenChange(false) }}
                className="relative flex w-full items-center [border-radius:var(--radius-tag)] py-1.5 pl-2 pr-7 text-body-sm text-[var(--color-text-default)] hover:bg-[var(--color-action-ghost-hover)] transition-colors"
              >
                {op}
                {op === value && <CheckIcon className="pointer-events-none absolute right-2 size-3.5 text-[var(--color-text-default)]" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Exports ────────────────────────────────────────────────────────────────────

export { FilterCombobox }
export type { FilterCategory, CategoryValue, AmountValue, HoursValue, TextValue, TextOperator }
export type { DateTimeRange } from "./date-time-range-picker"
