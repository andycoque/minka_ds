"use client"

import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg":     "var(--primitive-neutral-950)",
          "--normal-text":   "var(--primitive-neutral-50)",
          "--normal-border": "var(--primitive-neutral-900)",

          "--success-bg":     "var(--primitive-neutral-950)",
          "--success-text":   "var(--primitive-green-400)",
          "--success-border": "var(--primitive-neutral-900)",

          "--error-bg":     "var(--primitive-neutral-950)",
          "--error-text":   "var(--primitive-red-400)",
          "--error-border": "var(--primitive-neutral-900)",

          "--warning-bg":     "var(--primitive-neutral-950)",
          "--warning-text":   "var(--primitive-yellow-300)",
          "--warning-border": "var(--primitive-neutral-900)",

          "--info-bg":     "var(--primitive-neutral-950)",
          "--info-text":   "var(--primitive-blue-400)",
          "--info-border": "var(--primitive-neutral-900)",

          "--border-radius": "var(--radius-card)",
          "--font":          "inherit",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:       "!items-start",
          icon:        "mt-0.5",
          title:       "text-label !text-[var(--primitive-neutral-50)]",
          description: "text-body-sm !text-[var(--primitive-neutral-300)]",
          success:     "[&_[data-icon]]:text-[var(--primitive-green-400)]",
          error:       "[&_[data-icon]]:text-[var(--primitive-red-400)]",
          warning:     "[&_[data-icon]]:text-[var(--primitive-yellow-300)]",
          info:        "[&_[data-icon]]:text-[var(--primitive-neutral-50)]",
        },
        actionButtonStyle: {
          height:       "2rem",
          padding:      "0 0.75rem",
          borderRadius: "var(--radius-button)",
          border:       "1px solid var(--primitive-neutral-700)",
          background:   "var(--primitive-neutral-800)",
          color:        "var(--primitive-neutral-50)",
          fontSize:     "0.875rem",
          fontWeight:   "600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
