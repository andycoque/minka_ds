"use client"

import { MoreHorizontal } from "lucide-react"
import {
  ActionCell,
  AmountCell,
  Badge,
  BadgeCell,
  Button,
  DataCell,
  StatusCell,
} from "minka-ds"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Cell primitives in one panel, one chip per primitive.
 *
 * A panel rather than five specimen grids. Interaction is barely relevant for
 * presentational components, but the panel is the shape the reader has learned
 * means "this is the component" — so using it here keeps one mental model across
 * the whole site rather than two.
 *
 * Each chip shows the primitive across the values it actually has to handle,
 * which is what a cell primitive is judged on: the same column with a long value,
 * a short one and an empty one.
 */

const CONTROLS: Control[] = [
  {
    type: "select",
    name: "cell",
    label: "Primitive",
    options: [
      { value: "data", label: "DataCell" },
      { value: "amount", label: "AmountCell" },
      { value: "status", label: "StatusCell" },
      { value: "badge", label: "BadgeCell" },
      { value: "action", label: "ActionCell" },
    ],
    defaultValue: "data",
  },
]

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-20 shrink-0 text-[0.75rem] text-[var(--color-text-muted)]">
        {label}
      </span>
      {children}
    </div>
  )
}

function CellsAnatomyDemo() {
  return (
    <Playground controls={CONTROLS} minHeight={180}>
      {(state) => {
        const cell = String(state.cell)

        if (cell === "amount") {
          return (
            <div className="flex flex-col gap-3">
              <Row label="Currency"><AmountCell>$1,250,000.00</AmountCell></Row>
              <Row label="Plain"><AmountCell>1,250,000</AmountCell></Row>
              <Row label="Zero"><AmountCell>$0.00</AmountCell></Row>
            </div>
          )
        }

        if (cell === "status") {
          return (
            <div className="flex flex-col gap-3">
              <Row label="Success"><StatusCell variant="success">Active</StatusCell></Row>
              <Row label="Warning"><StatusCell variant="warning">Pending approval</StatusCell></Row>
              <Row label="Error"><StatusCell variant="error">Failed</StatusCell></Row>
              <Row label="Neutral"><StatusCell variant="neutral">Suspended</StatusCell></Row>
              {/* No `size="lg"` specimen. That size exists for a detail-page
                  identity header, which `DetailHeader` renders itself, so showing it
                  here would advertise a choice a consumer should not be making. */}
            </div>
          )
        }

        if (cell === "badge") {
          return (
            <div className="flex flex-col gap-3">
              <Row label="One">
                <BadgeCell><Badge variant="outline">CSV</Badge></BadgeCell>
              </Row>
              <Row label="Several">
                <BadgeCell>
                  <Badge variant="outline">CSV</Badge>
                  <Badge variant="outline">Range</Badge>
                </BadgeCell>
              </Row>
            </div>
          )
        }

        if (cell === "action") {
          // One shape, because the product only has one: every ActionCell in studio is
          // a ghost `icon-sm` kebab with `w-full justify-end`. An earlier version of
          // this panel also showed a labelled button, which exists nowhere.
          //
          // `w-full justify-end` because an action column is right-aligned against the
          // edge of the table rather than left against its header.
          return (
            <div className="flex w-full max-w-xs flex-col gap-3">
              <Row label="Row actions">
                <ActionCell className="w-full justify-end">
                  <Button variant="ghost" size="icon-sm" aria-label="Actions">
                    <MoreHorizontal />
                  </Button>
                </ActionCell>
              </Row>
            </div>
          )
        }

        return (
          <div className="flex flex-col gap-3">
            <Row label="Identifier"><DataCell>MOL-9291-596C-85DB</DataCell></Row>
            <Row label="Timestamp"><DataCell>12 Aug 2026, 14:30</DataCell></Row>
            <Row label="Name"><DataCell>Banco Davivienda</DataCell></Row>
            <Row label="Empty">
              <DataCell>
                <span className="text-[var(--color-text-hint)]">—</span>
              </DataCell>
            </Row>
          </div>
        )
      }}
    </Playground>
  )
}

export { CellsAnatomyDemo }
