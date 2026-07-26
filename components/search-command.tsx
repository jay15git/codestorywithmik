"use client"

import Fuse from "fuse.js"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { SearchDocument } from "@/lib/content/types"

interface SearchCommandProps {
  documents: SearchDocument[]
}

export function SearchCommand({ documents }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const fuse = React.useMemo(
    () =>
      new Fuse(documents, {
        keys: ["title", "topic", "subtopic", "companies", "leetcodeSlug"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [documents],
  )

  const results = React.useMemo(() => {
    if (!query.trim()) {
      return documents.slice(0, 12)
    }

    return fuse.search(query, { limit: 20 }).map((result) => result.item)
  }, [documents, fuse, query])

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="hidden h-9 w-full max-w-sm justify-start gap-2 text-muted-foreground md:flex"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
        <span className="flex-1 text-left">Search problems, companies…</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Search"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search solutions"
        description="Find problems by name, topic, or company"
      >
        <CommandInput
          placeholder="Search problems, companies, topics…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Solutions">
            {results.map((item) => (
              <CommandItem
                key={item.slug}
                value={`${item.title} ${item.topic} ${item.companies}`}
                onSelect={() => {
                  setOpen(false)
                  setQuery("")
                }}
              >
                <Link
                  href={`/solutions/${item.slug}`}
                  className="flex w-full flex-col gap-0.5"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.topic}
                    {item.subtopic ? ` · ${item.subtopic}` : ""}
                  </span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
