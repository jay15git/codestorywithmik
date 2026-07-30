import {
  FSRS,
  Rating,
  State,
  createEmptyCard,
  generatorParameters,
  type Card as FsrsCard,
  type Grade,
} from "ts-fsrs"

import type { SrsCard, SrsRating } from "@/lib/srs/types"

export const srsEngine = new FSRS(
  generatorParameters({ maximum_interval: 365 }),
)

export const RATING_TO_GRADE: Record<SrsRating, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
}

export function toFsrsCard(card: SrsCard): FsrsCard {
  return {
    due: new Date(card.due),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? new Date(card.last_review) : undefined,
  }
}

export function fromFsrsCard(
  fsrsCard: FsrsCard,
  updatedAt: string = new Date().toISOString(),
): SrsCard {
  return {
    dueAt: toUtcDateKeyFromDate(fsrsCard.due),
    due: fsrsCard.due.toISOString(),
    stability: fsrsCard.stability,
    difficulty: fsrsCard.difficulty,
    elapsed_days: fsrsCard.elapsed_days,
    scheduled_days: fsrsCard.scheduled_days,
    learning_steps: fsrsCard.learning_steps,
    reps: fsrsCard.reps,
    lapses: fsrsCard.lapses,
    state: fsrsCard.state,
    last_review: fsrsCard.last_review?.toISOString(),
    updatedAt,
  }
}

export function toUtcDateKeyFromDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function utcDateKeyToDate(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`)
}

export function createFsrsCardDueOn(dateKey: string): SrsCard {
  const due = utcDateKeyToDate(dateKey)
  const empty = createEmptyCard(due)
  return fromFsrsCard({ ...empty, due })
}

export function getSrsStateLabel(state: State): string {
  switch (state) {
    case State.New:
      return "New"
    case State.Learning:
      return "Learning"
    case State.Review:
      return "Review"
    case State.Relearning:
      return "Relearning"
    default:
      return "Unknown"
  }
}

export function formatIntervalPreview(from: Date, to: Date): string {
  const ms = to.getTime() - from.getTime()
  if (ms <= 0) return "now"

  const minutes = Math.round(ms / 60_000)
  if (minutes < 60) return `${minutes}m`

  const hours = Math.round(ms / 3_600_000)
  if (hours < 24) return `${hours}h`

  const days = Math.round(ms / 86_400_000)
  if (days < 30) return `${days}d`

  const months = Math.round(days / 30)
  return `${months}mo`
}
