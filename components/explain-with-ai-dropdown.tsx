"use client"

import { SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownContent,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { MenuItem } from "@/components/ui/menu-item"
import {
  AI_PROVIDERS,
  buildAiProviderUrl,
  buildExplainPrompt,
  type ExplainWithAiInput,
} from "@/lib/content/explain-with-ai"

export function ExplainWithAiDropdown(props: ExplainWithAiInput) {
  function openProvider(providerId: (typeof AI_PROVIDERS)[number]["id"]) {
    const prompt = buildExplainPrompt(props)
    const url = buildAiProviderUrl(providerId, prompt)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <DropdownMenu>
      <DropdownTrigger
        render={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Explain with AI"
            title="Explain with AI"
          />
        }
      >
        <SparklesIcon />
      </DropdownTrigger>
      <DropdownContent align="end" className="min-w-40">
        {AI_PROVIDERS.map((provider, index) => (
          <MenuItem
            key={provider.id}
            label={provider.label}
            index={index}
            onSelect={() => openProvider(provider.id)}
          />
        ))}
      </DropdownContent>
    </DropdownMenu>
  )
}
