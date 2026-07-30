export type SrsRating = "again" | "hard" | "good" | "easy"

export interface SrsCard {
  /** Due day as YYYY-MM-DD (UTC). */
  dueAt: string
  /** Current interval in whole days. */
  intervalDays: number
  /** SM-2-style ease factor (min 1.3). */
  ease: number
  repetitions: number
  updatedAt: string
}

export type SrsMap = Record<string, SrsCard>

export interface SrsQueueItem {
  slug: string
  dueAt: string
  source: "srs" | "revisit"
}
