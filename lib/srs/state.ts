/** Mirrors `ts-fsrs` State enum without importing the package on the server. */
export const SrsState = {
  New: 0,
  Learning: 1,
  Review: 2,
  Relearning: 3,
} as const

export type SrsState = (typeof SrsState)[keyof typeof SrsState]

export function getSrsStateLabel(state: SrsState): string {
  switch (state) {
    case SrsState.New:
      return "New"
    case SrsState.Learning:
      return "Learning"
    case SrsState.Review:
      return "Review"
    case SrsState.Relearning:
      return "Relearning"
    default:
      return "Unknown"
  }
}
