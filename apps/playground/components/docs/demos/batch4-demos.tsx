"use client"

import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DateTimePicker,
  DateTimeRangePicker,
  HelpExpander,
  Kbd,
  Label,
  SearchBar,
  TimeField,
  type CategoryValue,
  type DateTimeRange,
  type DateTimeValue,
  type FilterCategory,
} from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Batch 4 demos. Every specimen is drawn from product code:
 *
 *   Breadcrumb    every detail page's nav row
 *   SearchBar     transactions list, with the real filter categories
 *   HelpExpander  the "?" beside a section title
 *   Date family   the reports generate dialog and the transactions date filter
 */

// ── Breadcrumb ────────────────────────────────────────────────────────────────

function BreadcrumbDemo() {
  return (
    <Playground
      controls={[]}
      minHeight={110}
      details={() => (
        <Anatomy>
          <Part name="BreadcrumbLink">
            An ancestor. Clickable, and every level above the current page is one.
          </Part>
          <Part name="BreadcrumbPage">
            The current page. Not a link, because it goes nowhere.
          </Part>
          <Part name="BreadcrumbSeparator">
            Between items. Rendered for you, so do not type a slash.
          </Part>
        </Anatomy>
      )}
    >
      {() => (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="cursor-pointer">Credentials</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Production key</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </Playground>
  )
}

// ── SearchBar ─────────────────────────────────────────────────────────────────

const SEARCH_CONTROLS: Control[] = [
  {
    type: "select",
    name: "size",
    label: "Size",
    options: [
      { value: "default", label: "Default" },
      { value: "sm", label: "Small" },
    ],
    defaultValue: "default",
  },
  { type: "toggle", name: "filters", label: "With filters", defaultValue: true },
]

// The transactions list's real categories, trimmed to three so the panel stays
// legible. Each `type` drives a different editor inside the filter builder.
const CATEGORIES: FilterCategory[] = [
  { id: "status", label: "Status", type: "list", values: ["Completed", "Pending", "Failed"] },
  { id: "date", label: "Date range", type: "datetime", maxRangeDays: 31 },
  { id: "amount", label: "Amount", type: "amount" },
]

function SearchBarDemo() {
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState<Record<string, CategoryValue[]>>({
    status: ["Completed"],
  })

  return (
    <Playground
      controls={SEARCH_CONTROLS}
      minHeight={180}
      details={(state) => (
        <Anatomy>
          <Part name="value / onChange">The query. Controlled.</Part>
          {state.filters ? (
            <>
              <Part name="filterCategories">
                What can be filtered on. Each carries a <Code>type</Code> that
                decides its editor: a list, a date range, an amount, a time window
                or free text.
              </Part>
              <Part name="activeFilters">
                What is currently applied, as chips under the field.
              </Part>
            </>
          ) : null}
          <Part name="kbdHint" optional>
            A <Code>Kbd</Code> in the field, naming the shortcut that focuses it.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        const withFilters = Boolean(state.filters)
        return (
          <div className="w-full max-w-lg">
            <SearchBar
              size={String(state.size) as "default" | "sm"}
              placeholder="Search transactions"
              value={query}
              onChange={setQuery}
              kbdHint={
                <span className="flex items-center gap-1">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                </span>
              }
              filterCategories={withFilters ? CATEGORIES : undefined}
              activeFilters={withFilters ? active : undefined}
              // Keeps the chip row present when the last chip is removed. Without
              // it the bar collapses and the panel jumps, which reads as a bug even
              // though it is the right behaviour on a real list page.
              alwaysShowFilterBar={withFilters}
              onApplyFilter={(id, values) =>
                setActive((prev) => ({ ...prev, [id]: values }))
              }
              onRemoveFilter={(id, value) =>
                setActive((prev) => ({
                  ...prev,
                  [id]: (prev[id] ?? []).filter((v) => v !== value),
                }))
              }
              onClearFilters={() => setActive({})}
            />
          </div>
        )
      }}
    </Playground>
  )
}

// ── HelpExpander ──────────────────────────────────────────────────────────────

const HELP_CONTROLS: Control[] = [
  {
    type: "select",
    name: "mode",
    label: "Mode",
    options: [
      { value: "popover", label: "Popover" },
      { value: "inset", label: "Inset" },
    ],
    defaultValue: "popover",
  },
]

function HelpExpanderDemo() {
  return (
    <Playground
      controls={HELP_CONTROLS}
      minHeight={190}
      details={(state) => (
        <Anatomy>
          <Part name="title">The card heading.</Part>
          <Part name="children">
            The explanation. Prose, not a list of props.
          </Part>
          <Part name="mode">
            {String(state.mode) === "inset"
              ? "Expands inside the nearest positioned container, frosting what is behind it."
              : "Floats beside the trigger, portaled, so it works anywhere."}
          </Part>
          <Part name="trigger" optional>
            Defaults to a circular question mark. Pass a label to make it a text
            trigger instead.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="relative flex w-full max-w-sm items-center gap-2">
          <span className="text-heading-4">Quorum approval</span>
          <HelpExpander
            mode={String(state.mode) as "popover" | "inset"}
            title="What counts as quorum"
          >
            A movement above the operator's limit needs a second approval from
            someone with the same role. The second factor can live outside the
            ledger.
          </HelpExpander>
        </div>
      )}
    </Playground>
  )
}

// ── Date and time ─────────────────────────────────────────────────────────────

const DATE_CONTROLS: Control[] = [
  {
    type: "select",
    name: "kind",
    label: "Component",
    options: [
      { value: "point", label: "DateTimePicker" },
      { value: "range", label: "DateTimeRangePicker" },
      { value: "time", label: "TimeField" },
    ],
    defaultValue: "point",
  },
]

function DateTimeDemo() {
  const [point, setPoint] = React.useState<DateTimeValue | null>(null)
  const [range, setRange] = React.useState<DateTimeRange | null>(null)
  const [time, setTime] = React.useState("")

  return (
    <Playground
      controls={DATE_CONTROLS}
      minHeight={190}
      details={(state) => {
        const kind = String(state.kind)
        if (kind === "time") {
          return (
            <Anatomy>
              <Part name="value / onChange">
                <Code>HH:MM</Code>, 24-hour, as a string.
              </Part>
              <Part name="placeholder" optional>
                Defaults to <Code>00:00</Code>.
              </Part>
            </Anatomy>
          )
        }
        if (kind === "range") {
          return (
            <Anatomy>
              <Part name="value / onChange">
                <Code>{"{ from, to, startTime, endTime }"}</Code>. One object, so a
                range is never half-set.
              </Part>
              <Part name="maxRangeDays" optional>
                Caps the span. A limit on DURATION, not on staying inside one
                calendar day.
              </Part>
            </Anatomy>
          )
        }
        return (
          <Anatomy>
            <Part name="value / onChange">
              <Code>{"{ date, time }"}</Code>. Picking a date with no time set yet
              fills <Code>00:00</Code>, so the field is never half-empty.
            </Part>
            <Part name="disabled" optional>
              Days to block, e.g. <Code>{"{ before: new Date() }"}</Code>.
            </Part>
          </Anatomy>
        )
      }}
    >
      {(state) => {
        const kind = String(state.kind)

        if (kind === "time") {
          return (
            <div className="w-full max-w-[9rem] space-y-1.5">
              <Label>Cut-off time</Label>
              <TimeField value={time} onChange={setTime} />
            </div>
          )
        }

        if (kind === "range") {
          return (
            <div className="w-full max-w-sm space-y-1.5">
              <Label>Period</Label>
              <DateTimeRangePicker value={range} onChange={setRange} maxRangeDays={31} />
            </div>
          )
        }

        return (
          <div className="w-full max-w-sm space-y-1.5">
            <Label>Expires at</Label>
            <DateTimePicker value={point} onChange={setPoint} />
          </div>
        )
      }}
    </Playground>
  )
}

export {
  BreadcrumbDemo,
  SearchBarDemo,
  HelpExpanderDemo,
  DateTimeDemo,
}
