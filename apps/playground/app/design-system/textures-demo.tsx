"use client"

import { useState } from "react"
import { BrandTexture, TEXTURES, type BrandPair } from "minka-ds"

const PAIRS: BrandPair[] = [
  "yellow-darkforest",
  "rose-coral",
  "blue-navy",
  "beige-bronze",
  "gray-black",
]

const NAMES = Object.keys(TEXTURES) as (keyof typeof TEXTURES)[]

export function TexturesDemo() {
  const [pair, setPair] = useState<BrandPair>("rose-coral")
  const [reverse, setReverse] = useState(false)

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {PAIRS.map((p) => (
          <button
            key={p}
            onClick={() => setPair(p)}
            className={`text-caption px-2.5 py-1 rounded-[var(--radius-button)] border transition-colors ${
              pair === p
                ? "border-[var(--color-border-inverse)] bg-[var(--color-bg-inverted)] text-[var(--color-text-inverse)]"
                : "border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setReverse((r) => !r)}
          className={`text-caption px-2.5 py-1 rounded-[var(--radius-button)] border transition-colors ml-auto ${
            reverse
              ? "border-[var(--color-border-inverse)] bg-[var(--color-bg-inverted)] text-[var(--color-text-inverse)]"
              : "border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
          }`}
        >
          {reverse ? "reversed" : "reverse"}
        </button>
      </div>

      {/* Texture grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {NAMES.map((name) => (
          <div key={name} className="flex flex-col gap-1.5">
            <BrandTexture
              name={name}
              pair={pair}
              reverse={reverse}
              fit={name === "logo-primary" ? "contain" : "cover"}
              className={`h-36 w-full rounded-md border border-[var(--color-border-default)] ${
                name === "logo-primary" ? "p-6" : ""
              }`}
            />
            <code className="text-caption-sm text-[var(--color-text-muted)]">{name}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
