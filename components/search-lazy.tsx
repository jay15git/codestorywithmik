"use client"

import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

const SearchCommand = dynamic(
  () =>
    import("@/components/search-command").then((module) => module.SearchCommand),
  {
    ssr: false,
    loading: () => (
      <>
        <Button
          variant="secondary"
          className="hidden h-9 w-full max-w-sm justify-start gap-2 border-0 bg-card text-muted-foreground shadow-none md:flex"
          disabled
        >
          <SearchIcon className="size-4" />
          <span className="flex-1 text-left">Search problems, companies…</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
          disabled
        >
          <SearchIcon />
        </Button>
      </>
    ),
  },
)

export function SearchLazy() {
  return <SearchCommand />
}
