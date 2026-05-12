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
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={col.getIsVisible()}
              onCheckedChange={(val) => col.toggleVisibility(!!val)}
            >
              {col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── DataTable ─────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  batchSize?: number
  onRowClick?: (row: TData) => void
  className?: string
}

function DataTable<TData, TValue>({
  columns,
  data,
  batchSize = 20,
  onRowClick,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [displayCount, setDisplayCount] = React.useState(batchSize)
  const [hasMore, setHasMore] = React.useState(data.length > batchSize)

  const displayedData = React.useMemo(
    () => data.slice(0, displayCount),
    [data, displayCount]
  )

  const table = useReactTable({
    data: displayedData,
    columns,
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

        <Table className="[&_th:first-child]:pl-4 [&_td:first-child]:pl-4">
          <TableHeader className="sticky top-0 [z-index:var(--z-sticky)] bg-[var(--color-bg-base)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead key={header.id}>
                    {index === headerGroup.headers.length - 1 ? (
                      <div className="flex items-center justify-between gap-2">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
