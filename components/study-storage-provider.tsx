"use client"

import { useEffect, type ReactNode } from "react"

import { hydrateStudyBag } from "@/lib/storage/study-bag"

export function StudyStorageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void hydrateStudyBag()
  }, [])

  return children
}
