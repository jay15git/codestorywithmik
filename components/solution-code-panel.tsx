"use client"

import { useState } from "react"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
} from "@/components/code-block/code-block"
import { CopyButton } from "@/components/copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface SolutionCodePanelProps {
  cpp: string | null
  java: string | null
  cppHtml: string | null
  javaHtml: string | null
}

function HighlightedCode({ html }: { html: string }) {
  return (
    <div
      className="[&_pre]:w-max [&_pre]:max-w-none [&_pre]:font-mono [&_code]:font-mono"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export function SolutionCodePanel({
  cpp,
  java,
  cppHtml,
  javaHtml,
}: SolutionCodePanelProps) {
  const hasCpp = Boolean(cpp && cppHtml)
  const hasJava = Boolean(java && javaHtml)
  const [activeTab, setActiveTab] = useState<"cpp" | "java">("cpp")

  if (!hasCpp && !hasJava) {
    return null
  }

  if (hasCpp && !hasJava) {
    return (
      <CodeBlock>
        <CodeBlockHeader>
          <span className="text-xs font-medium text-muted-foreground">C++</span>
          <CopyButton value={cpp!} />
        </CodeBlockHeader>
        <CodeBlockContent>
          <HighlightedCode html={cppHtml!} />
        </CodeBlockContent>
      </CodeBlock>
    )
  }

  if (!hasCpp && hasJava) {
    return (
      <CodeBlock>
        <CodeBlockHeader>
          <span className="text-xs font-medium text-muted-foreground">Java</span>
          <CopyButton value={java!} />
        </CodeBlockHeader>
        <CodeBlockContent>
          <HighlightedCode html={javaHtml!} />
        </CodeBlockContent>
      </CodeBlock>
    )
  }

  const copyValue = activeTab === "cpp" ? cpp! : java!

  return (
    <CodeBlock>
      <Tabs
        defaultValue="cpp"
        onValueChange={(value) => setActiveTab(value as "cpp" | "java")}
        className="gap-0"
      >
        <CodeBlockHeader>
          <TabsList
            variant="line"
            className="h-8 gap-1 bg-transparent p-0 text-muted-foreground"
          >
            <TabsTrigger
              value="cpp"
              className={cn(
                "h-7 px-2 text-xs data-active:bg-transparent",
                "data-active:text-foreground",
              )}
            >
              C++
            </TabsTrigger>
            <TabsTrigger
              value="java"
              className={cn(
                "h-7 px-2 text-xs data-active:bg-transparent",
                "data-active:text-foreground",
              )}
            >
              Java
            </TabsTrigger>
          </TabsList>
          <CopyButton value={copyValue} />
        </CodeBlockHeader>

        <CodeBlockContent>
          <TabsContent value="cpp" className="mt-0 outline-none">
            <HighlightedCode html={cppHtml!} />
          </TabsContent>
          <TabsContent value="java" className="mt-0 outline-none">
            <HighlightedCode html={javaHtml!} />
          </TabsContent>
        </CodeBlockContent>
      </Tabs>
    </CodeBlock>
  )
}
