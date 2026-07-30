import type { SolutionProgressMap } from "@/lib/progress/types"
import {
  applySrsRating,
  createDueTodayCard,
  createInitialCard,
  isDueOnOrBefore,
  toUtcDateKey,
} from "@/lib/srs/schedule"
import type {
  SrsCard,
  SrsMap,
  SrsQueueItem,
  SrsRating,
} from "@/lib/srs/types"
import {
  getStudyBag,
  patchStudyBag,
  subscribeStudyBag,
} from "@/lib/storage/study-bag"

export const SRS_STORAGE_KEY = "solution-srs-v1"

export const EMPTY_SRS_MAP: SrsMap = Object.freeze({})

export function subscribeToSrs(listener: () => void) {
  return subscribeStudyBag(listener)
}

export function getServerSrsMap(): SrsMap {
  return EMPTY_SRS_MAP
}

export function readSrsMap(): SrsMap {
  if (typeof window === "undefined") {
    return EMPTY_SRS_MAP
  }

  const srs = getStudyBag().srs
  return Object.keys(srs).length === 0 ? EMPTY_SRS_MAP : srs
}

function writeSrsMap(map: SrsMap) {
  patchStudyBag({
    srs: Object.keys(map).length === 0 ? {} : map,
  })
}

export function getSrsCard(map: SrsMap, slug: string): SrsCard | null {
  return map[slug] ?? null
}

/** First solve → schedule review in 1 day if no card yet. */
export function ensureScheduledOnSolve(slug: string): SrsMap {
  const map = { ...readSrsMap() }
  if (map[slug]) {
    return map
  }

  map[slug] = createInitialCard()
  writeSrsMap(map)
  return map
}

/** Revisit flag → due today (preserves ease / reps if card exists). */
export function markDueToday(slug: string): SrsMap {
  const map = { ...readSrsMap() }
  const today = toUtcDateKey()
  const existing = map[slug]

  if (existing) {
    map[slug] = {
      ...existing,
      dueAt: today,
      updatedAt: new Date().toISOString(),
    }
  } else {
    map[slug] = createDueTodayCard(today)
  }

  writeSrsMap(map)
  return map
}

export function rateSrsCard(slug: string, rating: SrsRating): SrsMap {
  const map = { ...readSrsMap() }
  map[slug] = applySrsRating(map[slug], rating)
  writeSrsMap(map)
  return map
}

export function buildReviewQueue(
  srsMap: SrsMap,
  progressMap: SolutionProgressMap,
  today: string = toUtcDateKey(),
): SrsQueueItem[] {
  const items: SrsQueueItem[] = []
  const seen = new Set<string>()

  for (const [slug, card] of Object.entries(srsMap)) {
    if (!isDueOnOrBefore(card.dueAt, today)) continue
    items.push({ slug, dueAt: card.dueAt, source: "srs" })
    seen.add(slug)
  }

  for (const [slug, entry] of Object.entries(progressMap)) {
    if (!entry.revisit || seen.has(slug)) continue
    items.push({ slug, dueAt: today, source: "revisit" })
    seen.add(slug)
  }

  items.sort((left, right) => {
    const due = left.dueAt.localeCompare(right.dueAt)
    if (due !== 0) return due
    return left.slug.localeCompare(right.slug)
  })

  return items
}

export function countDue(
  srsMap: SrsMap,
  progressMap: SolutionProgressMap,
  today: string = toUtcDateKey(),
): number {
  return buildReviewQueue(srsMap, progressMap, today).length
}
