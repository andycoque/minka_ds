"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "minka-ds"
import { Lock } from "lucide-react"

export function PasswordInputDemo() {
  const [visible, setVisible] = useState(false)
  return (
    <InputGroup>
      <InputGroupAddon><Lock className="size-4 text-[var(--color-text-hint)]" /></InputGroupAddon>
      <InputGroupInput type={visible ? "text" : "password"} placeholder="Password" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => setVisible(v => !v)} aria-label="Toggle password">
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
