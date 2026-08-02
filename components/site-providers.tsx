"use client"

import type { ReactNode } from "react"

import { SolutionProgressProvider } from "@/components/solution-progress-provider"
import { SolutionTagsProvider } from "@/components/solution-tags-provider"
import { StudyStorageProvider } from "@/components/study-storage-provider"

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <StudyStorageProvider>
      <SolutionTagsProvider>
        <SolutionProgressProvider>{children}</SolutionProgressProvider>
      </SolutionTagsProvider>
    </StudyStorageProvider>
  )
}
