"use client"

import {
  createContext,
  useContext,
  type ReactNode,
} from "react"

import type { SolutionNavHrefParams } from "@/lib/content/solution-nav"

const SolutionListNavContext = createContext<SolutionNavHrefParams | null>(null)

export function SolutionListNavProvider({
  value,
  children,
}: {
  value: SolutionNavHrefParams | null
  children: ReactNode
}) {
  return (
    <SolutionListNavContext.Provider value={value}>
      {children}
    </SolutionListNavContext.Provider>
  )
}

export function useSolutionListNav(): SolutionNavHrefParams | null {
  return useContext(SolutionListNavContext)
}
