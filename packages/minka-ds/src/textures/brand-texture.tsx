import * as React from "react"
import { cn } from "../lib/utils"
import { TEXTURES, type TextureName } from "./index"

/** The five sanctioned brand pairs. */
export type BrandPair =
  | "yellow-darkforest"
  | "rose-coral"
  | "blue-navy"
  | "beige-bronze"
  | "gray-black"

export interface BrandTextureProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Which texture motif to render. */
  name: TextureName
  /** Which brand pair colors it. */
  pair: BrandPair
  /**
   * Swap which member is ink vs background. By default the pair's dark member
   * is the ink (shapes) and the light member is the background.
   */
  reverse?: boolean
  /**
   * How the motif fills the box. `cover` (default) crops to fill — right for
   * edge-to-edge patterns; `contain` fits the whole motif without cropping —
   * right for the logo or any motif that must stay intact.
   */
  fit?: "cover" | "contain"
}

/**
 * Renders a brand texture colored by a sanctioned pair. Sets --texture-ink and
 * --texture-bg on a wrapper; the inlined SVG reads them. The wrapper clips the
 * texture, so size it via className (e.g. `h-40 w-full`).
 */
function BrandTexture({ name, pair, reverse, fit = "cover", className, style, ...props }: BrandTextureProps) {
  const Texture = TEXTURES[name]
  const light = `var(--color-pair-${pair}-light)`
  const dark  = `var(--color-pair-${pair}-dark)`

  const vars = {
    "--texture-ink": reverse ? light : dark,
    "--texture-bg":  reverse ? dark : light,
    backgroundColor: "var(--texture-bg)",
  } as React.CSSProperties

  const par = fit === "contain" ? "xMidYMid meet" : "xMidYMid slice"

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ ...vars, ...style }}
      {...props}
    >
      <Texture className="absolute inset-0 size-full" preserveAspectRatio={par} />
    </div>
  )
}

export { BrandTexture }
