import type { SrsCard, SrsRating } from "@/lib/srs/types"

export const DEFAULT_EASE = 2.5
export const MIN_EASE = 1.3

export function toUtcDateKey(date: Date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
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

export function createInitialCard(
  today: string = toUtcDateKey(),
  intervalDays = 1,
): SrsCard {
  return {
    dueAt: addUtcDays(today, intervalDays),
    intervalDays,
    ease: DEFAULT_EASE,
    repetitions: 0,
    updatedAt: new Date().toISOString(),
  }
}

/** Mark due today (e.g. revisit flag). */
export function createDueTodayCard(today: string = toUtcDateKey()): SrsCard {
  return {
    dueAt: today,
    intervalDays: 0,
    ease: DEFAULT_EASE,
    repetitions: 0,
    updatedAt: new Date().toISOString(),
  }
}

function clampEase(ease: number): number {
  return Math.max(MIN_EASE, Math.round(ease * 100) / 100)
}

/**
 * Simplified SM-2 step. Mutates schedule only — progress flags handled by caller.
 */
export function applySrsRating(
  card: SrsCard | null | undefined,
  rating: SrsRating,
  today: string = toUtcDateKey(),
): SrsCard {
  const base = card ?? createDueTodayCard(today)
  const nowIso = new Date().toISOString()

  if (rating === "again") {
    return {
      dueAt: today,
      intervalDays: 0,
      ease: clampEase(base.ease - 0.2),
      repetitions: 0,
      updatedAt: nowIso,
    }
  }

  let ease = base.ease
  let intervalDays: number
  let repetitions = base.repetitions

  if (rating === "hard") {
    ease = clampEase(ease - 0.15)
    intervalDays =
      base.repetitions === 0 ? 1 : Math.max(1, Math.round(base.intervalDays * 1.2))
    repetitions = base.repetitions + 1
  } else if (rating === "good") {
    if (base.repetitions === 0) {
      intervalDays = 1
    } else if (base.repetitions === 1) {
      intervalDays = 3
    } else {
      intervalDays = Math.max(1, Math.round(base.intervalDays * ease))
    }
    repetitions = base.repetitions + 1
  } else {
    // easy
    ease = clampEase(ease + 0.15)
    if (base.repetitions === 0) {
      intervalDays = 2
    } else if (base.repetitions === 1) {
      intervalDays = 4
    } else {
      intervalDays = Math.max(1, Math.round(base.intervalDays * ease * 1.3))
    }
    repetitions = base.repetitions + 1
  }

  return {
    dueAt: addUtcDays(today, intervalDays),
    intervalDays,
    ease,
    repetitions,
    updatedAt: nowIso,
  }
}
