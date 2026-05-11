"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { ChevronsUpDown, ChevronUp, ChevronDown, Columns3Cog } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"
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

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: TanstackTable<TData>["getColumn"] extends (id: string) => infer C ? NonNullable<C> : never
  title: string
}

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

// ── Pagination ────────────────────────────────────────────────────────────────

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages: (number | "ellipsis")[] = [1]
  if (currentPage > 3) pages.push("ellipsis")
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (currentPage < totalPages - 2) pages.push("ellipsis")
  pages.push(totalPages)
  return pages
}

function DataTablePagination<TData>({
  table,
}: {
  table: TanstackTable<TData>
}) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()
  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center justify-between">
      <p className="text-body-sm text-[var(--color-text-muted)]">
        Page {currentPage} of {totalPages}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => table.previousPage()}
              aria-disabled={!table.getCanPreviousPage()}
              className={cn(!table.getCanPreviousPage() && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          {pages.map((page, i) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => table.setPageIndex(page - 1)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => table.nextPage()}
              aria-disabled={!table.getCanNextPage()}
              className={cn(!table.getCanNextPage() && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

// ── DataTable ─────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageSize?: number
  onRowClick?: (row: TData) => void
}

function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { pagination: { pageSize } },
    state: { sorting, columnVisibility },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] overflow-hidden">
        <Table className="[&_th:first-child]:pl-4 [&_td:first-child]:pl-4">
          <TableHeader className="bg-[var(--color-bg-base)]">
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
      <DataTablePagination table={table} />
    </div>
  )

}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableColumnToggle,
  DataTablePagination,
}
