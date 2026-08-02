"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { LayoutGridIcon, ListIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  getServerViewMode,
  readViewMode,
  subscribeToViewMode,
  writeViewMode,
} from "@/lib/preferences/view-mode"
import type { ViewMode } from "@/lib/storage/types"
import { cn } from "@/lib/utils"

interface SolutionViewContextValue {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  visibleColumns: SolutionColumn[]
  setVisibleColumns: (columns: SolutionColumn[]) => void
}

export type SolutionColumn = "difficulty" | "topics" | "companies"

const DEFAULT_VISIBLE_COLUMNS: SolutionColumn[] = [
  "difficulty",
  "topics",
  "companies",
]

const SolutionViewContext = createContext<SolutionViewContextValue | null>(null)

function useSolutionViewContext() {
  const context = useContext(SolutionViewContext)
  if (!context) {
    throw new Error(
      "SolutionView components must be used within SolutionViewProvider"
    )
  }
  return context
}

export { useSolutionViewContext }

export function SolutionViewProvider({ children }: { children: ReactNode }) {
  const [visibleColumns, setVisibleColumns] = useState<SolutionColumn[]>(
    DEFAULT_VISIBLE_COLUMNS
  )
  const viewMode = useSyncExternalStore<ViewMode>(
    subscribeToViewMode,
    readViewMode,
    getServerViewMode
  )

  const setViewMode = useCallback((mode: ViewMode) => {
    writeViewMode(mode)
  }, [])

  const contextValue = useMemo(
    () => ({ viewMode, setViewMode, visibleColumns, setVisibleColumns }),
    [viewMode, setViewMode, visibleColumns]
  )

  return (
    <SolutionViewContext.Provider value={contextValue}>
      <div className="solution-view-root" data-view-mode={viewMode}>
        {children}
      </div>
    </SolutionViewContext.Provider>
  )
}

export function SolutionViewToggle({ className }: { className?: string }) {
  const { viewMode, setViewMode } = useSolutionViewContext()

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="icon-sm"
        className={
          viewMode === "grid"
            ? "bg-white text-foreground hover:bg-white dark:bg-muted dark:hover:bg-muted"
            : "text-muted-foreground"
        }
        onClick={() => setViewMode("grid")}
        aria-label="Grid view"
        aria-pressed={viewMode === "grid"}
      >
        <LayoutGridIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className={
          viewMode === "list"
            ? "bg-white text-foreground hover:bg-white dark:bg-muted dark:hover:bg-muted"
            : "text-muted-foreground"
        }
        onClick={() => setViewMode("list")}
        aria-label="List view"
        aria-pressed={viewMode === "list"}
      >
        <ListIcon />
      </Button>
    </div>
  )
}
