import { Rating } from "ts-fsrs"

import {
  RATING_TO_GRADE,
  createFsrsCardDueOn,
  formatIntervalPreview,
  fromFsrsCard,
  srsEngine,
  toFsrsCard,
  toUtcDateKeyFromDate,
} from "@/lib/srs/fsrs-engine"
import type { SrsCard, SrsRating } from "@/lib/srs/types"

export {
  formatIntervalPreview,
  getSrsStateLabel,
} from "@/lib/srs/fsrs-engine"

export function toUtcDateKey(date: Date = new Date()): string {
  return toUtcDateKeyFromDate(date)
}

export function addUtcDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return toUtcDateKey(date)
}

export function compareDateKeys(left: string, right: string): number {
  return left.localeCompare(right)
}

export function isDueOnOrBefore(dueAt: string, today: string): boolean {
  return compareDateKeys(dueAt, today) <= 0
}

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
  const result = srsEngine.next(
    toFsrsCard(base),
    now,
    RATING_TO_GRADE[rating],
  )
  return fromFsrsCard(result.card)
}

export function previewSrsRatings(
  card: SrsCard | null | undefined,
  now: Date = new Date(),
): Record<SrsRating, string> {
  const base = card ?? createDueTodayCard(toUtcDateKey(now))
  const preview = srsEngine.repeat(toFsrsCard(base), now)

  return {
    again: formatIntervalPreview(now, preview[Rating.Again].card.due),
    hard: formatIntervalPreview(now, preview[Rating.Hard].card.due),
    good: formatIntervalPreview(now, preview[Rating.Good].card.due),
    easy: formatIntervalPreview(now, preview[Rating.Easy].card.due),
  }
}
