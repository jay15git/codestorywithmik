"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { searchIndex } from "@/lib/content/search-index"
import type { SearchIndex } from "@/lib/content/types"
import { cn } from "@/lib/utils"

let cachedIndex: SearchIndex | null = null
let fetchPromise: Promise<SearchIndex> | null = null

async function loadSearchIndex(): Promise<SearchIndex> {
  if (cachedIndex) {
    return cachedIndex
  }

  if (!fetchPromise) {
    fetchPromise = fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load search index")
        }
        return response.json() as Promise<SearchIndex>
      })
      .then((index) => {
        cachedIndex = index
        return index
      })
  }

  return fetchPromise
}

function ensureSearchIndex(
  onLoaded: (index: SearchIndex) => void,
  onError: (message: string) => void,
  onFinally: () => void,
) {
  if (cachedIndex) {
    onLoaded(cachedIndex)
    onFinally()
    return
  }

  loadSearchIndex()
    .then(onLoaded)
    .catch(() => onError("Search unavailable. Run sync-content and refresh."))
    .finally(onFinally)
}

const DIFFICULTY_STYLES = {
  Easy: "text-emerald-600 dark:text-emerald-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Hard: "text-red-600 dark:text-red-400",
} as const

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [index, setIndex] = React.useState<SearchIndex | null>(cachedIndex)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const openSearch = React.useCallback(() => {
    setOpen(true)

    if (cachedIndex) {
      setIndex(cachedIndex)
      return
    }

    setLoading(true)
    setError(null)

    ensureSearchIndex(
      (loaded) => setIndex(loaded),
      (message) => setError(message),
      () => setLoading(false),
    )
  }, [])

  const results = React.useMemo(() => {
    if (!index) {
      return { companies: [], topics: [], problems: [] }
    }

    return searchIndex(index, query)
  }, [index, query])

  const hasResults =
    results.companies.length > 0 ||
    results.topics.length > 0 ||
    results.problems.length > 0

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        openSearch()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [openSearch])

  function navigate(href: string) {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  return (
    <>
      <Button
        variant="secondary"
        className="hidden h-9 w-full max-w-sm justify-start gap-2 border-0 bg-card text-muted-foreground shadow-none md:flex"
        onClick={openSearch}
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
        onClick={openSearch}
      >
        <SearchIcon />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) {
            setQuery("")
          }
        }}
        shouldFilter={false}
        title="Search solutions"
        description="Find problems, companies, and topics"
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search problems, companies, topics…"
        />
        <CommandList>
          {loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading search…
            </div>
          ) : error ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : (
            <>
              {!hasResults && <CommandEmpty>No results found.</CommandEmpty>}

              {results.companies.length > 0 && (
                <CommandGroup heading="Companies">
                  {results.companies.map((company) => (
                    <CommandItem
                      key={company.slug}
                      value={`company-${company.slug}`}
                      onSelect={() => navigate(`/companies/${company.slug}`)}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="font-medium">{company.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {company.count} solutions
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.topics.length > 0 && (
                <CommandGroup heading="Topics">
                  {results.topics.map((topic) => (
                    <CommandItem
                      key={topic.slug}
                      value={`topic-${topic.slug}`}
                      onSelect={() => navigate(`/topics/${topic.slug}`)}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="font-medium">{topic.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {topic.count} solutions
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {results.problems.length > 0 && (
                <CommandGroup heading="Problems">
                  {results.problems.map((problem) => (
                    <CommandItem
                      key={problem.slug}
                      value={`problem-${problem.slug}`}
                      onSelect={() => navigate(`/solutions/${problem.slug}`)}
                    >
                      <div className="flex w-full items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="font-medium">{problem.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {problem.topic}
                            {problem.subtopic ? ` · ${problem.subtopic}` : ""}
                          </span>
                        </div>
                        {problem.difficulty && (
                          <span
                            className={cn(
                              "shrink-0 text-xs font-medium",
                              DIFFICULTY_STYLES[problem.difficulty],
                            )}
                          >
                            {problem.difficulty}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
