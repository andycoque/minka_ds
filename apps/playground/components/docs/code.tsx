/**
 * Inline code for use INSIDE `not-prose` regions where the copy is written in
 * TSX rather than MDX — a demo's anatomy part, a hand-authored panel.
 *
 * When the copy comes from MDX, backticks already produce a `<code>` element and
 * the `.ds-panel-copy code` rule in docs.css styles it. This component exists
 * for the TSX case, where there are no backticks to convert, and it carries the
 * same class so both paths land on one rule rather than two definitions that can
 * drift.
 */
function Code({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={className ? `ds-panel-copy ${className}` : "ds-panel-copy"}>
      <code>{children}</code>
    </span>
  )
}

export { Code }
