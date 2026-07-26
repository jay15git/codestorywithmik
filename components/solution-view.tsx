"use client"

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { LayoutGridIcon, ListIcon } from "lucide-react"

import { SolutionRow } from "@/components/solution-row"
import { Button } from "@/components/ui/button"
import type { SolutionMeta } from "@/lib/content/types"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "solution-view-mode"

type ViewMode = "grid" | "list"

interface SolutionViewContextValue {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

const SolutionViewContext = createContext<SolutionViewContextValue | null>(null)

const viewModeListeners = new Set<() => void>()

function readStoredViewMode(): ViewMode {
  if (typeof window === "undefined") {
    return "grid"
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "list" ? "list" : "grid"
}

function subscribeToViewMode(callback: () => void) {
  viewModeListeners.add(callback)
  return () => viewModeListeners.delete(callback)
}

function useSolutionViewContext() {
  const context = useContext(SolutionViewContext)
  if (!context) {
    throw new Error("SolutionView components must be used within SolutionViewProvider")
  }
  return context
}

export function SolutionViewProvider({ children }: { children: ReactNode }) {
  const viewMode = useSyncExternalStore<ViewMode>(
    subscribeToViewMode,
    readStoredViewMode,
    () => "grid",
  )

  const setViewMode = useCallback((mode: ViewMode) => {
    window.localStorage.setItem(STORAGE_KEY, mode)
    viewModeListeners.forEach((listener) => listener())
  }, [])

  return (
    <SolutionViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </SolutionViewContext.Provider>
  )
}

export function SolutionViewToggle({ className }: { className?: string }) {
  const { viewMode, setViewMode } = useSolutionViewContext()

  return (
    <div
      className={cn("flex items-center gap-0.5 rounded-lg border bg-card p-0.5", className)}
    >
      <Button
        variant={viewMode === "grid" ? "secondary" : "ghost"}
        size="icon-xs"
        onClick={() => setViewMode("grid")}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
      >
        <LayoutGridIcon />
      </Button>
      <Button
        variant={viewMode === "list" ? "secondary" : "ghost"}
        size="icon-xs"
        onClick={() => setViewMode("list")}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
      >
        <ListIcon />
      </Button>
    </div>
  )
}

export function SolutionView({
  solutions,
  className,
}: {
  solutions: SolutionMeta[]
  className?: string
}) {
  const { viewMode } = useSolutionViewContext()

  if (solutions.length === 0) {
    return null
  }

  if (viewMode === "list") {
    return (
      <div className={cn("divide-y rounded-lg border bg-card", className)}>
        {solutions.map((solution) => (
          <SolutionRow key={solution.slug} solution={solution} variant="list" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn("grid gap-4 md:grid-cols-2", className)}
    >
      {solutions.map((solution) => (
        <SolutionRow key={solution.slug} solution={solution} variant="grid" />
      ))}
    </div>
  )
}
