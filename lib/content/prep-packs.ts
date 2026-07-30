import { companySlug } from "@/lib/content/slug"
import type { Difficulty, SolutionMeta } from "@/lib/content/types"

export const PREP_PACK_VALUES = ["top25", "top50", "top75"] as const

export type PrepPack = (typeof PREP_PACK_VALUES)[number]

const PREP_PACK_SIZES: Record<PrepPack, number> = {
  top25: 25,
  top50: 50,
  top75: 75,
}

const PREP_PACK_LABELS: Record<PrepPack, string> = {
  top25: "Top 25",
  top50: "Top 50",
  top75: "Top 75",
}

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
}

export function parsePrepPack(value: string | undefined): PrepPack | null {
  if (!value) {
    return null
  }

  return PREP_PACK_VALUES.includes(value as PrepPack)
    ? (value as PrepPack)
    : null
}

export function prepPackLabel(pack: PrepPack): string {
  return PREP_PACK_LABELS[pack]
}

export function prepPackSize(pack: PrepPack): number {
  return PREP_PACK_SIZES[pack]
}

function companyFrequency(
  solution: SolutionMeta,
  companyName: string,
): number {
  const byName = solution.companyFrequencies?.[companyName]
  if (typeof byName === "number") {
    return byName
  }

  const slug = companySlug(companyName)
  const bySlug = solution.companyFrequencies?.[slug]
  return typeof bySlug === "number" ? bySlug : 0
}

function compareForPrepPack(
  left: SolutionMeta,
  right: SolutionMeta,
  companyName: string,
): number {
  const freqDiff =
    companyFrequency(right, companyName) - companyFrequency(left, companyName)
  if (freqDiff !== 0) {
    return freqDiff
  }

  const leftDiff = left.difficulty ? DIFFICULTY_RANK[left.difficulty] : 99
  const rightDiff = right.difficulty ? DIFFICULTY_RANK[right.difficulty] : 99
  if (leftDiff !== rightDiff) {
    return leftDiff - rightDiff
  }

  const leftId = left.leetcodeId ?? Number.MAX_SAFE_INTEGER
  const rightId = right.leetcodeId ?? Number.MAX_SAFE_INTEGER
  if (leftId !== rightId) {
    return leftId - rightId
  }

  return left.title.localeCompare(right.title)
}

export function applyPrepPack(
  solutions: SolutionMeta[],
  companyName: string,
  pack: PrepPack | null,
): SolutionMeta[] {
  if (!pack) {
    return solutions
  }

  return [...solutions]
    .sort((left, right) => compareForPrepPack(left, right, companyName))
    .slice(0, prepPackSize(pack))
}
