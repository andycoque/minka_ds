"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { TextStack, DataCell, AmountCell } from "@/components/ui/cell"

type Client = {
  id: string
  name: string
  company: string
  type: "Individual" | "Business" | "Partner"
  status: "Active" | "Inactive" | "Pending"
  amount: string
  lastActivity: string
}

const data: Client[] = [
  { id: "CLT-0012-A1", name: "María García",    company: "Empresa SAS",  type: "Business",   status: "Active",   amount: "$4,200.00", lastActivity: "Today 14:28" },
  { id: "CLT-0011-B3", name: "Carlos Mendoza",  company: "Tech Latam",   type: "Partner",    status: "Active",   amount: "$1,800.00", lastActivity: "Today 14:22" },
  { id: "CLT-0010-C7", name: "Laura Castillo",  company: "Finco Group",  type: "Individual", status: "Inactive", amount: "$900.00",   lastActivity: "Today 13:58" },
  { id: "CLT-0009-D2", name: "Andrés Restrepo", company: "DataMind Co.", type: "Business",   status: "Pending",  amount: "$3,100.00", lastActivity: "Today 13:41" },
  { id: "CLT-0008-E5", name: "Valentina Ríos",  company: "Soft House",   type: "Individual", status: "Active",   amount: "$5,400.00", lastActivity: "Today 13:29" },
  { id: "CLT-0007-F9", name: "Felipe Vargas",   company: "Logix SAS",    type: "Partner",    status: "Pending",  amount: "$2,200.00", lastActivity: "Today 13:05" },
  { id: "CLT-0006-G4", name: "Camila Torres",   company: "NeoBanco",     type: "Business",   status: "Active",   amount: "$7,800.00", lastActivity: "Today 12:58" },
  { id: "CLT-0005-H8", name: "Diego Salazar",   company: "PagoRápido",   type: "Individual", status: "Inactive", amount: "$1,100.00", lastActivity: "Today 12:47" },
]

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <DataCell>{row.getValue("id")}</DataCell>,
  },
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original
      return <TextStack primary={client.name} secondary={client.company} />
    },
  },
  {
    accessorKey: "amount",
    header: () => <span className="block w-full text-right">Amount</span>,
    cell: ({ row }) => <AmountCell className="block w-full text-right">{row.getValue("amount")}</AmountCell>,
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last activity" />,
    cell: ({ row }) => <DataCell>{row.getValue("lastActivity")}</DataCell>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<Client["status"]>("status")
      const variant = { Active: "success", Inactive: "ghost", Pending: "warning" } as const
      return <Badge variant={variant[status]}>{status}</Badge>
    },
  },
]

const linearColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-body-sm text-[var(--color-text-muted)] font-mono">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Client",
    cell: ({ row }) => {
      const client = row.original
      return (
        <div>
          <span className="text-body-sm font-medium text-[var(--color-text-default)]">{client.name}</span>
          <span className="text-body-sm text-[var(--color-text-muted)] ml-1.5">{client.company}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue<Client["type"]>("type")
      const variant = { Individual: "secondary", Business: "secondary", Partner: "info" } as const
      return <Badge variant={variant[type]}>{type}</Badge>
    },
  },
  {
    accessorKey: "amount",
    header: () => <span className="block w-full text-right">Amount</span>,
    cell: ({ row }) => (
      <span className="block w-full text-right text-body-sm font-medium text-[var(--color-text-default)]">
        {row.getValue("amount")}
      </span>
    ),
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last activity" />,
    cell: ({ row }) => (
      <span className="text-body-sm text-[var(--color-text-muted)]">{row.getValue("lastActivity")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<Client["status"]>("status")
      const dot = {
        Active:   "bg-[var(--primitive-green-500)]",
        Inactive: "bg-[var(--color-text-disabled)]",
        Pending:  "bg-[var(--primitive-yellow-400)]",
      } as const
      const text = {
        Active:   "text-[var(--primitive-green-700)]",
        Inactive: "text-[var(--color-text-muted)]",
        Pending:  "text-[var(--primitive-yellow-700)]",
      } as const
      return (
        <span className={`inline-flex items-center gap-1.5 text-body-sm ${text[status]}`}>
          <span className={`size-1.5 rounded-full ${dot[status]}`} />
          {status}
        </span>
      )
    },
  },
]

export function DataTableDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-label-sm text-[var(--color-text-muted)]">Default</p>
        <DataTable columns={columns} data={data} />
      </div>
      <div className="space-y-2">
        <p className="text-label-sm text-[var(--color-text-muted)]">Compact</p>
        <DataTable columns={linearColumns} data={data} variant="compact" />
      </div>
    </div>
  )
}
