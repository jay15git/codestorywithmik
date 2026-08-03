"use client"

import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"
import type { ViewMode } from "@/lib/storage/types"

export const VIEW_MODE_STORAGE_KEY = "solution-view-mode"

export function subscribeToViewMode(listener: () => void) {
  return subscribeStudyBag(listener)
}

export function readViewMode(): ViewMode {
  if (typeof window === "undefined") {
    return "list"
  }

  return getStudyBag().viewMode
}

export function getServerViewMode(): ViewMode {
  return "list"
}

export function writeViewMode(mode: ViewMode) {
  if (typeof window !== "undefined" && getStudyBag().viewMode === mode) {
    return
  }

  patchStudyBag({ viewMode: mode })
}
