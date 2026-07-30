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
import { DIFFICULTY_VALUES } from "@/lib/content/filter-solutions"
import { searchIndex } from "@/lib/content/search-index"
import type { Difficulty, SearchIndex } from "@/lib/content/types"
import { cn } from "@/lib/utils"

let cachedIndex: SearchIndex | null = null
let fetchPromise: Promise<SearchIndex> | null = null

async function loadSearchIndex(): Promise<SearchIndex> {
  if (cachedIndex) {
    return cachedIndex
  }

  if (!fetchPromise) {
    // Cache-bust when search-index.json is regenerated after deploy/sync.
    fetchPromise = fetch(`/search-index.json?v=${Date.now()}`)
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
      .catch((error) => {
        fetchPromise = null
        throw error
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

const searchTriggerClassName =
  "relative hidden h-9 w-56 max-w-64 justify-start gap-2 overflow-hidden border-0 bg-card pr-12 text-muted-foreground shadow-none md:flex"

export function SearchTrigger({
  onClick,
  disabled = false,
}: {
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <>
      <Button
        variant="secondary"
        className={searchTriggerClassName}
        onClick={onClick}
        disabled={disabled}
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="min-w-0 truncate text-left">
          Search problems, companies…
        </span>
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Search"
        onClick={onClick}
        disabled={disabled}
      >
        <SearchIcon />
      </Button>
    </>
  )
}

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [difficulty, setDifficulty] = React.useState<Difficulty | null>(null)
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

    return searchIndex(index, query, { difficulty })
  }, [index, query, difficulty])

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
    setDifficulty(null)
    router.push(href)
  }

  return (
    <>
      <SearchTrigger onClick={openSearch} />

      <CommandDialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) {
            setQuery("")
            setDifficulty(null)
          }
        }}
        shouldFilter={false}
        title="Search solutions"
        description="Find problems, companies, and topics. Try #121, easy, @google"
      >
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search… #121, easy, @google, twosm"
        />
        <div className="flex flex-wrap gap-1.5 border-b px-3 py-2">
          {DIFFICULTY_VALUES.map((value) => {
            const active = difficulty === value
            return (
              <button
                key={value}
                type="button"
                className={cn(
                  "rounded-md border px-2 py-0.5 text-xs transition-colors",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={active}
                onClick={() =>
                  setDifficulty((current) => (current === value ? null : value))
                }
              >
                {value}
              </button>
            )
          })}
        </div>
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
                          <span className="font-medium">
                            {problem.leetcodeId != null
                              ? `#${problem.leetcodeId} `
                              : ""}
                            {problem.title}
                          </span>
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
