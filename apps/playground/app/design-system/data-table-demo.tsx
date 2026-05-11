"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { TextStack, DataCell, AmountCell } from "@/components/ui/cell"

type Client = {
  id: string
  name: string
  company: string
  status: "Active" | "Inactive" | "Pending"
  amount: string
  lastActivity: string
}

const data: Client[] = [
  { id: "CLT-0012-A1", name: "María García",    company: "Empresa SAS",  status: "Active",   amount: "$4,200.00", lastActivity: "Today 14:28" },
  { id: "CLT-0011-B3", name: "Carlos Mendoza",  company: "Tech Latam",   status: "Active",   amount: "$1,800.00", lastActivity: "Today 14:22" },
  { id: "CLT-0010-C7", name: "Laura Castillo",  company: "Finco Group",  status: "Inactive", amount: "$900.00",   lastActivity: "Today 13:58" },
  { id: "CLT-0009-D2", name: "Andrés Restrepo", company: "DataMind Co.", status: "Pending",  amount: "$3,100.00", lastActivity: "Today 13:41" },
  { id: "CLT-0008-E5", name: "Valentina Ríos",  company: "Soft House",   status: "Active",   amount: "$5,400.00", lastActivity: "Today 13:29" },
  { id: "CLT-0007-F9", name: "Felipe Vargas",   company: "Logix SAS",    status: "Pending",  amount: "$2,200.00", lastActivity: "Today 13:05" },
  { id: "CLT-0006-G4", name: "Camila Torres",   company: "NeoBanco",     status: "Active",   amount: "$7,800.00", lastActivity: "Today 12:58" },
  { id: "CLT-0005-H8", name: "Diego Salazar",   company: "PagoRápido",   status: "Inactive", amount: "$1,100.00", lastActivity: "Today 12:47" },
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

export function DataTableDemo() {
  return <DataTable columns={columns} data={data} pageSize={5} />
}
