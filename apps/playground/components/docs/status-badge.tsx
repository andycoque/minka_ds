import { Badge } from "minka-ds"
import { STATUS, type Status } from "@/lib/schemas"

const VARIANT: Record<Status, React.ComponentProps<typeof Badge>["variant"]> = {
  stable: "success",
  beta: "warning",
  // `error`, not `destructive` — destructive is a solid red fill built for
  // buttons and reads far louder than the tinted success/warning it sits beside.
  deprecated: "error",
}

/**
 * Lifecycle badge in the page header, driven by the `status` frontmatter field.
 *
 * This is a Badge and not a StatusCell on purpose: the DS rule is that a badge
 * is a label someone applied to the thing, where a status is a state the thing
 * is in. "Deprecated" is a label we applied to the component.
 */
function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant={VARIANT[status]} className="shrink-0">
      {STATUS[status]}
    </Badge>
  )
}

export { StatusBadge }
