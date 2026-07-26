"use client"

import { CheckIcon, CopyIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  value: string
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label="Copy code"
      onClick={handleCopy}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  )
}
