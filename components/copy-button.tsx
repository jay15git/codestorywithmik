"use client"

import { play } from "cuelume"
import { CheckIcon, CopyIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  value: string
  label?: string
}

export function CopyButton({ value, label = "Copy code" }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    play("success")
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      title={label}
      data-cuelume-press={undefined}
      data-cuelume-release={undefined}
      onClick={handleCopy}
    >
      <span className="t-icon-swap" data-state={copied ? "b" : "a"}>
        <span className="t-icon" data-icon="a">
          <CopyIcon />
        </span>
        <span className="t-icon" data-icon="b">
          <CheckIcon />
        </span>
      </span>
    </Button>
  )
}
