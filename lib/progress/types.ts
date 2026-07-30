export type ProgressFlag = "solved"

export type StatusFilter = "all" | "solved" | "unsolved"

export interface SolutionProgressEntry {
  solved?: boolean
}

export type SolutionProgressMap = Record<string, SolutionProgressEntry>

export interface ProgressCounts {
  solved: number
  totalTracked: number
}
