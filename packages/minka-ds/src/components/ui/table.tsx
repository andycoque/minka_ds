"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const tableCellAlignVariants = cva("", {
  variants: {
    align: {
      left:  "text-left",
      right: "text-right",
    },
  },
  defaultVariants: {
    align: "left",
  },
})

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-body-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "[&_tr]:border-b [&_tr]:border-[var(--color-border-subtle)] [&_tr]:hover:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-raised)] text-label-sm [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-[var(--color-border-subtle)] transition-colors hover:bg-[var(--color-bg-table-hover)] has-aria-expanded:bg-[var(--color-bg-table-hover)] data-[state=selected]:bg-[var(--color-bg-table-selected)]",
        className
      )}
      {...props}
    />
  )
}

function TableHead({
  className,
  align,
  ...props
}: React.ComponentProps<"th"> & VariantProps<typeof tableCellAlignVariants>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 align-middle text-label-sm text-[var(--color-text-default)] whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        tableCellAlignVariants({ align }),
        className
      )}
      {...props}
    />
  )
}

function TableCell({
  className,
  align,
  ...props
}: React.ComponentProps<"td"> & VariantProps<typeof tableCellAlignVariants>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap text-[var(--color-text-default)] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        tableCellAlignVariants({ align }),
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-body-sm text-[var(--color-text-muted)]", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
