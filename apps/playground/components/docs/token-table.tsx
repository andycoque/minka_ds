"use client"

import * as React from "react"

/**
 * Token reference tables.
 *
 * Every swatch resolves its own CSS variable at paint time rather than hardcoding a
 * value, so these tables cannot go stale: change a token and the page follows. The
 * resolved value is read back from the DOM and shown beside the name, which is also
 * how a reader spots a token that resolves to nothing.
 */

function useResolved(names: string[]) {
  // `null` until measured. getComputedStyle only exists on the client, so the server
  // render has no values and must not claim the tokens are missing.
  const [values, setValues] = React.useState<Record<string, string> | null>(null)

  React.useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    const next: Record<string, string> = {}
    for (const n of names) next[n] = style.getPropertyValue(n).trim()
    setValues(next)
    // Names are static per call site; joining keeps the dependency a primitive.
  }, [names.join(",")])

  return values
}

function TokenName({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-caption text-[var(--color-text-default)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </span>
  )
}

function Resolved({ value }: { value: string | undefined }) {
  // undefined = not measured yet (server render, or before the effect runs). Render a
  // blank line of the same height so the row does not jump when the value arrives.
  if (value === undefined) return <span className="text-caption">&nbsp;</span>

  if (!value) {
    // Measured and empty: the token is referenced but not defined in whichever layer
    // this app imports. This page is the best place to catch that.
    return (
      <span className="text-caption text-[var(--color-text-error)]">not defined</span>
    )
  }
  return (
    <span
      className="truncate text-caption text-[var(--color-text-muted)]"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {value}
    </span>
  )
}

/** Colour tokens, with a swatch. */
function ColorTokens({
  tokens,
}: {
  tokens: { name: string; use: string }[]
}) {
  const resolved = useResolved(tokens.map(t => t.name))

  return (
    <div className="not-prose flex flex-col overflow-hidden [border-radius:var(--radius-card)] border border-[var(--color-border-default)]">
      {tokens.map(t => (
        <div
          key={t.name}
          className="grid grid-cols-[2rem_1fr] items-center gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-raised)] p-3 last:border-0 sm:grid-cols-[2rem_18rem_1fr]"
        >
          <span
            aria-hidden
            className="size-8 shrink-0 [border-radius:var(--radius-input)] border border-[var(--color-border-default)]"
            style={{ backgroundColor: `var(${t.name})` }}
          />
          <span className="flex min-w-0 flex-col gap-0.5">
            <TokenName>{t.name}</TokenName>
            <Resolved value={resolved?.[t.name]} />
          </span>
          <span className="hidden text-caption text-[var(--color-text-muted)] sm:block">
            {t.use}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Non-colour tokens: radii, shadows, z-indices, spacing. Each renders a specimen the
 * token actually drives, so the value is visible rather than only stated.
 */
function ScaleTokens({
  tokens,
  specimen,
}: {
  tokens: { name: string; use: string }[]
  specimen: "radius" | "shadow" | "value"
}) {
  const resolved = useResolved(tokens.map(t => t.name))

  return (
    <div className="not-prose flex flex-col overflow-hidden [border-radius:var(--radius-card)] border border-[var(--color-border-default)]">
      {tokens.map(t => (
        <div
          key={t.name}
          className="grid grid-cols-[3rem_1fr] items-center gap-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-raised)] p-3 last:border-0 sm:grid-cols-[3rem_18rem_1fr]"
        >
          <span aria-hidden className="flex h-8 items-center">
            {specimen === "radius" && (
              <span
                className="size-8 border border-[var(--color-border-strong)] bg-[var(--color-bg-raised)]"
                style={{ borderRadius: `var(${t.name})` }}
              />
            )}
            {specimen === "shadow" && (
              <span
                className="size-8 [border-radius:var(--radius-input)] bg-[var(--color-bg-raised)]"
                style={{ boxShadow: `var(${t.name})` }}
              />
            )}
            {specimen === "value" && (
              <span
                className="text-caption text-[var(--color-text-default)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {resolved?.[t.name] || "\u00a0"}
              </span>
            )}
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <TokenName>{t.name}</TokenName>
            {specimen !== "value" && <Resolved value={resolved?.[t.name]} />}
          </span>
          <span className="hidden text-caption text-[var(--color-text-muted)] sm:block">
            {t.use}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * A colour ramp, as one row of steps. For the primitive layer, where the point is the
 * shape of the scale rather than any individual value.
 */
function Ramp({ family, steps }: { family: string; steps: number[] }) {
  return (
    <div className="not-prose flex flex-col gap-1.5">
      <TokenName>--primitive-{family}-*</TokenName>
      <div className="flex overflow-hidden [border-radius:var(--radius-input)] border border-[var(--color-border-default)]">
        {steps.map(step => (
          <span
            key={step}
            title={`--primitive-${family}-${step}`}
            className="flex h-10 flex-1 items-end justify-center pb-1"
            style={{ backgroundColor: `var(--primitive-${family}-${step})` }}
          >
            {/* The step number sits on the swatch, mixed against its own background so
                it stays legible at both ends of the ramp. */}
            <span
              className="text-[0.5rem]"
              style={{ color: step >= 500 ? "var(--primitive-neutral-0)" : "var(--primitive-neutral-900)" }}
            >
              {step}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export { ColorTokens, ScaleTokens, Ramp }
