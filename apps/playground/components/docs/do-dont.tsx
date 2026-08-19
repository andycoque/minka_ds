import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Do / Don't — where the hard rules live.
 *
 * These rules previously existed only in review comments and annotations, which
 * meant they were re-litigated every time someone new built a screen. Writing
 * them next to the component is the point of this section: no mono on
 * identifiers, no stacked content in a table cell, StatusCell rather than a
 * hand-rolled badge.
 *
 * ONE panel with the two headers stated once at the top, then a row per pair.
 * The earlier version repeated a "Do" and a "Don't" heading on every card, so a
 * page with four rules said those words eight times and the reader had to
 * re-establish which column was which at every card. Stating them once turns the
 * repetition into a column, which is what it always was.
 *
 * Always pair a Do with the Don't it replaces. A Don't on its own tells the
 * reader they are wrong without telling them where to go.
 */
function DoDont({ children }: { children: React.ReactNode }) {
  return (
    // Space does the separating, so the gaps have to encode the grouping the
    // dividers used to: the header sits further from the rules than the rules sit
    // from each other, or it reads as just another row.
    <div className="not-prose flex flex-col gap-6 border border-[var(--color-border-default)] [border-radius:var(--radius-card)] bg-[var(--color-bg-raised)] px-5 py-6">
      <div className="grid grid-cols-1 gap-y-2 gap-x-8 sm:grid-cols-2">
        <ColumnHeader kind="do" />
        <ColumnHeader kind="dont" />
      </div>
      {/* Rules in their own stack, spaced wider than a rule's internal gap so the
          set reads as a list rather than as one long grid. */}
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  )
}

/**
 * No icon here. The check and the x live on the statements, where they are load
 * bearing: once the grid collapses to one column the headers are no longer above
 * their column, and the statement icon is the only thing attributing a statement
 * to a side. Repeating it in the header made the same mark mean two things.
 */
function ColumnHeader({ kind }: { kind: "do" | "dont" }) {
  const isDo = kind === "do"
  return (
    <span
      className={cn(
        // Serif, matching the section headings. These are the panel's own
        // headings, so they take the display face rather than the UI face.
        "text-heading-4-serif",
        isDo
          ? "text-[var(--color-feedback-success)]"
          : "text-[var(--color-feedback-error)]",
      )}
    >
      {isDo ? "Do" : "Don't"}
    </span>
  )
}

function StatementIcon({ kind }: { kind: "do" | "dont" }) {
  const isDo = kind === "do"
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full",
        isDo
          ? "bg-[var(--color-bg-success)] text-[var(--color-feedback-success)]"
          : "bg-[var(--color-bg-error)] text-[var(--color-feedback-error)]",
      )}
    >
      {isDo ? <Check className="size-3" /> : <X className="size-3" />}
    </span>
  )
}

/**
 * One rule: the Do and the Don't side by side, so the pairing is a row rather
 * than two cards the reader has to associate.
 */
function Rule({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
      {children}
    </div>
  )
}

function Statement({
  kind,
  children,
  example,
}: {
  kind: "do" | "dont"
  children: React.ReactNode
  example?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* No panel around the example. The specimen is a real component with its
          own edges, so a tinted box behind it was framing a frame. min-h keeps
          the two halves of a rule aligned when one example is taller. */}
      {example ? (
        <div className="flex min-h-12 items-center justify-start">{example}</div>
      ) : null}
      {/* The icon repeats per statement so a rule still reads correctly once the
          grid collapses to one column on narrow screens and the headers are no
          longer directly above their column. */}
      {/* The icon centres on the FIRST LINE of the statement, not on the block.
          `items-start` alone left it flush with the top of the text box, which
          reads as slightly high; the small top margin drops it onto the first
          line's optical centre and keeps it there when the copy wraps. */}
      <div className="flex items-start gap-2.5">
        <span className="mt-[0.15rem] shrink-0">
          <StatementIcon kind={kind} />
        </span>
        {/* Same 14px / weight 500 as every other table on the site. */}
        {/* `ds-panel-copy` so backticked code written in MDX gets the chip
            treatment; the prose rules are guarded off this panel. */}
        <p className="ds-panel-copy min-w-0 text-[0.875rem] font-medium leading-[1.5] text-[var(--color-text-muted)]">
          {children}
        </p>
      </div>
    </div>
  )
}

function Do(props: Omit<React.ComponentProps<typeof Statement>, "kind">) {
  return <Statement kind="do" {...props} />
}

function Dont(props: Omit<React.ComponentProps<typeof Statement>, "kind">) {
  return <Statement kind="dont" {...props} />
}

export { DoDont, Rule, Do, Dont }
