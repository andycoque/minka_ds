import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Alert variant="default">
        <Info />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>This is a neutral informational message with no urgency.</AlertDescription>
      </Alert>

      <Alert variant="info">
        <Info />
        <AlertTitle>Transaction queued</AlertTitle>
        <AlertDescription>This transaction is waiting to be processed by the clearing house.</AlertDescription>
      </Alert>

      <Alert variant="success">
        <CheckCircle2 />
        <AlertTitle>Transaction completed</AlertTitle>
        <AlertDescription>All 2PC consensus steps were signed and the transaction settled at 14:28:03.812.</AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle />
        <AlertTitle>Awaiting signature</AlertTitle>
        <AlertDescription>Committed creditschema is pending daviplata-ledger signature.</AlertDescription>
      </Alert>

      <Alert variant="error">
        <AlertCircle />
        <AlertTitle>Transaction failed</AlertTitle>
        <AlertDescription>Prepared routeschema was rejected by brb-gateway. Error code: INSUFFICIENT_FUNDS.</AlertDescription>
      </Alert>
    </div>
  )
}
