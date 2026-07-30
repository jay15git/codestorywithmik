"use client"

import { CheckIcon, LinkIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { SolutionLanguage } from "@/lib/content/solution-languages"

export function ShareSolutionLinkButton({
  slug,
  language,
}: {
  slug: string
  language: SolutionLanguage
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = new URL(window.location.href)
    url.pathname = `/solutions/${slug}`
    url.searchParams.set("lang", language)
    // Keep list nav context if present; always set lang
    await navigator.clipboard.writeText(url.toString())
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label="Copy link with language"
      onClick={handleCopy}
    >
      {copied ? <CheckIcon /> : <LinkIcon />}
    </Button>
  )
}
