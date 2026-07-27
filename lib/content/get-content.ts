import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import contentIndexJson from "@/generated/content-index.json"
import { GENERATED_SOLUTIONS_PATH } from "./constants"
import {
  getProblemDifficultyMap,
  resolveSolutionDifficulty,
} from "./difficulty"
import { splitCodeBlocks } from "./parse-solution"
import { slugify } from "./slug"
import type {
  ContentIndex,
  Difficulty,
  Solution,
  SolutionMeta,
  Topic,
} from "./types"

let cachedDifficultyMap: Map<string, Difficulty> | null = null

function getDifficultyMapForRuntime(): Map<string, Difficulty> {
  if (cachedDifficultyMap) {
    return cachedDifficultyMap
  }

  cachedDifficultyMap = getProblemDifficultyMap()
  return cachedDifficultyMap
}

function withResolvedDifficulty(solution: SolutionMeta): SolutionMeta {
  if (solution.difficulty) {
    return solution
  }

  return {
    ...solution,
    difficulty: resolveSolutionDifficulty(solution, getDifficultyMapForRuntime()),
  }
}

function normalizeIndex(index: ContentIndex): ContentIndex {
  return {
    ...index,
    solutions: index.solutions.map(withResolvedDifficulty),
  }
}

const normalizedIndex = normalizeIndex(contentIndexJson as ContentIndex)

export function getContentIndex(): ContentIndex {
  return normalizedIndex
}

export function getTopics(): Topic[] {
  return getContentIndex().topics
}

export function getTopic(slug: string): Topic | undefined {
  return getTopics().find((topic) => topic.slug === slug)
}

export function getSolutions(): SolutionMeta[] {
  return getContentIndex().solutions
}

export function getSolutionMeta(slug: string): SolutionMeta | undefined {
  return getSolutions().find((solution) => solution.slug === slug)
}

export function getSolution(slug: string): Solution | undefined {
  const meta = getSolutionMeta(slug)
  if (!meta) {
    return undefined
  }

  const solutionPath = path.join(
    process.cwd(),
    GENERATED_SOLUTIONS_PATH,
    `${slug}.cpp`,
  )

  if (!existsSync(solutionPath)) {
    return undefined
  }

  const rawContent = readFileSync(solutionPath, "utf8")
  const code = splitCodeBlocks(rawContent)

  return {
    ...meta,
    rawContent,
    code,
  }
}

export function getSolutionsByTopic(topicSlug: string): SolutionMeta[] {
  return getSolutions().filter((solution) => solution.topicSlug === topicSlug)
}

export function getSolutionsByCompany(companySlug: string): SolutionMeta[] {
  return getSolutions().filter((solution) =>
    solution.companyTags.some((tag) => slugify(tag) === companySlug),
  )
}

export function getCompanyName(companySlug: string): string | undefined {
  const index = getContentIndex()
  return index.companies.find((company) => slugify(company) === companySlug)
}

export function getCompanies(): string[] {
  return getContentIndex().companies
}
