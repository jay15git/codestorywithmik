import type {
  ProgressCounts,
  ProgressFlag,
  SolutionProgressEntry,
  SolutionProgressMap,
  StatusFilter,
} from "@/lib/progress/types"
import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"

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

export function getProgressEntry(
  map: SolutionProgressMap,
  slug: string,
): SolutionProgressEntry {
  return map[slug] ?? {}
}

export function isFlagSet(
  map: SolutionProgressMap,
  slug: string,
  flag: ProgressFlag,
): boolean {
  return Boolean(getProgressEntry(map, slug)[flag])
}

export function toggleProgressFlag(
  slug: string,
  flag: ProgressFlag,
): SolutionProgressMap {
  const map = { ...readProgressMap() }
  const entry = { ...getProgressEntry(map, slug) }
  const next = !entry[flag]

  if (next) {
    entry[flag] = true
    if (flag === "solved") {
      delete entry.revisit
    }
    if (flag === "revisit") {
      delete entry.solved
    }
  } else {
    delete entry[flag]
  }

  const hasAny = entry.solved || entry.starred || entry.revisit
  if (hasAny) {
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
  const entry = { ...getProgressEntry(map, slug) }

  if (value) {
    entry[flag] = true
    if (flag === "solved") {
      delete entry.revisit
    }
    if (flag === "revisit") {
      delete entry.solved
    }
  } else {
    delete entry[flag]
  }

  const hasAny = entry.solved || entry.starred || entry.revisit
  if (hasAny) {
    map[slug] = entry
  } else {
    delete map[slug]
  }

  writeProgressMap(map)
  return map
}

export function countProgress(map: SolutionProgressMap): ProgressCounts {
  let solved = 0
  let starred = 0
  let revisit = 0

  for (const entry of Object.values(map)) {
    if (entry.solved) solved += 1
    if (entry.starred) starred += 1
    if (entry.revisit) revisit += 1
  }

  return {
    solved,
    starred,
    revisit,
    totalTracked: Object.keys(map).length,
  }
}

export function matchesStatusFilter(
  map: SolutionProgressMap,
  slug: string,
  filter: StatusFilter,
): boolean {
  const entry = getProgressEntry(map, slug)

  switch (filter) {
    case "all":
      return true
    case "solved":
      return Boolean(entry.solved)
    case "unsolved":
      return !entry.solved
    case "starred":
      return Boolean(entry.starred)
    case "revisit":
      return Boolean(entry.revisit)
    default:
      return true
  }
}

export function parseStatusFilter(value: string | undefined): StatusFilter {
  switch (value) {
    case "solved":
    case "unsolved":
    case "starred":
    case "revisit":
      return value
    default:
      return "all"
  }
}
