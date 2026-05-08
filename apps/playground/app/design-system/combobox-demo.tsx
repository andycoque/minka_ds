"use client"

import * as React from "react"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  useComboboxAnchor,
} from "@/components/ui/combobox"

const fruits = [
  "Apple", "Banana", "Cherry", "Grape", "Kiwi",
  "Mango", "Orange", "Peach", "Pear", "Pineapple",
  "Strawberry", "Watermelon",
]

export function ComboboxDemo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">Single select</p>
        <Combobox items={fruits}>
          <ComboboxInput placeholder="Search fruit…" className="w-64" />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxCollection>
                {(fruit: string) => (
                  <ComboboxItem key={fruit} value={fruit}>
                    {fruit}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              <ComboboxEmpty>No fruit found.</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">With clear button</p>
        <Combobox items={fruits}>
          <ComboboxInput placeholder="Search fruit…" className="w-64" showClear />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxCollection>
                {(fruit: string) => (
                  <ComboboxItem key={fruit} value={fruit}>
                    {fruit}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
              <ComboboxEmpty>No fruit found.</ComboboxEmpty>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-2">
        <p className="text-caption text-[var(--color-text-muted)]">Multi-select with chips</p>
        <MultiSelectDemo />
      </div>
    </div>
  )
}

function MultiSelectDemo() {
  const anchor = useComboboxAnchor()
  const [value, setValue] = React.useState<string[]>([])

  return (
    <Combobox multiple items={fruits} value={value} onValueChange={setValue}>
      <ComboboxChips ref={anchor} className="w-80">
        {value.map((v) => (
          <ComboboxChip key={v}>{v}</ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder="Add fruit…" />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxList>
          <ComboboxCollection>
            {(fruit: string) => (
              <ComboboxItem key={fruit} value={fruit}>
                {fruit}
              </ComboboxItem>
            )}
          </ComboboxCollection>
          <ComboboxEmpty>No fruit found.</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
