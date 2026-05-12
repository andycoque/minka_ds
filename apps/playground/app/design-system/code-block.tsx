"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative flex items-center rounded-lg bg-neutral-950 px-4 py-3">
      <code className="flex-1 font-mono text-sm text-neutral-100 pr-10">{code}</code>
      <button
        onClick={copy}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded text-neutral-500 hover:text-neutral-200 transition-colors"
        aria-label="Copy to clipboard"
      >
        {copied
          ? <CheckIcon className="size-3.5" />
          : <CopyIcon className="size-3.5" />
        }
      </button>
    </div>
  )
}
