export type ProgressFlag = "solved" | "starred" | "revisit"

export type StatusFilter =
  | "all"
  | "solved"
  | "unsolved"
  | "starred"
  | "revisit"

export interface SolutionProgressEntry {
  solved?: boolean
  starred?: boolean
  revisit?: boolean
}

export type SolutionProgressMap = Record<string, SolutionProgressEntry>

export interface ProgressCounts {
  solved: number
  starred: number
  revisit: number
  totalTracked: number
}
