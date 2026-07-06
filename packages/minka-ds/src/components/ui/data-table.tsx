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
import { ChevronsUpDown, ChevronUp, ChevronDown, Columns3Cog } from "lucide-react"

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

function DataTable<TData, TValue>({
  columns,
  data,
  batchSize = 40,
  onRowClick,
  variant = "default",
  initialColumnVisibility,
  persistenceKey,
  className,
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

  return (
    <div className={cn("relative flex flex-col min-h-0", className)}>
      <div
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-auto rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] [&_[data-slot=table-container]]:overflow-visible"
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
  DataTableColumnHeader,
  DataTableColumnToggle,
}
export type { DataTableProps }
