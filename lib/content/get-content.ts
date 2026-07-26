import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

import {
  CONTENT_REPO_SLUG,
  GENERATED_INDEX_PATH,
  GENERATED_SOLUTIONS_PATH,
} from "./constants"
import {
  parseCompanyTags,
  parseLeetcodeUrl,
  parseSpaceComplexity,
  parseTimeComplexity,
  parseYoutubeUrl,
  splitCodeBlocks,
} from "./parse-solution"
import { slugify, slugifyParts, topicSlugFromName } from "./slug"
import {
  getProblemDifficultyMap,
  resolveSolutionDifficulty,
} from "./difficulty"
import type {
  ContentIndex,
  Difficulty,
  Solution,
  SolutionMeta,
  Topic,
} from "./types"

let cachedIndex: ContentIndex | null = null
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

function getIndexPath(): string {
  return path.join(process.cwd(), GENERATED_INDEX_PATH)
}

export function getContentIndex(): ContentIndex {
  const indexPath = getIndexPath()

  if (!existsSync(indexPath)) {
    throw new Error(
      `Content index not found at ${indexPath}. Run "npm run sync-content" first.`,
    )
  }

  if (process.env.NODE_ENV === "production" && cachedIndex) {
    return cachedIndex
  }

  const index = normalizeIndex(
    JSON.parse(readFileSync(indexPath, "utf8")) as ContentIndex,
  )

  if (process.env.NODE_ENV === "production") {
    cachedIndex = index
  }

  return index
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

export function getSearchDocuments() {
  return getSolutions().map((solution) => ({
    slug: solution.slug,
    title: solution.title,
    topic: solution.topic,
    subtopic: solution.subtopic,
    companies: solution.companyTags.join(" "),
    leetcodeSlug: solution.leetcodeUrl
      ? solution.leetcodeUrl.match(/leetcode\.com\/problems\/([^/?#]+)/i)?.[1] ??
        null
      : null,
    difficulty: solution.difficulty,
  }))
}

export function buildGithubUrl(relativePath: string): string {
  const index = getContentIndex()
  return `https://github.com/${CONTENT_REPO_SLUG}/blob/${index.upstreamSha}/${relativePath}`
}
