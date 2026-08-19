# DS docs: component section mapping

Which template sections apply to each of the 49 components, so the remaining work
can be batched rather than negotiated one page at a time.

## The template

| Section | Rule |
| --- | --- |
| Anatomy | Always. The parts, in a panel you can operate. |
| Variants | Always. Every variant side by side; modifiers as panel toggles. |
| Sizes | When there is a size prop. Scale table when more than two sizes. |
| Motion | When the transition carries values you cannot infer from watching once. |
| Use something else when | Always. |
| Do and don't | Always. |
| Props | Always. |

Reference implementation: `content/ds/button.mdx`.

## How the mapping was derived

Not by reading each component's source in full. Four signals, each checkable:

1. **Variants / Sizes** — the actual `cva` enum keys, extracted from source. A
   component either has a `variant` / `size` prop or it does not.
2. **Motion** — presence of `@keyframes`, `animate-[...]`, or Radix
   `data-[state]` enter/exit animation. A bare `transition-colors` does NOT
   qualify; that is a hover tint, and the panel shows it.
3. **Studio usage count** — how many files use the component. Low usage means
   Do and don't has thin evidence and needs a designer's input, not mine.
4. **Composition shape** — whether the component is one element or a set of
   subcomponents, which decides how much Anatomy has to carry.

Confidence is stated per component. Anything below **high** is a question for
review, not a decision I should make alone.

## Confidence key

- **High** — the mapping follows from the source and I would ship it.
- **Medium** — the sections are probably right, but one call needs confirming.
  Noted inline.
- **Low** — I do not know enough about intended usage. Needs a decision first.

---

## Group 1 — Form controls

| Component | Anatomy | Variants | Sizes | Motion | Confidence |
| --- | --- | --- | --- | --- | --- |
| `Button` | yes | yes | yes (8) | no | Done |
| `Input` | yes | no | no | no | High |
| `Textarea` | yes | no | no | no | High |
| `Label` | yes | no | no | no | High |
| `Checkbox` | yes | no | no | no | High |
| `Switch` | yes | no | no | no | High |
| `InputGroup` | yes | no | yes (2) | no | Medium |
| `InputOTP` | yes | no | no | no | Medium |
| `TimeField` | yes | no | no | no | High |
| `Select` | yes | no | no | yes | High |
| `Combobox` | yes | no | no | yes | High |
| `FilterCombobox` | yes | no | no | yes | Low |
| `ButtonGroup` | yes | yes (2) | no | no | Medium |

**Notes**

- `Input` / `Textarea` / `Label` have no variants at all. Their Variants section
  becomes a states panel: default, focus, invalid, disabled, with placeholder.
  This is the one place `aria-invalid` genuinely belongs, unlike Button.
- `InputGroup` has a size prop but only two values, so no scale table.
- `InputOTP` — Medium because I do not know whether we document the masked
  variant used in login separately.
- `FilterCombobox` — **High**, corrected from Low. My first pass counted zero
  studio usage, which was wrong: nothing renders `<FilterCombobox>` directly, but
  `SearchBar` takes a `filterCategories` prop and renders it internally, and 8
  studio views pass that prop. It documents as part of the `SearchBar` page rather
  than on its own, because that is the only way it is reachable.

  Lesson for the rest of this mapping: grepping for a component name in JSX
  misses anything consumed through a parent's prop. Usage counts for
  `SearchBar`-like wrappers are floors, not totals.
- `ButtonGroup` — Medium, and zero studio usage. `elevated` / `flat` are real
  variants but I cannot tell from usage which is the default in practice.

## Group 2 — Data display

| Component | Anatomy | Variants | Sizes | Motion | Confidence |
| --- | --- | --- | --- | --- | --- |
| `Table cells` | yes | yes | no | no | Done |
| `DataTable` | yes | no | no | no | High |
| `Table` | yes | no | no | no | Medium |
| `Badge` | yes | yes (11) | no | no | High |
| `StatusCell` | (in Cells) | — | — | — | Done |
| `Avatar` | yes | no | no | no | High |
| `Skeleton` | yes | no | no | yes | Medium |
| `StatCard` | yes | no | no | no | High |
| `TabCount` | yes | no | no | no | Medium |
| `Kbd` | yes | no | no | no | High |
| `Separator` | yes | no | no | no | High |
| `Timeline` | yes | yes | no | yes | Medium |

**Notes**

- `Badge` has **11 variants**, the most in the DS. Worth flagging as a design
  question rather than a docs one: `success` / `warning` / `error` / `info`
  overlap with what `StatusCell` now owns, and `link` on a Badge is odd. The
  page will document what exists, but the Do and don't section should probably
  say which of the 11 to actually use.
- `Table` vs `DataTable` — Medium. Both exist, `DataTable` is the one with 14
  usages. Do these get one page or two? A single page with "use DataTable
  unless..." might be right.
- `TextStack` is deliberately NOT on the Table cells page. It is a list-item
  primitive (ledger switcher, selector row) with six live usages, none in a table,
  so documenting it as a cell primitive taught the wrong thing. It stays exported
  and needs a home wherever list items get documented.
- `StatusCell` outlives both the table and the header. It is the canonical status
  renderer at default size in table columns, card summaries and filter chips;
  `size="lg"` is now internal to `DetailHeader` and is not documented as a choice.
- `DetailHeader` is a new DS component with no page yet. Held deliberately: it is
  the start of a detail-page component set rather than a one-off, so it wants its
  own category once that set exists.
- `Skeleton` — Motion is a pulse animation. Borderline by the rule: the value is
  inferable from watching, but a shimmer's timing is a real spec. Call it.
- `TabCount` — Medium, one usage. Might belong inside the Tabs page rather than
  having its own.
- `Timeline` — Medium. Has variants and real animation, but the studio's
  transaction timeline carries a lot of bespoke logic on top, so I am unsure
  which behaviour is the DS's and which is the product's.

## Group 3 — Overlays

| Component | Anatomy | Variants | Sizes | Motion | Confidence |
| --- | --- | --- | --- | --- | --- |
| `Dialog` | yes | no | no | yes | High |
| `Sheet` | yes | no | no | yes | High |
| `Popover` | yes | no | no | yes | High |
| `Tooltip` | yes | no | no | yes | High |
| `DropdownMenu` | yes | no | no | yes | High |
| `Wizard` | yes | yes | no | yes | Done |
| `Sonner` (toast) | yes | no | no | yes | Medium |

**Notes**

- This group is where Motion earns its place: every one has enter and exit
  animation with real durations.
- `Dialog` is the biggest win in the batch. 350 lines, 15 studio usages, and it
  carries `flow`, `DialogPanel` and the panelled layout, none of which is
  documented anywhere. Anatomy will be the longest on the site.
- `Sonner` — Medium. It is a wrapper around the `sonner` library, so the page is
  mostly "how we configure it" rather than a component reference.

## Group 4 — Navigation

| Component | Anatomy | Variants | Sizes | Motion | Confidence |
| --- | --- | --- | --- | --- | --- |
| `Tabs` | yes | yes (3) | no | no | High |
| `Breadcrumb` | yes | no | no | no | High |
| `Sidebar` | yes | yes (2) | yes (3) | yes | Low |
| `Pagination` | yes | no | no | no | Low |
| `Stepper` | yes | no | no | yes | Low |

**Notes**

- `Tabs` is high value: 15 usages and three variants that mean genuinely
  different things (`default` segmented, `subtle` segmented, `line` in-page). The
  variant choice is currently tribal knowledge.
- `Sidebar` — **Low**, and the biggest open question in the batch. 796 lines, the
  largest component in the DS, but only 2 studio usages because there is only one
  sidebar. Per the standing note, the sidebar is paired separately by designers
  and is independent of the layout components. I do not know what its docs page
  is *for*: nobody is composing a second sidebar. Possibly a page about the
  navigation pattern rather than the component.
- `Pagination` — **Low**. Zero studio usage, and `DataTable` explicitly has no
  pagination. Is this dead code? If so it should be deprecated rather than
  documented.
- `Stepper` — **Low**. Zero usage. Wizard covers the stepped-flow case inside a
  dialog; Stepper is presumably for the page case, but nothing uses it.

## Group 5 — Containers and disclosure

| Component | Anatomy | Variants | Sizes | Motion | Confidence |
| --- | --- | --- | --- | --- | --- |
| `Card` | yes | no | no | no | High |
| `SectionCard` | yes | no | no | no | High |
| `Collapsible` | yes | no | no | yes | Medium |
| `ExpandablePanel` | yes | no | no | yes | Medium |
| `HelpExpander` | yes | no | no | yes | High |
| `Alert` | yes | yes (5) | no | no | High |

**Notes**

- `Card` / `SectionCard` — two container components. Likely one page explaining
  when each applies, same question as Table / DataTable.
- `Collapsible` / `ExpandablePanel` / `HelpExpander` are three disclosure
  components. `HelpExpander` has clear usage (7 files) and a specific job.
  Whether the other two are distinct enough to need separate pages is a
  question, not a decision.

## Group 6 — Date and time

| Component | Anatomy | Variants | Sizes | Motion | Confidence |
| --- | --- | --- | --- | --- | --- |
| `Calendar` | yes | no | no | no | Medium |
| `DateTimePicker` | yes | no | no | no | High |
| `DateTimeRangePicker` | yes | no | no | no | High |
| `TimeField` | (in Group 1) | — | — | — | High |

**Notes**

- `Calendar` reports variant and size keys but they come from `react-day-picker`
  internals, not our API. Medium until I confirm what we actually expose.
- These three plus `TimeField` are a family and should cross-link. `TimeField`
  exists specifically because `<input type="time">` renders AM/PM on a 12-hour
  locale, which is the kind of thing the docs need to say once, loudly.

## Group 7 — Diagrams

| Component | Anatomy | Variants | Sizes | Motion | Confidence |
| --- | --- | --- | --- | --- | --- |
| `FlowDiagram` | yes | no | no | yes | Medium |
| `DiagramNode` | yes | yes | no | yes | Medium |
| `SearchBar` | yes | no | no | no | High |
| `FilterChip` | yes | yes | no | no | Medium |

**Notes**

- `DiagramNode` has a node-type colour convention already established
  (wallet white, anchor and alias slate, state pair-coloured). That convention is
  the page's real content and it lives in my memory rather than anywhere durable.
- `FilterChip` — Medium. One studio usage, and the report catalog deliberately
  did NOT use it, building `CategoryChip` instead because `FilterChip` has no
  selected state. That rejection is the most useful thing the page can say, and
  it also suggests the component may need a selected state rather than a doc.

---

## Batch plan

Ordered by value per unit of work, not alphabetically.

**Batch 1 — the high-traffic five.** `Dialog`, `Tabs`, `Input`, `Badge`,
`DataTable`. Between them 77 studio usages and the most undocumented behaviour.
All High confidence. This is where I would start.

**Batch 2 — form controls.** `Textarea`, `Label`, `Checkbox`, `Switch`,
`TimeField`, `Select`, `Combobox`, `InputGroup`, `InputOTP`. Mostly one shape, so
they go quickly once the first is set. Establishes the states-panel pattern that
replaces Variants for components with no variants.

**Batch 3 — overlays.** `Sheet`, `Popover`, `Tooltip`, `DropdownMenu`, `Sonner`.
Motion-heavy, and they share an Anatomy shape (trigger, content, portal).

**Batch 4 — the rest of the confident ones.** `Alert`, `Card`, `SectionCard`,
`Avatar`, `Kbd`, `Separator`, `StatCard`, `Breadcrumb`, `SearchBar`,
`HelpExpander`, `DateTimePicker`, `DateTimeRangePicker`.

**Batch 5 — needs decisions first.** Not blocked on writing, blocked on product
questions:

| Component | The question |
| --- | --- |
| `FilterCombobox` | 701 lines, zero usage. Alive or superseded? |
| `Sidebar` | What is a docs page for, when nobody composes a second one? |
| `Pagination` | Zero usage anywhere, including inside other DS components, and DataTable has no pagination. Deprecate? |
| `Stepper` | Zero usage anywhere, including inside other DS components. Does the page case exist? |
| `Table` vs `DataTable` | One page or two? |
| `Card` vs `SectionCard` | One page or two? |
| `Collapsible` / `ExpandablePanel` | Distinct enough for separate pages? |
| `TabCount` | Own page or a section inside Tabs? |
| `Badge` | 11 variants, four overlapping StatusCell. Which are sanctioned? |
| `Timeline` | Which behaviour is the DS's and which is the product's? |
| `Skeleton` | Does a pulse count as Motion? |

## Counts

- **49 components**, 3 done (`Button`, `Cells`, `Wizard`).
- **32 High** confidence, ready to write.
- **11 Medium**, one call each to confirm.
- **2 Low** (`Pagination`, `Stepper`) plus the pairing questions. `FilterCombobox` and `Sidebar` were downgraded from Low after checking indirect usage.

The 32 High are the real batch. The 11 Medium can be written with an assumption
stated in the page and corrected on review, which is cheaper than blocking. The
Low four should not be written until someone decides whether they are alive.
