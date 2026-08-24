"use client"

import * as React from "react"

/**
 * The three token layers, drawn rather than described.
 *
 * Built from the same semantic tokens it documents, so it cannot drift from the
 * system: if `--color-bg-raised` changes, this diagram changes with it. That is also
 * the argument the diagram is making, so building it any other way would undercut it.
 *
 * Deliberately not mermaid: adding a diagram renderer for one figure would be a
 * dependency the docs do not otherwise need, and a hand-built figure can use the
 * token layer directly.
 */

function Layer({
  index,
  name,
  count,
  summary,
  example,
  accent,
}: {
  index: string
  name: string
  count: string
  summary: string
  example: React.ReactNode
  accent: string
}) {
  return (
    <div
      className="flex flex-col gap-3 [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] p-4 sm:flex-row sm:items-center sm:gap-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* The accent stripe is the one place a primitive is named directly: it is
          decoration carrying no meaning, so there is no semantic token for it. */}
      <span
        aria-hidden
        className="hidden w-1 self-stretch shrink-0 rounded-full sm:block"
        style={{ backgroundColor: accent }}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-baseline gap-2">
          <span className="text-caption text-[var(--color-text-hint)]">{index}</span>
          <span className="text-body text-[var(--color-text-default)]">{name}</span>
          <span className="text-caption text-[var(--color-text-muted)]">{count}</span>
        </span>
        <span className="text-body-sm text-[var(--color-text-muted)]">{summary}</span>
      </div>
      <div className="shrink-0 [border-radius:var(--radius-input)] bg-[var(--color-bg-base)] px-3 py-2">
        {example}
      </div>
    </div>
  )
}

/** A downward arrow between layers, with the relationship written on it. */
function Flow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 pl-4 sm:pl-9">
      <span aria-hidden className="text-body-sm text-[var(--color-text-hint)]">
        ↓
      </span>
      <span className="text-caption text-[var(--color-text-muted)]">{label}</span>
    </div>
  )
}

function Mono({ children }: { children: React.ReactNode }) {
  // A token name IS code, so mono is right here where it is wrong in a data table.
  // `--font-mono` is a playground-level variable (Geist Mono, wired up in layout.tsx),
  // not a DS token. Set as a style attribute rather than a class because tailwind-merge
  // treats font-mono and text-caption as one conflict group and would drop one.
  return (
    <span
      className="text-caption text-[var(--color-text-default)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </span>
  )
}

function LayerDiagram() {
  return (
    <div className="flex flex-col gap-2">
      <Layer
        index="01"
        name="Primitives"
        count="215 values"
        accent="var(--primitive-neutral-300)"
        summary="Raw values with no opinion about use. Colour ramps, the type scale, radii, spacing, shadows, z-indices."
        example={<Mono>--primitive-neutral-0</Mono>}
      />
      <Flow label="referenced by" />
      <Layer
        index="02"
        name="Semantic tokens"
        count="234 tokens"
        accent="var(--color-action-primary-default)"
        summary="Each names a job rather than a value. This is the layer that themes: .dark redefines these and nothing else."
        example={<Mono>--color-bg-raised</Mono>}
      />
      <Flow label="consumed by" />
      <Layer
        index="03"
        name="Components"
        count="54 components"
        accent="var(--primitive-green-500)"
        summary="Reference semantic tokens only. A component that names a primitive directly cannot be themed."
        example={<Mono>bg-[var(--color-bg-raised)]</Mono>}
      />

      <p className="mt-1 text-caption text-[var(--color-text-muted)]">
        Each layer depends only on the one above it. Nothing skips a layer, which is
        what makes a theme change a one-file change.
      </p>
    </div>
  )
}

export { LayerDiagram }
