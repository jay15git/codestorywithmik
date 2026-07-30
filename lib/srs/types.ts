import type { SrsState } from "@/lib/srs/state"

export type SrsRating = "again" | "hard" | "good" | "easy"

export interface SrsCard {
  /** Due day as YYYY-MM-DD (UTC) for queue sorting. */
  dueAt: string
  /** FSRS due timestamp (ISO). */
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  state: SrsState
  last_review?: string
  updatedAt: string
}

export type SrsMap = Record<string, SrsCard>

export interface SrsQueueItem {
  slug: string
  dueAt: string
  source: "srs" | "revisit"
}
