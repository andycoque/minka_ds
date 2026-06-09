// Brand textures — decorative SVG motifs that take their colors from a brand
// pair. Shapes use var(--texture-ink); the secondary/light tone uses
// var(--texture-bg). Apply a pair via <BrandTexture> or by setting those two
// CSS vars on a wrapper. The logo is a fixed mark, not pair-driven.

export { FullFrameTexture } from "./full-frame"
export { FullHeightMTexture } from "./full-height-m"
export { FullHeightSTexture } from "./full-height-s"
export { FullWidthLTexture } from "./full-width-l"
export { FullWidthMTexture } from "./full-width-m"
export { FullWidthSTexture } from "./full-width-s"
export { FullWidthXlTexture } from "./full-width-xl"
export { PatternMTexture } from "./pattern-m"
export { PatternSTexture } from "./pattern-s"
export { LogoPrimary } from "./logo-primary"
export { LogoIcon } from "./logo-icon"

import type * as React from "react"
import { FullFrameTexture } from "./full-frame"
import { FullHeightMTexture } from "./full-height-m"
import { FullHeightSTexture } from "./full-height-s"
import { FullWidthLTexture } from "./full-width-l"
import { FullWidthMTexture } from "./full-width-m"
import { FullWidthSTexture } from "./full-width-s"
import { FullWidthXlTexture } from "./full-width-xl"
import { PatternMTexture } from "./pattern-m"
import { PatternSTexture } from "./pattern-s"

import { LogoPrimary } from "./logo-primary"

/** All pair-driven motifs, keyed by name (includes the logo). */
export const TEXTURES: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  "full-frame":    FullFrameTexture,
  "full-height-m": FullHeightMTexture,
  "full-height-s": FullHeightSTexture,
  "full-width-l":  FullWidthLTexture,
  "full-width-m":  FullWidthMTexture,
  "full-width-s":  FullWidthSTexture,
  "full-width-xl": FullWidthXlTexture,
  "pattern-m":     PatternMTexture,
  "pattern-s":     PatternSTexture,
  "logo-primary":  LogoPrimary,
}

export type TextureName = keyof typeof TEXTURES

export { BrandTexture } from "./brand-texture"
export type { BrandTextureProps, BrandPair } from "./brand-texture"
