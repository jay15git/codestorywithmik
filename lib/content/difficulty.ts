import problemDifficultiesJson from "./problem-difficulties.json"
import type { Difficulty, SolutionMeta } from "./types"

const EASY_SUBTOPIC_PATTERN =
  /(^easy$|leetcode easy|easy tagged|\/ easy\b|\/ easy$)/i

let cachedDifficultyMap: Map<string, Difficulty> | null = null

export function inferDifficultyFromSubtopic(
  subtopic: string | null,
): Difficulty | null {
  if (!subtopic || !EASY_SUBTOPIC_PATTERN.test(subtopic)) {
    return null
  }

  return "Easy"
}

export function getProblemDifficultyMap(): Map<string, Difficulty> {
  if (cachedDifficultyMap) {
    return cachedDifficultyMap
  }

  cachedDifficultyMap = new Map(
    Object.entries(problemDifficultiesJson as Record<string, Difficulty>),
  )
  return cachedDifficultyMap
}

export function resolveSolutionDifficulty(
  solution: Pick<SolutionMeta, "slug" | "subtopic">,
  difficultyMap: Map<string, Difficulty>,
): Difficulty | null {
  const stored = difficultyMap.get(solution.slug)
  if (stored) {
    return stored
  }

  return inferDifficultyFromSubtopic(solution.subtopic)
}
