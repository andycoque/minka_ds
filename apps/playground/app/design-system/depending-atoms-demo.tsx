"use client"

import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  TextStack, DataCell, AmountCell, BadgeCell, ActionCell, StatusCell,
  Badge, Button,
} from "minka-ds"
import { MoreHorizontal } from "lucide-react"

// ── Cells — shown inside a real table row, their only valid context ──────────
export function CellsDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>DataCell</TableHead>
          <TableHead>TextStack</TableHead>
          <TableHead className="text-right">AmountCell</TableHead>
          <TableHead>StatusCell</TableHead>
          <TableHead>BadgeCell</TableHead>
          <TableHead className="text-right">ActionCell</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell><DataCell>MOL-9282</DataCell></TableCell>
          <TableCell><TextStack primary="Lulo Bank" secondary="48291@lulobank.co" /></TableCell>
          <TableCell className="text-right"><AmountCell>$1,875,000.00</AmountCell></TableCell>
          <TableCell><StatusCell variant="success">Completed</StatusCell></TableCell>
          <TableCell><BadgeCell><Badge variant="success">P2P</Badge></BadgeCell></TableCell>
          <TableCell className="text-right"><ActionCell><Button variant="ghost" size="icon-sm"><MoreHorizontal /></Button></ActionCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><DataCell>MOL-9270</DataCell></TableCell>
          <TableCell><TextStack primary="Nequi" secondary="71044@nequi.co" /></TableCell>
          <TableCell className="text-right"><AmountCell>$156,000.00</AmountCell></TableCell>
          <TableCell><StatusCell variant="warning">Pending</StatusCell></TableCell>
          <TableCell><BadgeCell><Badge variant="info">B2P</Badge></BadgeCell></TableCell>
          <TableCell className="text-right"><ActionCell><Button variant="ghost" size="icon-sm"><MoreHorizontal /></Button></ActionCell></TableCell>
        </TableRow>
        <TableRow>
          <TableCell><DataCell>MOL-9260</DataCell></TableCell>
          <TableCell><TextStack primary="Itaú Colombia" secondary="67234@itau.co" /></TableCell>
          <TableCell className="text-right"><AmountCell>$3,200,000.00</AmountCell></TableCell>
          <TableCell><StatusCell variant="error">Failed</StatusCell></TableCell>
          <TableCell><BadgeCell><Badge variant="secondary">P2M</Badge></BadgeCell></TableCell>
          <TableCell className="text-right"><ActionCell><Button variant="ghost" size="icon-sm"><MoreHorizontal /></Button></ActionCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

// ── Raw table parts — the structural primitives ──────────────────────────────
export function TablePartsDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>TableHead</TableHead>
          <TableHead>TableHead</TableHead>
          <TableHead className="text-right">TableHead</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>TableCell</TableCell>
          <TableCell>TableCell</TableCell>
          <TableCell className="text-right">TableCell</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>TableCell</TableCell>
          <TableCell>TableCell</TableCell>
          <TableCell className="text-right">TableCell</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
