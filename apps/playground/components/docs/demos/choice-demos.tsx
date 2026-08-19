"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "minka-ds"
import { Anatomy, Part } from "@/components/docs/anatomy"
import { Code } from "@/components/docs/code"
import { Playground, type Control } from "@/components/docs/playground"

/**
 * Select and Combobox, both taken from product code.
 *
 *   Select    settings language picker, alias type picker
 *   Combobox  users/[id] role picker — the multiple + chips composition
 */

const FIELD_STATES: Control[] = [
  {
    type: "select",
    name: "state",
    label: "State",
    options: [
      { value: "default", label: "Default" },
      { value: "disabled", label: "Disabled" },
    ],
    defaultValue: "default",
  },
]

const LANGUAGES = [
  { code: "es-CO", label: "Español (Colombia)" },
  { code: "en-US", label: "English (United States)" },
  { code: "pt-BR", label: "Português (Brasil)" },
]

function SelectDemo() {
  return (
    <Playground
      controls={FIELD_STATES}
      minHeight={150}
      details={() => (
        <Anatomy>
          <Part name="SelectTrigger">
            The closed control. Holds <Code>SelectValue</Code>.
          </Part>
          <Part name="SelectValue">
            The chosen label, or the <Code>placeholder</Code> when nothing is
            chosen yet.
          </Part>
          <Part name="SelectItem">
            One option. <Code>value</Code> is what you store, the children are
            what the reader sees.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => {
        const disabled = String(state.state) === "disabled"
        return (
          <div className="w-full max-w-xs space-y-1.5">
            <Label htmlFor="ds-select-demo">Language</Label>
            <Select disabled={disabled} defaultValue="es-CO">
              <SelectTrigger id="ds-select-demo" className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }}
    </Playground>
  )
}

const ROLES = [
  { id: "admin", label: "Administrator" },
  { id: "operator", label: "Operator" },
  { id: "auditor", label: "Auditor" },
  { id: "viewer", label: "Viewer" },
]

function ComboboxDemo() {
  const anchor = React.useRef<HTMLDivElement>(null)
  const [roles, setRoles] = React.useState<string[]>(["operator"])

  return (
    <Playground
      controls={[]}
      minHeight={170}
      details={() => (
        <Anatomy>
          <Part name="ComboboxChips">
            The field. Holds the chosen chips and the input, and is the anchor the
            list hangs off.
          </Part>
          <Part name="ComboboxChip">
            One chosen value. Removable.
          </Part>
          <Part name="ComboboxContent">
            The list. Takes an <Code>anchor</Code> ref, which is required here and
            not optional.
          </Part>
        </Anatomy>
      )}
    >
      {() => (
        <div className="w-full max-w-xs space-y-1.5">
          <Label>Roles</Label>
          <Combobox
            multiple
            value={roles}
            onValueChange={(v) => setRoles((v as string[]) ?? [])}
          >
            <ComboboxChips ref={anchor}>
              {roles.map((r) => (
                <ComboboxChip key={r}>
                  {ROLES.find((x) => x.id === r)?.label ?? r}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={roles.length ? "Add role" : "Select roles"}
              />
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxList>
                {ROLES.map((r) => (
                  <ComboboxItem key={r.id} value={r.id}>
                    {r.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      )}
    </Playground>
  )
}

export { SelectDemo, ComboboxDemo }
