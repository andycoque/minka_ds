"use client"

import * as React from "react"
import { Button, Input, Label, Switch, Wizard, type WizardStep } from "minka-ds"

/**
 * Live Wizard specimens for the docs.
 *
 * Three separate demos rather than one configurable playground, because the
 * behaviours worth showing are mutually exclusive: a short step that never
 * overflows, a long step that does, and the discard guard on a dirty form.
 */

function DemoField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}) {
  const id = React.useId()
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint ? (
        <p className="text-caption text-[var(--color-text-muted)]">{hint}</p>
      ) : null}
    </div>
  )
}

/** Two short steps. Neither overflows, so the footer is pinned from the start. */
function WizardBasicDemo() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [name, setName] = React.useState("")
  const [code, setCode] = React.useState("")

  function reset() {
    setStep(0)
    setName("")
    setCode("")
  }

  const steps: WizardStep[] = [
    {
      title: "Essentials",
      eyebrow: "Step 1",
      valid: name.trim().length > 0,
      content: (
        <div className="space-y-4">
          <DemoField
            label="Participant name"
            value={name}
            onChange={setName}
            hint="Required. Next stays dimmed until this has a value."
          />
        </div>
      ),
    },
    {
      title: "Identification",
      eyebrow: "Step 2",
      valid: code.trim().length > 0,
      content: (
        <div className="space-y-4">
          <DemoField label="Bank code" value={code} onChange={setCode} />
        </div>
      ),
    },
  ]

  return (
    <>
      <Button variant="outline" onClick={() => { reset(); setOpen(true) }}>
        Open wizard
      </Button>
      <Wizard
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        step={step}
        onStepChange={setStep}
        dirty={name.length > 0 || code.length > 0}
        onFinish={() => setOpen(false)}
        finishLabel="Create"
      />
    </>
  )
}

/**
 * A step taller than the dialog. The footer starts inline at the end of the
 * scroll region and pins once the reader has reached the bottom.
 */
function WizardOverflowDemo() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [values, setValues] = React.useState<Record<string, string>>({})

  const fields = [
    "Legal name",
    "Trading name",
    "Tax identifier",
    "Registered address",
    "City",
    "Postal code",
    "Contact email",
    "Contact phone",
    "Settlement account",
  ]

  const steps: WizardStep[] = [
    {
      title: "Registration details",
      eyebrow: "Step 1",
      content: (
        <div className="space-y-4">
          {fields.map((f) => (
            <DemoField
              key={f}
              label={f}
              value={values[f] ?? ""}
              onChange={(v) => setValues((p) => ({ ...p, [f]: v }))}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Review",
      eyebrow: "Step 2",
      content: (
        <p className="text-body-sm text-[var(--color-text-muted)]">
          A review step with no validity of its own. This is the case
          `finishDisabled` exists for.
        </p>
      ),
    },
  ]

  return (
    <>
      <Button variant="outline" onClick={() => { setStep(0); setOpen(true) }}>
        Open long form
      </Button>
      <Wizard
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        step={step}
        onStepChange={setStep}
        onFinish={() => setOpen(false)}
        finishLabel="Create"
      />
    </>
  )
}

/** A dirty form. Closing blurs the box and floats the discard confirmation. */
function WizardDiscardDemo() {
  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState(0)
  const [enabled, setEnabled] = React.useState(true)

  const steps: WizardStep[] = [
    {
      title: "Settings",
      eyebrow: "Step 1",
      content: (
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <Label>Single use</Label>
            <p className="text-caption text-[var(--color-text-muted)]">
              The form is always dirty here, so try closing with Esc.
            </p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
      ),
    },
  ]

  return (
    <>
      <Button variant="outline" onClick={() => { setStep(0); setOpen(true) }}>
        Open dirty form
      </Button>
      <Wizard
        open={open}
        onOpenChange={setOpen}
        steps={steps}
        step={step}
        onStepChange={setStep}
        dirty
        onFinish={() => setOpen(false)}
        finishLabel="Save"
      />
    </>
  )
}

export { WizardBasicDemo, WizardOverflowDemo, WizardDiscardDemo }
