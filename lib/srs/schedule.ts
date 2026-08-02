"use client"

import {
  addUtcDays,
  toUtcDateKey,
} from "@/lib/srs/dates"
import {
  createFsrsCardDueOn,
  runFsrsNext,
  runFsrsPreview,
} from "@/lib/srs/fsrs-engine"
import type { SrsCard, SrsRating } from "@/lib/srs/types"

export {
  addUtcDays,
  compareDateKeys,
  isDueOnOrBefore,
  toUtcDateKey,
} from "@/lib/srs/dates"
export { getSrsStateLabel } from "@/lib/srs/state"

/** First solve → schedule review tomorrow without rating yet. */
export function createInitialCard(
  today: string = toUtcDateKey(),
): SrsCard {
  return createFsrsCardDueOn(addUtcDays(today, 1))
}

/** Mark due today (e.g. revisit flag). */
export function createDueTodayCard(today: string = toUtcDateKey()): SrsCard {
  return createFsrsCardDueOn(today)
}

export function applySrsRating(
  card: SrsCard | null | undefined,
  rating: SrsRating,
  now: Date = new Date(),
): SrsCard {
  const base = card ?? createDueTodayCard(toUtcDateKey(now))
  return runFsrsNext(base, now, rating)
}

export function previewSrsRatings(
  card: SrsCard | null | undefined,
  now: Date = new Date(),
): Record<SrsRating, string> {
  const base = card ?? createDueTodayCard(toUtcDateKey(now))
  return runFsrsPreview(base, now)
}
