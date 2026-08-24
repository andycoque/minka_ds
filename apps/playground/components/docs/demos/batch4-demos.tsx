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
  Label,
  SearchBar,
  Kbd,
  AmountCell,
  StatusCell,
  TimeField,
  type CategoryValue,
  type DateTimeRange,
  type DateTimeValue,
  type FilterCategory,
} from "minka-ds"
import { Command, CornerDownLeft } from "lucide-react"
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
      // The filter dropdown renders inside the stage rather than portaled, so the
      // stage's clip would cut it off mid-list.
      overflowVisible
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
            The shortcut that focuses the field. Pass bare content, not a{" "}
            <Code>Kbd</Code>: the field wraps it in one already.
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
              kbdHint={<><Command className="size-3" /> K</>}
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

// ── SearchBar: suggested results ──────────────────────────────────────────────

/**
 * The transactions list's suggestion dropdown, verbatim in structure.
 *
 * `SearchBar` takes it as `children` rather than owning it: what counts as a result and
 * how a hit is rendered is the page's business, and the ledger's search is not the same
 * shape as, say, the directory's.
 */
const SUGGEST_CONTROLS: Control[] = [
  {
    type: "select",
    name: "state",
    label: "State",
    options: [
      { value: "hits", label: "Matches" },
      { value: "empty", label: "No matches" },
    ],
    defaultValue: "hits",
  },
]

const HITS = [
  { id: "MOL-9291-596C-85DB", pair: "Bancolombia → Nequi", amount: "$120,000.00", status: "Completed" as const },
  { id: "MOL-4417-2A0F-19CC", pair: "Davivienda → Nequi", amount: "$47,500.00", status: "Pending" as const },
]

const HIT_VARIANT = { Completed: "success", Pending: "warning" } as const

function SearchSuggestionsDemo() {
  const [query, setQuery] = React.useState("MOL")

  return (
    <Playground
      controls={SUGGEST_CONTROLS}
      minHeight={260}
      overflowVisible
      details={(state) => (
        <Anatomy>
          <Part name="children">
            The dropdown. Positioned by the page, so the results can be shaped like the
            records being searched.
          </Part>
          <Part name="Result row">
            The identifier on top, the parties beneath, the amount and status on the
            right. A whole row is one target.
          </Part>
          {state.state === "empty" ? (
            <Part name="Empty state">
              Not a dead end: it says pressing Enter searches the full database. The
              list is scoped to the current view, so no match here does not mean no
              match anywhere.
            </Part>
          ) : (
            <Part name="Footer hint">
              Present even when there are hits, because the visible rows are only what
              matches the current view.
            </Part>
          )}
        </Anatomy>
      )}
    >
      {(state) => {
        const empty = state.state === "empty"
        return (
          <div className="w-full max-w-lg">
            <SearchBar
              size="sm"
              placeholder="Search by Transaction ID, sender, alias, or description"
              value={empty ? "ZZZ-0000" : query}
              onChange={setQuery}
              kbdHint={<><Command className="size-3" /> K</>}
            >
              <div className="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden [border-radius:var(--radius-popover)] border border-[var(--color-border-default)] bg-[var(--color-bg-overlay)] shadow-[var(--shadow-popover)]">
                {empty ? (
                  <div className="flex flex-col gap-0.5 px-4 py-3">
                    <span className="flex items-center gap-1 text-body-sm text-[var(--color-text-default)]">
                      Press <Kbd><CornerDownLeft className="size-3" /></Kbd> to search for
                      &ldquo;ZZZ-0000&rdquo; in the full database
                    </span>
                    <span className="text-caption text-[var(--color-text-muted)]">
                      No matches in current view
                    </span>
                  </div>
                ) : (
                  <>
                    {HITS.map(h => (
                      <button
                        key={h.id}
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-[var(--color-bg-table-hover)]"
                      >
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="text-label-sm">{h.id}</span>
                          <span className="truncate text-caption text-[var(--color-text-muted)]">
                            {h.pair}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          <AmountCell>{h.amount}</AmountCell>
                          <StatusCell variant={HIT_VARIANT[h.status]}>{h.status}</StatusCell>
                        </span>
                      </button>
                    ))}
                    <div className="flex items-center gap-1 border-t border-[var(--color-border-subtle)] px-4 py-2 text-caption text-[var(--color-text-hint)]">
                      Press <CornerDownLeft className="inline size-3" /> to search all
                      transactions
                    </div>
                  </>
                )}
              </div>
            </SearchBar>
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
              ? "Expands into the nearest positioned container, frosting what is behind it. In practice that means a dialog's left panel — the only surface with room."
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
        // `inset` is rendered inside a panel-shaped container, because that is the only
        // place it works: it expands into the nearest positioned ancestor, and a
        // dialog's left panel is the one surface with room. Showing it beside a heading
        // would demonstrate the case the page tells you not to build.
        state.mode === "inset" ? (
          <div className="relative flex h-[190px] w-full max-w-[280px] flex-col items-center justify-center gap-3 overflow-hidden [border-radius:var(--radius-card)] bg-[var(--color-bg-base)] p-4">
            <span className="text-caption text-[var(--color-text-muted)]">
              A dialog&rsquo;s left panel
            </span>
            <div className="w-full [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] p-3">
              <span className="text-body-sm text-[var(--color-text-default)]">
                Preview card
              </span>
            </div>
            <HelpExpander mode="inset" anchor="bottom-right" title="What counts as quorum">
              A movement above the operator&rsquo;s limit needs a second approval from
              someone with the same role.
            </HelpExpander>
          </div>
        ) : (
          <div className="relative flex w-full max-w-sm items-center gap-2">
            <span className="text-heading-4">Quorum approval</span>
            <HelpExpander mode="popover" title="What counts as quorum">
              A movement above the operator&rsquo;s limit needs a second approval from
              someone with the same role. The second factor can live outside the
              ledger.
            </HelpExpander>
          </div>
        )
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
  SearchSuggestionsDemo,
  HelpExpanderDemo,
  DateTimeDemo,
}
