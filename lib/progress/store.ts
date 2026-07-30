"use client"

import type {
  ProgressCounts,
  ProgressFlag,
  SolutionProgressEntry,
  SolutionProgressMap,
} from "@/lib/progress/types"
import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"
import { REVISIT_TAG_ID } from "@/lib/tags/constants"
import { clearTag, setTag } from "@/lib/tags/store"

export {
  getProgressEntry,
  matchesAnyStatusFilter,
  matchesStatusFilter,
  parseStatusFilter,
  parseStatusFilters,
  parseLegacyTagIdsFromStatus,
} from "@/lib/progress/filters"

export const PROGRESS_STORAGE_KEY = "solution-progress-v1"

/** Stable empty snapshot for useSyncExternalStore (client + server). */
export const EMPTY_PROGRESS_MAP: SolutionProgressMap = Object.freeze({})

export function subscribeToProgress(listener: () => void) {
  return subscribeStudyBag(listener)
}

export function getServerProgressMap(): SolutionProgressMap {
  return EMPTY_PROGRESS_MAP
}

export function readProgressMap(): SolutionProgressMap {
  if (typeof window === "undefined") {
    return EMPTY_PROGRESS_MAP
  }

  const progress = getStudyBag().progress
  return Object.keys(progress).length === 0 ? EMPTY_PROGRESS_MAP : progress
}

function writeProgressMap(map: SolutionProgressMap) {
  patchStudyBag({
    progress: Object.keys(map).length === 0 ? {} : map,
  })
}

export function isFlagSet(
  map: SolutionProgressMap,
  slug: string,
  flag: ProgressFlag,
): boolean {
  const entry = map[slug] ?? {}
  return Boolean(entry[flag])
}

export function toggleProgressFlag(
  slug: string,
  flag: ProgressFlag,
): SolutionProgressMap {
  const map = { ...readProgressMap() }
  const entry = { ...(map[slug] ?? {}) }
  const next = !entry[flag]

  if (next) {
    entry[flag] = true
    if (flag === "solved") {
      clearTag(slug, REVISIT_TAG_ID)
    }
  } else {
    delete entry[flag]
  }

  if (entry.solved) {
    map[slug] = entry
  } else {
    delete map[slug]
  }

  writeProgressMap(map)
  return map
}

export function setProgressFlag(
  slug: string,
  flag: ProgressFlag,
  value: boolean,
): SolutionProgressMap {
  const map = { ...readProgressMap() }
  const entry = { ...(map[slug] ?? {}) }

  if (value) {
    entry[flag] = true
    if (flag === "solved") {
      clearTag(slug, REVISIT_TAG_ID)
    }
  } else {
    delete entry[flag]
  }

  if (entry.solved) {
    map[slug] = entry
  } else {
    delete map[slug]
  }

  writeProgressMap(map)
  return map
}

export function countProgress(map: SolutionProgressMap): ProgressCounts {
  let solved = 0

  for (const entry of Object.values(map)) {
    if (entry.solved) solved += 1
  }

  return {
    solved,
    totalTracked: Object.keys(map).length,
  }
}
