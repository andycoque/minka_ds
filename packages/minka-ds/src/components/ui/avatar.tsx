import * as React from "react"
import { cn } from "../../lib/utils"

const SIZE: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-7 text-caption-serif",
  md: "size-9 text-body-sm-serif",
  lg: "size-12 text-body-serif",
}

interface AvatarProps {
  /** Image URL. When absent, initials (or a fallback) are shown. */
  src?: string
  /** Full name — used for alt text and to derive initials. */
  name?: string
  /** Explicit initials override; otherwise derived from `name`. */
  initials?: string
  size?: "sm" | "md" | "lg"
  /** Background for the initials state. Defaults to a brand color. */
  background?: string
  className?: string
}

function deriveInitials(name?: string): string {
  if (!name) return "?"
  return name.trim().split(/\s+/).map(p => p[0]).join("").slice(0, 2).toUpperCase()
}

function Avatar({ src, name, initials, size = "md", background, className }: AvatarProps) {
  return (
    <div
      data-slot="avatar"
      className={cn(
        "shrink-0 rounded-full flex items-center justify-center overflow-hidden text-[var(--color-text-inverse)]",
        SIZE[size],
        className
      )}
      style={{ background: src ? undefined : (background ?? "var(--color-brand-blue)") }}
    >
      {src
        ? <img src={src} alt={name ?? ""} className="size-full object-cover" />
        : <span className="leading-none">{initials ?? deriveInitials(name)}</span>}
    </div>
  )
}

export { Avatar }
export type { AvatarProps }
