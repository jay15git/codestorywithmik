import { readFileSync } from "node:fs"
import path from "node:path"

import type { Difficulty, SolutionMeta } from "./types"

const PROBLEM_DIFFICULTIES_PATH = "lib/content/problem-difficulties.json"

const EASY_SUBTOPIC_PATTERN =
  /(^easy$|leetcode easy|easy tagged|\/ easy\b|\/ easy$)/i

let cachedDifficultyMap: Map<string, Difficulty> | null = null

export function normalizeDifficulty(value: string | null | undefined): Difficulty | null {
  if (!value) {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (normalized === "easy" || normalized === "school" || normalized === "basic") {
    return "Easy"
  }
  if (normalized === "medium") {
    return "Medium"
  }
  if (normalized === "hard") {
    return "Hard"
  }

  return null
}

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

  const filePath = path.join(process.cwd(), PROBLEM_DIFFICULTIES_PATH)
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as Record<string, Difficulty>
  cachedDifficultyMap = new Map(Object.entries(raw))
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
