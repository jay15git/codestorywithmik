"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import ReactMarkdown from "react-markdown"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  getServerNotesMap,
  readNotesMap,
  subscribeToNotes,
  writeNoteMarkdown,
} from "@/lib/notes/store"
import { cn } from "@/lib/utils"

export function SolutionNotes({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  return <SolutionNotesEditor key={slug} slug={slug} className={className} />
}

function SolutionNotesEditor({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const notesMap = useSyncExternalStore(
    subscribeToNotes,
    readNotesMap,
    getServerNotesMap,
  )
  const stored = notesMap[slug]?.markdown ?? ""
  const [draft, setDraft] = useState<string | null>(null)
  const value = draft ?? stored
  const [tab, setTab] = useState<"edit" | "preview">("edit")

  useEffect(() => {
    if (draft === null || draft === stored) {
      return
    }

    const timer = window.setTimeout(() => {
      writeNoteMarkdown(slug, draft)
    }, 400)

    return () => window.clearTimeout(timer)
  }, [draft, slug, stored])

  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-medium">Your notes</h2>
        <p className="text-sm text-muted-foreground">
          Markdown, saved in this browser only.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "edit" | "preview")}
        className="gap-3"
      >
        <div className="flex items-center justify-between gap-2">
          <TabsList variant="line" className="h-8">
            <TabsTrigger value="edit" className="px-2 text-xs">
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="px-2 text-xs">
              Preview
            </TabsTrigger>
          </TabsList>
          {value.trim() ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setDraft("")
                writeNoteMarkdown(slug, "")
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>

        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={"## Approach\n- ...\n\n## Gotchas\n- ..."}
            className="min-h-40 font-mono text-sm"
            aria-label="Solution notes markdown"
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          {value.trim() ? (
            <div
              className={cn(
                "rounded-lg border bg-card px-4 py-3 text-sm",
                "[&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5",
                "[&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold",
                "[&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-sm [&_h2]:font-semibold",
                "[&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-medium",
                "[&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
                "[&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
                "[&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3",
              )}
            >
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
              No notes yet. Switch to Edit and write markdown.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}
