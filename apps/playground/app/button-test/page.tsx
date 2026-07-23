import { Button } from "@/components/ui/button"

const VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const
const SIZES = ["sm", "default", "lg"] as const

function Row({ onDark }: { onDark?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      {SIZES.map(size => (
        <div key={size} className="flex flex-wrap items-center gap-3">
          <span className="w-16 shrink-0 text-caption text-[var(--color-text-muted)]">{size}</span>
          {VARIANTS.map(variant => (
            <Button key={variant} variant={variant} size={size} onDark={onDark}>
              {variant[0].toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function ButtonTest() {
  return (
    <div className="flex flex-col gap-10 p-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-heading-2-serif text-[var(--color-text-default)]">Button — light &amp; dark</h1>
        <p className="text-body-sm text-[var(--color-text-muted)]">
          Every variant and size, on a light surface and on a dark surface via the <code>onDark</code> prop.
        </p>
      </div>

      {/* Light surface */}
      <section className="flex flex-col gap-4">
        <span className="text-overline text-[var(--color-text-muted)]">Light surface</span>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-raised)] p-6">
          <Row />
        </div>
      </section>

      {/* Dark surface — onDark */}
      <section className="flex flex-col gap-4">
        <span className="text-overline text-[var(--color-text-muted)]">Dark surface (onDark)</span>
        <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-inverted)] p-6">
          <Row onDark />
        </div>
      </section>

      {/* The wrong way — same variants on dark WITHOUT onDark, for comparison */}
      <section className="flex flex-col gap-4">
        <span className="text-overline text-[var(--color-text-muted)]">Dark surface without onDark (incorrect)</span>
        <div className="rounded-[var(--radius-card)] bg-[var(--color-bg-inverted)] p-6">
          <Row />
        </div>
      </section>
    </div>
  )
}
