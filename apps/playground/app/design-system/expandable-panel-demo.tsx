import { ExpandablePanel, ExpandablePanelGroup } from "minka-ds"

// Label-left / value-right-of-it row (party-card KvRow style). Label sits in a
// fixed column; the value fills the rest, so long values (a signer hash) get the
// full width. Reads left-to-right: label first, then value.
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <>
      <span className="text-caption text-[var(--color-text-muted)]">{label}</span>
      <span className="text-body-sm text-[var(--color-text-default)] break-all">{value}</span>
    </>
  )
}

// One proof: an overline title over the label/value field grid.
function ProofBlock({ title, status, signer, time }: { title: string; status: string; signer: string; time: string }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-overline text-[var(--color-text-muted)]">{title}</span>
      <div className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-2">
        <Field label="Status"     value={status} />
        <Field label="Signer"     value={signer} />
        <Field label="Proof time" value={time} />
      </div>
    </div>
  )
}

export function ExpandablePanelDemo() {
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <ExpandablePanel title="CREATED" subtitle="Jun 2, 08:35:26" meta="1 proof" defaultOpen>
        <ProofBlock
          title="Initial proof"
          status="created"
          signer="GLzmj5aEY43oSYBAItsmp/CW5ZvDRelrrz3+tDaAb4="
          time="2026-06-02 08:35:26"
        />
      </ExpandablePanel>

      <ExpandablePanel title="NOTIFIED" subtitle="Jun 2, 08:35:27" meta="2 proofs" defaultOpen>
        {/* No divider — spacing alone groups the proofs (each has its own title). */}
        <div className="flex flex-col gap-6">
          <ProofBlock
            title="Sender notified"
            status="notified"
            signer="bSn1k0pQ9rWcExampleSenderSignerHashValue7zT="
            time="2026-06-02 08:35:27"
          />
          <ProofBlock
            title="Receiver notified"
            status="notified"
            signer="9mZ4hRe2vKpExampleReceiverSignerHashVal0wQ="
            time="2026-06-02 08:35:27"
          />
        </div>
      </ExpandablePanel>

      {/* Stacked group — one connected unit: outer corners rounded, inner edges
          square, single shared dividers between panels. */}
      <span className="mt-4 text-caption text-[var(--color-text-muted)]">Grouped (stacked)</span>
      <ExpandablePanelGroup>
        <ExpandablePanel title="CREATED" subtitle="Jun 2, 08:35:26" meta="1 proof" defaultOpen>
          <ProofBlock title="Initial proof" status="created" signer="GLzmj5aEY43oSYBAItsmp/CW5ZvDRelrrz3+tDaAb4=" time="2026-06-02 08:35:26" />
        </ExpandablePanel>

        <ExpandablePanel title="NOTIFIED" subtitle="Jun 2, 08:35:27" meta="2 proofs">
          <div className="flex flex-col gap-6">
            <ProofBlock title="Sender notified"   status="notified" signer="bSn1k0pQ9rWcExampleSenderSignerHashValue7zT=" time="2026-06-02 08:35:27" />
            <ProofBlock title="Receiver notified" status="notified" signer="9mZ4hRe2vKpExampleReceiverSignerHashVal0wQ=" time="2026-06-02 08:35:27" />
          </div>
        </ExpandablePanel>

        <ExpandablePanel title="PREPARED" subtitle="Jun 2, 08:35:28" meta="2 proofs">
          <div className="flex flex-col gap-6">
            <ProofBlock title="Debit prepared"  status="prepared" signer="kP7wQ2nXcVbExamplePrepareDebitSignerHash3xY=" time="2026-06-02 08:35:28" />
            <ProofBlock title="Credit prepared" status="prepared" signer="Tz5aB8mLdNqExamplePrepareCreditSignerHas1vR=" time="2026-06-02 08:35:28" />
          </div>
        </ExpandablePanel>
      </ExpandablePanelGroup>
    </div>
  )
}
