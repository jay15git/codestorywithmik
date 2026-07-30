import type { SolutionMeta } from "@/lib/content/types"

function overlapCount(left: string[], right: Set<string>): number {
  let count = 0
  for (const item of left) {
    if (right.has(item)) {
      count += 1
    }
  }
  return count
}

export function scoreRelatedSolution(
  current: SolutionMeta,
  candidate: SolutionMeta,
): number {
  if (candidate.slug === current.slug) {
    return 0
  }

  const topicSet = new Set(current.topicTags)
  const companySet = new Set(current.companyTags)

  const topicScore = overlapCount(candidate.topicTags, topicSet) * 3
  const companyScore = overlapCount(candidate.companyTags, companySet)

  if (topicScore === 0 && companyScore === 0) {
    return 0
  }

  const difficultyBonus =
    current.difficulty && candidate.difficulty === current.difficulty ? 1 : 0

  return topicScore + companyScore + difficultyBonus
}

export function getRelatedSolutions(
  current: SolutionMeta,
  all: SolutionMeta[],
  limit = 6,
): SolutionMeta[] {
  return all
    .map((candidate) => ({
      candidate,
      score: scoreRelatedSolution(current, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      const leftId = left.candidate.leetcodeId ?? Number.MAX_SAFE_INTEGER
      const rightId = right.candidate.leetcodeId ?? Number.MAX_SAFE_INTEGER
      if (leftId !== rightId) {
        return leftId - rightId
      }

      return left.candidate.title.localeCompare(right.candidate.title)
    })
    .slice(0, limit)
    .map((entry) => entry.candidate)
}
