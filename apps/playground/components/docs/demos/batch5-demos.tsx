"use client"

import * as React from "react"
import {
  Badge,
  DataCell,
  DataTable,
  Skeleton,
  TabCount,
  StatusCell,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "minka-ds"
// From TanStack, not the DS: DataTable takes its column definitions directly, which
// is also how every studio list page imports this type.
import { type ColumnDef } from "@tanstack/react-table"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Batch 5 demos. Every specimen is drawn from product code:
 *
 *   DataTable    the directory list, with its real columns
 *   Tabs         the transactions list's tab row
 *   Skeleton     the shapes the list pages actually render while loading
 */

// ── DataTable ─────────────────────────────────────────────────────────────────

type Row = {
  handle: string
  participant: string
  target: string
  status: "Active" | "Inactive" | "Blocked"
}

const ROWS: Row[] = [
  { handle: "pay.bancolombia", participant: "Bancolombia S.A.", target: "0345 6678 9012", status: "Active" },
  { handle: "pay.davivienda", participant: "Davivienda", target: "0072 1145 3398", status: "Active" },
  { handle: "pay.bogota", participant: "Banco de Bogotá", target: "0481 9920 1175", status: "Inactive" },
  { handle: "3005550142", participant: "Nequi", target: "3104 5567 8821", status: "Active" },
  { handle: "maria.rodriguez@minka.io", participant: "Banco Minka", target: "0590 3312 7744", status: "Blocked" },
]

const VARIANT: Record<Row["status"], "success" | "neutral" | "blocked"> = {
  Active: "success",
  Inactive: "neutral",
  Blocked: "blocked",
}

const TABLE_CONTROLS: Control[] = [
  {
    type: "select",
    name: "variant",
    label: "Variant",
    options: [
      { value: "default", label: "Default" },
      { value: "compact", label: "Compact" },
    ],
    defaultValue: "default",
  },
  { type: "toggle", name: "clickable", label: "Rows navigate", defaultValue: true },
]

function DataTableDemo() {
  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "handle", header: "Directory key", cell: ({ row }) => <DataCell>{row.original.handle}</DataCell> },
      { accessorKey: "participant", header: "Participant", cell: ({ row }) => <DataCell>{row.original.participant}</DataCell> },
      { accessorKey: "target", header: "Target", cell: ({ row }) => <DataCell>{row.original.target}</DataCell> },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusCell variant={VARIANT[row.original.status]}>{row.original.status}</StatusCell>
        ),
      },
    ],
    [],
  )

  return (
    <Playground
      controls={TABLE_CONTROLS}
      minHeight={330}
      details={(state) => (
        <Anatomy>
          <Part name="columns">
            TanStack <Code>ColumnDef</Code>s. Each cell returns a table-cell primitive
            rather than raw text, which is what keeps two tables looking alike.
          </Part>
          <Part name="data">
            The rows. Filtering and sorting happen before this: the table renders what
            it is given.
          </Part>
          <Part name="variant">
            {state.variant === "compact"
              ? "Compact tightens row height, for a table inside a tab or a panel."
              : "Default row height, for a full list page."}
          </Part>
          <Part name="onRowClick" optional>
            {state.clickable
              ? "Makes the whole row the target. Prefer this to a link inside a cell."
              : "Omitted here, so rows are inert."}
          </Part>
          <Part name="batchSize" optional>
            Rows rendered per batch, extended on scroll. 40 by default, so a long list
            does not mount thousands of rows at once.
          </Part>
          <Part name="persistenceKey" optional>
            Persists the column-visibility choice to localStorage, so it survives
            navigation instead of resetting on every mount.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="w-full">
          <DataTable
            columns={columns}
            data={ROWS}
            variant={String(state.variant) as "default" | "compact"}
            onRowClick={state.clickable ? () => {} : undefined}
          />
        </div>
      )}
    </Playground>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS_CONTROLS: Control[] = [
  {
    type: "select",
    name: "variant",
    label: "Variant",
    options: [
      { value: "subtle", label: "Subtle" },
      { value: "line", label: "Line" },
      { value: "default", label: "Default" },
    ],
    defaultValue: "subtle",
  },
  { type: "toggle", name: "counts", label: "With counts", defaultValue: true },
]

function TabsDemo() {
  return (
    <Playground
      controls={TABS_CONTROLS}
      minHeight={200}
      details={(state) => (
        <Anatomy>
          <Part name="TabsList">
            The row of tabs. <Code>variant</Code> decides how it reads against its
            surroundings.
          </Part>
          <Part name="TabsTrigger">
            One tab. The label is a noun, not a verb: these switch a view, they do not
            perform an action.
          </Part>
          <Part name="TabsContent">
            The panel for each tab. Only the active one is mounted.
          </Part>
          <Part name="variant">
            {state.variant === "line"
              ? "An underline row, for in-page sections on a detail page."
              : state.variant === "subtle"
              ? "A recessed group, for switching a list's scope on a page header."
              : "A raised group with an inverted active tab. Available, but unused in the product today."}
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <Tabs defaultValue="all" className="w-full max-w-md">
          <TabsList variant={String(state.variant) as "default" | "subtle" | "line"}>
            {/* TabCount, not Badge: the liquidity tabs use it, and it is a fixed-size
                circle built for this slot. */}
            <TabsTrigger value="all">
              All{state.counts ? <TabCount count={128} /> : null}
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending{state.counts ? <TabCount count={4} /> : null}
            </TabsTrigger>
            <TabsTrigger value="failed">
              Failed{state.counts ? <TabCount count={2} /> : null}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <p className="pt-3 text-body-sm text-[var(--color-text-muted)]">
              Every transaction in the period.
            </p>
          </TabsContent>
          <TabsContent value="pending">
            <p className="pt-3 text-body-sm text-[var(--color-text-muted)]">
              Waiting on a participant.
            </p>
          </TabsContent>
          <TabsContent value="failed">
            <p className="pt-3 text-body-sm text-[var(--color-text-muted)]">
              Rejected or timed out.
            </p>
          </TabsContent>
        </Tabs>
      )}
    </Playground>
  )
}

// ── Badge ────────────────────────────────────────────────────────────────────

/**
 * Badge is effectively one variant in practice: `secondary` is 24 of its 29 uses in
 * studio. The chip exists to show the sanctioned set rather than all seven, because
 * three of the seven duplicate what StatusCell already does better.
 */
const BADGE_CONTROLS: Control[] = [
  {
    type: "select",
    name: "variant",
    label: "Variant",
    options: [
      { value: "secondary", label: "Secondary" },
      { value: "default", label: "Default" },
      { value: "error", label: "Error" },
    ],
    defaultValue: "secondary",
  },
]

function BadgeDemo() {
  return (
    <Playground
      controls={BADGE_CONTROLS}
      minHeight={140}
      details={(state) => (
        <Anatomy>
          <Part name="children">
            The label. A category, a count, a code — a few words at most.
          </Part>
          <Part name="variant">
            {state.variant === "secondary"
              ? "The one to reach for: a quiet label that does not compete with the row it sits in. 24 of 29 uses in the product."
              : state.variant === "default"
              ? "Heavier. For a label that has to be noticed, e.g. a type marker on a card."
              : "Reserved for a code or identifier that IS an error, such as a failure code. Not for a status."}
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        const variant = String(state.variant) as "secondary" | "default" | "error"
        return (
          <div className="flex flex-wrap items-center gap-2">
            {variant === "error" ? (
              <Badge variant="error">INSUFFICIENT_FUNDS</Badge>
            ) : (
              <>
                <Badge variant={variant}>Admin</Badge>
                <Badge variant={variant}>Operator</Badge>
                <Badge variant={variant}>QR code</Badge>
              </>
            )}
          </div>
        )
      }}
    </Playground>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

const SKELETON_CONTROLS: Control[] = [
  {
    type: "select",
    name: "shape",
    label: "Shape",
    options: [
      { value: "table", label: "Table rows" },
      { value: "detail", label: "Detail fields" },
      { value: "card", label: "Stat cards" },
    ],
    defaultValue: "table",
  },
]

function SkeletonDemo() {
  return (
    <Playground
      controls={SKELETON_CONTROLS}
      minHeight={230}
      details={() => (
        <Anatomy>
          <Part name="className">
            The only prop. Every real use sets a height and a width, because a skeleton
            has to be the size of the thing it stands in for.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        if (state.shape === "detail") {
          return (
            <div className="flex w-full max-w-sm flex-col gap-4">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          )
        }

        if (state.shape === "card") {
          return (
            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="flex flex-col gap-2 [border-radius:var(--radius-card)] border border-[var(--color-border-default)] p-3"
                >
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          )
        }

        return (
          <div className="flex w-full max-w-md flex-col gap-2">
            {/* The shape the list pages render: one full-width bar per row. */}
            {[0, 1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-9 w-full shrink-0" />
            ))}
          </div>
        )
      }}
    </Playground>
  )
}

export { DataTableDemo, TabsDemo, BadgeDemo, SkeletonDemo }
