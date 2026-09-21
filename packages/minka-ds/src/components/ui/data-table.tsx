"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { ChevronsUpDown, ChevronUp, ChevronDown, Columns3Cog, Ghost } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

// Optional per-column metadata. `label` gives the column-visibility toggle a
// readable name (headers may be JSX, and stable ids are opaque).
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends unknown, TValue> {
    label?: string
  }
}

// ── Column header with sort control ──────────────────────────────────────────

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: ReturnType<TanstackTable<TData>["getColumn"]>
  title: string
  className?: string
}) {
  if (!column?.getCanSort()) {
    return <span className={cn("text-label-sm", className)}>{title}</span>
  }

  return (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn(
        "inline-flex items-center gap-1 text-label-sm text-[var(--color-text-default)] hover:text-[var(--color-text-muted)] transition-colors",
        className
      )}
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ChevronUp className="size-3.5" />
      ) : column.getIsSorted() === "desc" ? (
        <ChevronDown className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 text-[var(--color-text-disabled)]" />
      )}
    </button>
  )
}

// ── Column visibility toggle ──────────────────────────────────────────────────

function DataTableColumnToggle<TData>({
  table,
}: {
  table: TanstackTable<TData>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" className="my-2">
          <Columns3Cog />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => {
            // Readable label: meta.label → a string header → the id.
            const header = col.columnDef.header
            const label = col.columnDef.meta?.label ?? (typeof header === "string" ? header : col.id)
            return (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(val) => col.toggleVisibility(!!val)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── DataTable ─────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  /**
   * Column definitions. A column with `id: "actions"` is auto-pinned
   * (non-hideable, never in the toggle). Pin any other column by setting
   * `enableHiding: false` on its ColumnDef.
   */
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  batchSize?: number
  onRowClick?: (row: TData) => void
  variant?: "default" | "compact"
  initialColumnVisibility?: VisibilityState
  /**
   * Opt-in: persist column visibility to localStorage under this key (namespaced
   * as `minka-ds:datatable:{persistenceKey}`) so the choice survives navigation
   * and reloads. Omit for the default per-mount behavior.
   */
  persistenceKey?: string
  className?: string
  /**
   * What to show when `data` is empty. Rendered in place of the whole table,
   * headers included: column headers over no rows invite the reader to sort and
   * filter something that has nothing in it.
   *
   * Pass a <DataTableEmpty> for the standard treatment (icon, heading, body, an
   * optional action row), or any node for a bespoke one. Omit it and the table
   * falls back to a plain "No results." row.
   */
  emptyState?: React.ReactNode
}

// localStorage helpers for column-visibility persistence. SSR-guarded and
// defensive (bad JSON / disabled storage never throws).
const STORAGE_PREFIX = "minka-ds:datatable:"

function readStoredVisibility(key: string | undefined): VisibilityState | null {
  if (!key || typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" ? (parsed as VisibilityState) : null
  } catch {
    return null
  }
}

function writeStoredVisibility(key: string, value: VisibilityState) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * The standard empty state for a DataTable: a muted icon in a circle, a heading,
 * an optional line of explanation, and an optional row of actions.
 *
 * It is presentational only. What the table is empty OF, and what the reader can
 * do about it, is the caller's to decide: a filtered list wants "clear the
 * filter", a genuinely new account wants "nothing here yet". Passing that logic
 * down into the DS would tie the design system to one product's vocabulary.
 */
interface DataTableEmptyProps {
  /** Defaults to a ghost outline. Pass a sized lucide icon to override. */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** A row of buttons, typically outline size="sm". Omit for a stateless empty. */
  actions?: React.ReactNode
  className?: string
}

/**
 * The empty ↔ table transition, shipped with the component so no caller has to
 * wire it. Asymmetric on purpose: the empty state is being dismissed by the
 * reader (they just cleared a filter), so it leaves quickly; the rows are the
 * answer they asked for, so they arrive a touch slower and settle.
 *
 * Scale + fade, never translate: the table is often full-height, and a translate
 * pushes past its scroll container and flashes a scrollbar.
 */
const EMPTY_TRANSITION_CSS = `
  @keyframes ds-dt-empty-out { from { opacity: 1; transform: scale(1);     } to { opacity: 0; transform: scale(0.97);  } }
  @keyframes ds-dt-empty-in  { from { opacity: 0; transform: scale(0.985); } to { opacity: 1; transform: scale(1);     } }
  @keyframes ds-dt-rows-in   { from { opacity: 0; transform: scale(0.995); } to { opacity: 1; transform: scale(1);     } }
  [data-slot="data-table-empty-wrap"][data-exiting="true"] { animation: ds-dt-empty-out 160ms cubic-bezier(0.4, 0, 1, 1) forwards; }
  [data-slot="data-table-empty-wrap"][data-exiting="false"] { animation: ds-dt-empty-in 220ms cubic-bezier(0.33, 0, 0.67, 1) both; }
  [data-slot="data-table-rows-in"] { animation: ds-dt-rows-in 480ms cubic-bezier(0.33, 0, 0.67, 1) both; }
  @media (prefers-reduced-motion: reduce) {
    [data-slot="data-table-empty-wrap"],
    [data-slot="data-table-rows-in"] { animation: none !important; }
  }
`

/** Milliseconds the empty state stays mounted while its exit animation plays. */
const EMPTY_EXIT_MS = 160

function DataTableEmpty({
  icon,
  title,
  description,
  actions,
  className,
}: DataTableEmptyProps) {
  return (
    <div
      className={cn(
        "flex min-h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center",
        className
      )}
    >
      {/* bg-canvas: a step off both the page ground (bg-base) and the table's
          raised card (bg-raised), so the disc reads whichever this renders on. */}
      <span className="flex size-16 items-center justify-center rounded-full bg-[var(--color-bg-canvas)]">
        {icon ?? (
          <Ghost
            className="size-8 text-[var(--color-text-hint)]"
            strokeWidth={1.25}
          />
        )}
      </span>

      <div className="flex flex-col gap-1.5">
        <span className="text-heading-3 text-[var(--color-text-default)]">
          {title}
        </span>
        {description && (
          <span className="text-body-sm text-[var(--color-text-muted)]">
            {description}
          </span>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

function DataTable<TData, TValue>({
  columns,
  data,
  batchSize = 40,
  onRowClick,
  variant = "default",
  initialColumnVisibility,
  persistenceKey,
  className,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const compact = variant === "compact"
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialColumnVisibility ?? {})
  const [displayCount, setDisplayCount] = React.useState(batchSize)
  const [hasMore, setHasMore] = React.useState(data.length > batchSize)

  // Persistence: restore after mount (server and first client render use the
  // plain default so hydration matches), then write on every change. Unknown
  // saved ids are harmless — VisibilityState is a sparse map and TanStack
  // ignores ids with no column; columns absent from the map default visible.
  const restored = React.useRef(false)
  React.useEffect(() => {
    if (!persistenceKey) return
    const saved = readStoredVisibility(persistenceKey)
    if (saved) setColumnVisibility(prev => ({ ...prev, ...saved }))
    restored.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistenceKey])
  React.useEffect(() => {
    if (!persistenceKey || !restored.current) return
    writeStoredVisibility(persistenceKey, columnVisibility)
  }, [persistenceKey, columnVisibility])

  const displayedData = React.useMemo(
    () => data.slice(0, displayCount),
    [data, displayCount]
  )

  // Action columns (id "actions", e.g. a row kebab menu) stay pinned: default
  // them to non-hideable so they never appear in the toggle and can't be hidden.
  // Any column can opt out of hiding explicitly with `enableHiding: false`.
  const resolvedColumns = React.useMemo(
    () => columns.map(col =>
      col.id === "actions" && col.enableHiding === undefined
        ? { ...col, enableHiding: false }
        : col
    ),
    [columns]
  )

  const table = useReactTable({
    data: displayedData,
    columns: resolvedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnVisibility },
  })

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const remaining = scrollHeight - scrollTop - clientHeight
    setHasMore(remaining > 2 || displayCount < data.length)
    if (remaining < 120) {
      setDisplayCount((c) => Math.min(c + batchSize, data.length))
    }
  }

  // ── Empty ↔ table transition ───────────────────────────────────────────────
  //
  // The empty state has to outlive its own exit animation. A plain
  // `isEmpty ? <Empty/> : <Table/>` unmounts it on the same frame the rows
  // mount, so the exit never gets a frame to play. So the swap is HELD: while
  // exiting, the empty state stays mounted carrying data-exiting="true", and
  // only after EMPTY_EXIT_MS do the rows take over.
  //
  // Driven by an effect watching `data`, not by the caller, so it fires no
  // matter how the table came to empty or fill (a cleared filter, a tab switch,
  // a background refresh).
  const hasEmptyState = emptyState != null
  const isEmpty = data.length === 0
  const [showEmpty, setShowEmpty] = React.useState(isEmpty && hasEmptyState)
  const [emptyExiting, setEmptyExiting] = React.useState(false)
  // Held copy of the emptyState node, captured when the exit begins so the
  // caller re-rendering it (a cleared filter drops its own button) cannot make
  // parts of it disappear ahead of the fade.
  const frozenEmpty = React.useRef<React.ReactNode>(null)
  // True only for the one render where rows have just displaced the empty state,
  // so a plain first mount or a navigation (rowsEntering never set) gets no
  // fade — only the handover does.
  const [rowsEntering, setRowsEntering] = React.useState(false)

  React.useEffect(() => {
    if (!hasEmptyState) {
      setShowEmpty(false)
      return
    }
    if (isEmpty) {
      // Arriving at empty is immediate: the reader just narrowed the view and
      // the answer belongs on screen now, not after a fade.
      setEmptyExiting(false)
      setShowEmpty(true)
      return
    }
    if (!showEmpty) return
    setEmptyExiting(true)
    const t = window.setTimeout(() => {
      setShowEmpty(false)
      setEmptyExiting(false)
      setRowsEntering(true)
    }, EMPTY_EXIT_MS)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEmptyState, isEmpty, showEmpty])

  // Keep a live copy of the node WHILE genuinely empty, so that the moment the
  // table refills (the caller instantly rebuilds emptyState without its now-
  // irrelevant "Clear" button) there is already a last-good node to animate out.
  // Capturing later — in an effect, or on the exit frame — is too late: this
  // component has re-rendered with the stripped node by then.
  if (isEmpty && !emptyExiting) {
    frozenEmpty.current = emptyState
  } else if (!showEmpty) {
    frozenEmpty.current = null
  }

  // Clear the one-shot flag on the next frame, after the animation has been
  // handed its starting styles.
  React.useEffect(() => {
    if (!rowsEntering) return
    const id = window.requestAnimationFrame(() => setRowsEntering(false))
    return () => window.cancelAnimationFrame(id)
  }, [rowsEntering])

  if (showEmpty) {
    // No bordered card: the empty state sits in the same bare frame the table
    // would, matching the way it was first built on the transactions list.
    return (
      <div className={cn("relative flex flex-col min-h-0", className)}>
        <style>{EMPTY_TRANSITION_CSS}</style>
        <div
          data-slot="data-table-empty-wrap"
          data-exiting={emptyExiting}
          className="flex min-h-0 flex-1 flex-col"
        >
          {showEmpty && !isEmpty ? frozenEmpty.current : emptyState}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative flex flex-col min-h-0", className)}>
      <style>{EMPTY_TRANSITION_CSS}</style>
      <div
        onScroll={handleScroll}
        data-slot={rowsEntering ? "data-table-rows-in" : undefined}
        className="ds-scroll flex-1 min-h-0 overflow-auto rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] [&_[data-slot=table-container]]:overflow-visible"
      >

        <Table className={cn(
          "[&_th:first-child]:pl-4 [&_td:first-child]:pl-4",
          compact && "[&_th]:h-7 [&_th]:text-caption [&_th]:text-[var(--color-text-default)] [&_td]:h-11 [&_td]:py-1.5 [&_td]:text-body-sm"
        )}>
          <TableHeader className={cn(
            "sticky top-0 [z-index:var(--z-sticky)]",
            "bg-[var(--color-bg-base)]"
          )}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead key={header.id}>
                    {index === headerGroup.headers.length - 1 ? (
                      <div className="flex items-center justify-between gap-2">
                        <span>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</span>
                        <DataTableColumnToggle table={table} />
                      </div>
                    ) : (
                      header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[var(--color-text-muted)]"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasMore && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 rounded-b-[var(--radius-card)] bg-gradient-to-t from-[var(--color-bg-raised)] to-transparent" />
      )}
    </div>
  )
}

export {
  DataTable,
  DataTableEmpty,
  DataTableColumnHeader,
  DataTableColumnToggle,
}
export type { DataTableProps, DataTableEmptyProps }
