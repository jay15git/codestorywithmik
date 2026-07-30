"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import {
  countProgress,
  getProgressEntry,
  getServerProgressMap,
  isFlagSet,
  readProgressMap,
  setProgressFlag,
  subscribeToProgress,
  toggleProgressFlag,
} from "@/lib/progress/store"
import type {
  ProgressCounts,
  ProgressFlag,
  SolutionProgressEntry,
  SolutionProgressMap,
} from "@/lib/progress/types"

interface SolutionProgressContextValue {
  map: SolutionProgressMap
  counts: ProgressCounts
  getEntry: (slug: string) => SolutionProgressEntry
  hasFlag: (slug: string, flag: ProgressFlag) => boolean
  toggleFlag: (slug: string, flag: ProgressFlag) => void
  setFlag: (slug: string, flag: ProgressFlag, value: boolean) => void
}

const SolutionProgressContext =
  createContext<SolutionProgressContextValue | null>(null)

export function SolutionProgressProvider({
  children,
}: {
  children: ReactNode
}) {
  const map = useSyncExternalStore(
    subscribeToProgress,
    readProgressMap,
    getServerProgressMap,
  )

  const counts = useMemo(() => countProgress(map), [map])

  const getEntry = useCallback(
    (slug: string) => getProgressEntry(map, slug),
    [map],
  )

  const hasFlag = useCallback(
    (slug: string, flag: ProgressFlag) => isFlagSet(map, slug, flag),
    [map],
  )

  const toggleFlag = useCallback((slug: string, flag: ProgressFlag) => {
    toggleProgressFlag(slug, flag)
  }, [])

  const setFlag = useCallback(
    (slug: string, flag: ProgressFlag, value: boolean) => {
      setProgressFlag(slug, flag, value)
    },
    [],
  )

  const value = useMemo(
    () => ({
      map,
      counts,
      getEntry,
      hasFlag,
      toggleFlag,
      setFlag,
    }),
    [map, counts, getEntry, hasFlag, toggleFlag, setFlag],
  )

  return (
    <SolutionProgressContext.Provider value={value}>
      {children}
    </SolutionProgressContext.Provider>
  )
}

export function useSolutionProgress() {
  const context = useContext(SolutionProgressContext)
  if (!context) {
    throw new Error(
      "useSolutionProgress must be used within SolutionProgressProvider",
    )
  }
  return context
}
