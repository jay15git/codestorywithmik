import { State, createEmptyCard } from "ts-fsrs"

import {
  fromFsrsCard,
  utcDateKeyToDate,
} from "@/lib/srs/fsrs-engine"
import type { SrsCard } from "@/lib/srs/types"

interface LegacySrsCard {
  dueAt: string
  intervalDays: number
  ease: number
  repetitions: number
  updatedAt: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isLegacySrsCard(value: unknown): value is LegacySrsCard {
  if (!isRecord(value)) return false

  return (
    typeof value.dueAt === "string" &&
    typeof value.intervalDays === "number" &&
    typeof value.ease === "number" &&
    typeof value.repetitions === "number" &&
    typeof value.updatedAt === "string" &&
    typeof value.state !== "number" &&
    typeof value.due !== "string"
  )
}

function isFsrsSrsCard(value: unknown): value is SrsCard {
  if (!isRecord(value)) return false

  return (
    typeof value.dueAt === "string" &&
    typeof value.due === "string" &&
    typeof value.stability === "number" &&
    typeof value.difficulty === "number" &&
    typeof value.elapsed_days === "number" &&
    typeof value.scheduled_days === "number" &&
    typeof value.learning_steps === "number" &&
    typeof value.reps === "number" &&
    typeof value.lapses === "number" &&
    typeof value.state === "number" &&
    typeof value.updatedAt === "string"
  )
}

export function migrateLegacySrsCard(legacy: LegacySrsCard): SrsCard {
  const due = utcDateKeyToDate(legacy.dueAt)

  if (legacy.repetitions > 0) {
    const empty = createEmptyCard(due)
    return fromFsrsCard(
      {
        ...empty,
        due,
        state: State.Review,
        stability: Math.max(legacy.intervalDays, 0.1),
        scheduled_days: legacy.intervalDays,
        reps: legacy.repetitions,
        last_review: new Date(legacy.updatedAt),
      },
      legacy.updatedAt,
    )
  }

  const empty = createEmptyCard(due)
  return fromFsrsCard({ ...empty, due }, legacy.updatedAt)
}

export function coerceSrsCard(value: unknown): SrsCard | null {
  if (isFsrsSrsCard(value)) {
    return value
  }

  if (isLegacySrsCard(value)) {
    return migrateLegacySrsCard(value)
  }

  return null
}

export function coerceSrsMap(value: unknown): Record<string, SrsCard> {
  if (!isRecord(value)) return {}

  const result: Record<string, SrsCard> = {}
  for (const [slug, card] of Object.entries(value)) {
    const coerced = coerceSrsCard(card)
    if (coerced) {
      result[slug] = coerced
    }
  }

  return result
}
