"use client"

import { useMemo, useState } from "react"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
} from "@/components/code-block/code-block"
import { CopyButton } from "@/components/copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getAvailableLanguages,
  SOLUTION_LANGUAGE_LABELS,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import { cn } from "@/lib/utils"

import { sanitizeShikiHtml } from "@/lib/sanitize-shiki-html"

interface SolutionCodePanelProps {
  code: Record<SolutionLanguage, string | null>
  highlighted: Partial<Record<SolutionLanguage, string | null>>
}

function HighlightedCode({ html }: { html: string }) {
  return (
    <div
      className="[&_pre]:w-max [&_pre]:max-w-none [&_pre]:font-mono [&_code]:font-mono"
      dangerouslySetInnerHTML={{ __html: sanitizeShikiHtml(html) }}
    />
  )
}

export function SolutionCodePanel({ code, highlighted }: SolutionCodePanelProps) {
  const languages = useMemo(
    () =>
      getAvailableLanguages(code).filter(
        (language) => code[language] && highlighted[language],
      ),
    [code, highlighted],
  )

  const [activeTab, setActiveTab] = useState<SolutionLanguage>(
    languages[0] ?? "cpp",
  )

  if (languages.length === 0) {
    return null
  }

  if (languages.length === 1) {
    const language = languages[0]
    return (
      <CodeBlock>
        <CodeBlockHeader>
          <span className="text-xs font-medium text-muted-foreground">
            {SOLUTION_LANGUAGE_LABELS[language]}
          </span>
          <CopyButton value={code[language]!} />
        </CodeBlockHeader>
        <CodeBlockContent>
          <HighlightedCode html={highlighted[language]!} />
        </CodeBlockContent>
      </CodeBlock>
    )
  }

  const copyValue = code[activeTab] ?? languages[0]

  return (
    <CodeBlock>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SolutionLanguage)}
        className="gap-0"
      >
        <CodeBlockHeader>
          <TabsList
            variant="line"
            className="h-8 gap-1 bg-transparent p-0 text-muted-foreground"
          >
            {languages.map((language) => (
              <TabsTrigger
                key={language}
                value={language}
                className={cn(
                  "h-7 px-2 text-xs data-active:bg-transparent",
                  "data-active:text-foreground",
                )}
              >
                {SOLUTION_LANGUAGE_LABELS[language]}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton value={copyValue!} />
        </CodeBlockHeader>

        <CodeBlockContent>
          {languages.map((language) => (
            <TabsContent
              key={language}
              value={language}
              className="mt-0 outline-none"
            >
              <HighlightedCode html={highlighted[language]!} />
            </TabsContent>
          ))}
        </CodeBlockContent>
      </Tabs>
    </CodeBlock>
  )
}
