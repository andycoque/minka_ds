"use client"

import * as React from "react"
import { PageHelp, SectionIntro, type SectionIntroCard } from "minka-ds"
import { Playground } from "../playground"
import { Anatomy, Part } from "../anatomy"

/**
 * Demos for `PageHelp` and `SectionIntro`.
 *
 * Both are viewport-anchored in production: `PageHelp` is `fixed` to the corner of the
 * content area, and `SectionIntro` measures the launcher's position to fly a bulb into it.
 * Neither can be dropped into a docs stage as-is — the panel would pin itself to the
 * browser window rather than the example.
 *
 * So the stage is made the containing block instead. A `transform` on an ancestor makes
 * `position: fixed` resolve against THAT element, which is the one reliable way to scope a
 * fixed child without editing the component. `translate-x-0` is a no-op visually and
 * establishes the containing block.
 */

const HELP_CONTROLS = [
  {
    type: "toggle" as const,
    name: "highlight",
    label: "Unseen marker",
    defaultValue: true,
  },
]

const CONCEPTS = [
  {
    title: "What is a movement?",
    body: "One change to a balance: a top-up, a withdrawal, an issue or a destroy. Every movement is recorded with who requested it.",
  },
  {
    title: "Why does a movement need approval?",
    body: "Above a threshold set by policy, a movement cannot go through on one person's say-so. Others have to sign off first.",
  },
]

const ACTIONS = [
  {
    title: "Top up a participant",
    body: "Credits a participant's balance from the master balance.",
    action: { label: "Start a top-up", onClick: () => {} },
  },
]

function PageHelpDemo() {
  return (
    <Playground
      controls={HELP_CONTROLS}
      minHeight={420}
      details={() => (
        <Anatomy>
          <Part name="title">
            The panel heading. &quot;About &lt;thing the reader sees&gt;&quot;, matching the
            nav rather than the component&apos;s own name.
          </Part>
          <Part name="summary">What the page is for, in one or two sentences.</Part>
          <Part name="concepts">
            Vocabulary the page assumes. Titled by what the reader has seen on screen, not
            by the term being defined.
          </Part>
          <Part name="actions">
            What the reader can do. A topic may carry an entry point, rendered at the end of
            its body.
          </Part>
          <Part name="highlight" optional>
            Marks the launcher until it has been opened once.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        // translate-x-0 makes this the containing block for the panel's `fixed`
        // positioning, so it anchors to the stage instead of the browser window.
        <div className="relative h-[420px] w-full translate-x-0">
          <PageHelp
            title="About liquidity"
            summary="Where you watch and move funds across the ledger: what each participant holds, what is waiting on approval, and what has already settled."
            concepts={CONCEPTS}
            actions={ACTIONS}
            highlight={state.highlight === true}
          />
        </div>
      )}
    </Playground>
  )
}

/** Three cards of flat colour: this demo is about the layout and the flight, not content. */
function PlaceholderVisual({ label }: { label: string }) {
  return (
    <div className="ds-texture-grid flex h-24 w-full items-center justify-center [border-radius:var(--radius-card)] border border-[var(--color-border-default)] bg-[var(--color-bg-base)]">
      <span className="text-caption text-[var(--color-text-hint)]">{label}</span>
    </div>
  )
}

const INTRO_CARDS: SectionIntroCard[] = [
  {
    title: "Where the money sits",
    body: [
      "Every ledger has one pool the operator holds, and a balance for each participant.",
      "Topping up moves funds from the pool to a participant.",
    ],
    visual: <PlaceholderVisual label="Mock of the balances table" />,
  },
  {
    title: "Creating and retiring funds",
    body: [
      "Issuing mints new funds and raises the total supply.",
      "Destroying removes them for good.",
    ],
    visual: <PlaceholderVisual label="Mock of the master balance" />,
  },
  {
    title: "Nothing moves alone",
    body: [
      "Movements above the policy threshold wait for approval.",
      "You will find them under Approvals.",
    ],
    visual: <PlaceholderVisual label="Mock of an approval" />,
  },
]

// The takeover unmounts itself once the flight lands, so replaying is the only real
// interaction. Exposed as a control rather than a stray button in the stage.
const INTRO_CONTROLS = [
  {
    type: "select" as const,
    name: "cards",
    label: "Cards",
    options: [
      { value: "3", label: "Three" },
      { value: "2", label: "Two" },
    ],
    defaultValue: "3",
  },
]

function SectionIntroDemo() {
  // Remounted on replay, because the takeover unmounts itself once the flight lands and
  // the whole point of the demo is watching that happen more than once.
  const [run, setRun] = React.useState(0)
  const [done, setDone] = React.useState(false)

  return (
    <Playground
      controls={INTRO_CONTROLS}
      minHeight={560}
      details={() => (
        <Anatomy>
          <Part name="title">
            The section name as the nav calls it. Prefixed with a dimmed
            &quot;Welcome to&quot;.
          </Part>
          <Part name="summary">
            Reuses the guide&apos;s summary, so the two say the same thing. Split at the
            first colon.
          </Part>
          <Part name="cards">
            Three explain the model. Each pairs a mock of what the reader is about to see
            with one concept.
          </Part>
          <Part name="onLauncherStage" optional>
            Drives the guide launcher&apos;s staged reveal, so the bulb can fly into it.
          </Part>
        </Anatomy>
      )}
    >
      {(state) => (
        <div className="relative flex h-[560px] w-full translate-x-0 flex-col">
          {/* The real launcher, so the flight has a measurable target as it does in the
              product. */}
          <PageHelp
            title="About liquidity"
            summary="Where you watch and move funds across the ledger."
            concepts={CONCEPTS}
          />

          {done ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <span className="text-body-sm text-[var(--color-text-muted)]">
                The section would appear here, fading in.
              </span>
              <button
                type="button"
                onClick={() => {
                  setDone(false)
                  setRun(n => n + 1)
                }}
                className="text-body-sm text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)]"
              >
                Replay
              </button>
            </div>
          ) : (
            <SectionIntro
              key={run}
              title="Liquidity"
              summary="Where you watch and move funds across the ledger: what each participant holds, what is waiting on approval, and what has already settled."
              cards={INTRO_CARDS.slice(0, Number(state.cards) || 3)}
              onDone={() => setDone(true)}
            />
          )}
        </div>
      )}
    </Playground>
  )
}

export { PageHelpDemo, SectionIntroDemo }
