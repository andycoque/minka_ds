/**
 * Parses primitives.css + globals.css and outputs a structured token map
 * with all OKLCH/hex colors resolved to {r,g,b,a} (Figma-ready).
 */

import { readFileSync } from "fs"
import { formatRgb, parse } from "culori"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dir = dirname(fileURLToPath(import.meta.url))
const root  = join(__dir, "..")

// ── Read source files ────────────────────────────────────────────────────────

const primitivesCSS = readFileSync(join(root, "tokens/primitives.css"), "utf8")
const globalsCSS    = readFileSync(join(root, "../../apps/studio/app/globals.css"), "utf8")

// ── Parse CSS custom properties ──────────────────────────────────────────────

function parseCSSProps(css) {
  const map = {}
  const re = /--([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g
  let m
  while ((m = re.exec(css)) !== null) {
    map[`--${m[1]}`] = m[2].trim()
  }
  return map
}

const primitives = parseCSSProps(primitivesCSS)
const semantic   = parseCSSProps(globalsCSS)
const all        = { ...primitives, ...semantic }

// ── Resolve var() references ─────────────────────────────────────────────────

function resolve(value, depth = 0) {
  if (depth > 10) return value
  const varRef = /var\((--[a-zA-Z0-9_-]+)\)/.exec(value)
  if (!varRef) return value
  const ref = all[varRef[1]]
  if (!ref) return value
  return resolve(ref, depth + 1)
}

// ── Convert color string → Figma {r,g,b,a} ──────────────────────────────────

function toFigmaColor(raw) {
  const resolved = resolve(raw)
  if (!resolved) return null

  // Handle color-mix (skip — not supported in culori directly)
  if (resolved.includes("color-mix")) return null
  // Handle transparent
  if (resolved === "transparent") return { r: 0, g: 0, b: 0, a: 0 }

  try {
    const c = parse(resolved)
    if (!c) return null
    const rgb = formatRgb(c)
    // formatRgb returns "rgb(r, g, b)" or "rgba(r, g, b, a)"
    const nums = rgb.match(/[\d.]+/g)
    if (!nums) return null
    return {
      r: parseFloat(nums[0]) / 255,
      g: parseFloat(nums[1]) / 255,
      b: parseFloat(nums[2]) / 255,
      a: nums[3] !== undefined ? parseFloat(nums[3]) : 1,
    }
  } catch {
    return null
  }
}

// ── Convert rem / px / unitless → number ────────────────────────────────────

function toNumber(raw) {
  const resolved = resolve(raw)
  if (!resolved) return null
  const remMatch = resolved.match(/^([\d.]+)rem$/)
  if (remMatch) return Math.round(parseFloat(remMatch[1]) * 16 * 100) / 100
  const pxMatch = resolved.match(/^([\d.]+)px$/)
  if (pxMatch) return parseFloat(pxMatch[1])
  const numMatch = resolved.match(/^[\d.]+$/)
  if (numMatch) return parseFloat(numMatch[0])
  return null
}

// ── Build output ─────────────────────────────────────────────────────────────

const out = {
  primitiveColors:   {},
  primitiveRadius:   {},
  primitiveSpacing:  {},
  primitiveFontSize: {},
  primitiveFontWeight: {},
  primitiveLineHeight: {},
  primitiveLetterSpacing: {},
  primitiveFontFamily: {},
  semanticColors:    {},
  semanticRadius:    {},
  semanticShadows:   {},
  textStyles:        {},
}

// ── Primitive colors ─────────────────────────────────────────────────────────

const COLOR_SCALES = [
  "neutral","beige","red","bronze","yellow","lulo","green",
  "aquamarine","sea","slate","blue","purple","fuchsia","flamingo"
]

for (const [key, val] of Object.entries(primitives)) {
  const match = key.match(/^--primitive-(neutral|beige|red|bronze|yellow|lulo|green|aquamarine|sea|slate|blue|purple|fuchsia|flamingo)-(\d+)$/)
  if (!match) continue
  const [, scale, step] = match
  const color = toFigmaColor(val)
  if (color) out.primitiveColors[`${scale}/${step}`] = color
}

// ── Primitive radius ─────────────────────────────────────────────────────────

for (const [key, val] of Object.entries(primitives)) {
  const match = key.match(/^--primitive-radius-(.+)$/)
  if (!match) continue
  const name = match[1]
  if (name === "full") { out.primitiveRadius[name] = 9999; continue }
  const n = toNumber(val)
  if (n !== null) out.primitiveRadius[name] = n
}

// ── Primitive spacing ────────────────────────────────────────────────────────

for (const [key, val] of Object.entries(primitives)) {
  const match = key.match(/^--primitive-space-(.+)$/)
  if (!match) continue
  const n = toNumber(val)
  if (n !== null) out.primitiveSpacing[match[1]] = n
}

// ── Primitive typography ─────────────────────────────────────────────────────

for (const [key, val] of Object.entries(primitives)) {
  let m
  if ((m = key.match(/^--primitive-font-size-(.+)$/))) {
    const n = toNumber(val)
    if (n !== null) out.primitiveFontSize[m[1]] = n
  } else if ((m = key.match(/^--primitive-font-weight-(\d+)$/))) {
    out.primitiveFontWeight[m[1]] = parseInt(m[1])
  } else if ((m = key.match(/^--primitive-line-height-(.+)$/))) {
    const n = parseFloat(resolve(val))
    if (!isNaN(n)) out.primitiveLineHeight[m[1]] = n
  } else if ((m = key.match(/^--primitive-letter-spacing-(.+)$/))) {
    out.primitiveLetterSpacing[m[1]] = resolve(val)
  }
}

// Font families (hardcoded — not in CSS vars)
out.primitiveFontFamily = {
  sans:  "Inter",
  serif: "Instrument Serif",
  mono:  "SF Mono",
}

// ── Semantic colors ───────────────────────────────────────────────────────────

const SEMANTIC_COLOR_KEYS = Object.keys(semantic).filter(k =>
  k.startsWith("--color-bg-") ||
  k.startsWith("--color-text-") ||
  k.startsWith("--color-border-") ||
  k.startsWith("--color-action-") ||
  k.startsWith("--color-feedback-") ||
  k.startsWith("--color-brand-")
)

for (const key of SEMANTIC_COLOR_KEYS) {
  const name = key.replace(/^--color-/, "").replace(/-/g, "/")
  const color = toFigmaColor(semantic[key])
  if (color) out.semanticColors[name] = color
}

// ── Semantic radius ───────────────────────────────────────────────────────────

const SEMANTIC_RADIUS_KEYS = Object.keys(semantic).filter(k =>
  k.match(/^--radius-(button|input|card|modal|popover|tooltip|badge|tag|avatar)$/)
)

for (const key of SEMANTIC_RADIUS_KEYS) {
  const name = key.replace(/^--radius-/, "")
  const n = toNumber(semantic[key])
  if (n !== null) out.semanticRadius[name] = n
}

// ── Semantic shadows ──────────────────────────────────────────────────────────

for (const [key, val] of Object.entries(semantic)) {
  const m = key.match(/^--shadow-(.+)$/)
  if (!m) continue
  out.semanticShadows[m[1]] = resolve(val)
}

// ── Text styles ───────────────────────────────────────────────────────────────

const TEXT_STYLES_RAW = {
  display:        { size: "7xl", weight: 600, lineHeight: "tight",   letterSpacing: "tight"  },
  "heading-1":    { size: "4xl", weight: 600, lineHeight: "tight",   letterSpacing: "tight"  },
  "heading-2":    { size: "3xl", weight: 600, lineHeight: "snug",    letterSpacing: "tight"  },
  "heading-3":    { size: "2xl", weight: 600, lineHeight: "snug",    letterSpacing: "normal" },
  "heading-4":    { size: "xl",  weight: 600, lineHeight: "snug",    letterSpacing: "normal" },
  "paragraph-lg": { size: "lg",  weight: 500, lineHeight: "loose",   letterSpacing: "normal" },
  paragraph:      { size: "base",weight: 500, lineHeight: "relaxed", letterSpacing: "normal" },
  "paragraph-sm": { size: "sm",  weight: 500, lineHeight: "relaxed", letterSpacing: "normal" },
  "body-lg":      { size: "lg",  weight: 500, lineHeight: "normal",  letterSpacing: "normal" },
  body:           { size: "base",weight: 500, lineHeight: "normal",  letterSpacing: "normal" },
  "body-sm":      { size: "sm",  weight: 500, lineHeight: "normal",  letterSpacing: "normal" },
  label:          { size: "sm",  weight: 600, lineHeight: "none",    letterSpacing: "normal" },
  "label-sm":     { size: "xs",  weight: 600, lineHeight: "none",    letterSpacing: "normal" },
  caption:        { size: "xs",  weight: 500, lineHeight: "normal",  letterSpacing: "normal" },
  overline:       { size: "2xs", weight: 600, lineHeight: "none",    letterSpacing: "wide"   },
}

for (const [name, def] of Object.entries(TEXT_STYLES_RAW)) {
  out.textStyles[name] = {
    fontSize:      out.primitiveFontSize[def.size],
    fontWeight:    def.weight,
    lineHeight:    out.primitiveLineHeight[def.lineHeight],
    letterSpacing: out.primitiveLetterSpacing[def.letterSpacing],
    fontFamily:    "Inter",
  }
}

console.log(JSON.stringify(out, null, 2))
