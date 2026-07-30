import {
  fuzzyTitleScore,
  parseSearchQuery,
} from "@/lib/content/search-query"
import { slugify } from "./slug"
import type {
  CompanySearchItem,
  Difficulty,
  ProblemSearchItem,
  SearchIndex,
  SolutionMeta,
  Topic,
  TopicSearchItem,
} from "./types"

function buildHaystack(parts: Array<string | null | undefined>): string {
  return parts
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase()
}

export function buildSearchIndex(
  solutions: SolutionMeta[],
  topics: Topic[],
): SearchIndex {
  const companyMap = new Map<string, CompanySearchItem>()

  for (const solution of solutions) {
    for (const company of solution.companyTags) {
      const slug = slugify(company)
      const existing = companyMap.get(slug)

      if (existing) {
        existing.count += 1
        continue
      }

      companyMap.set(slug, {
        name: company,
        slug,
        count: 1,
        haystack: company.toLowerCase(),
      })
    }
  }

  const problems: ProblemSearchItem[] = solutions.map((solution) => ({
    slug: solution.slug,
    title: solution.title,
    topic: solution.topic,
    subtopic: solution.subtopic,
    difficulty: solution.difficulty,
    leetcodeId: solution.leetcodeId,
    companyTags: solution.companyTags,
    haystack: buildHaystack([
      solution.title,
      solution.topic,
      solution.subtopic,
      solution.difficulty,
      solution.slug,
      solution.leetcodeId != null ? String(solution.leetcodeId) : null,
      solution.leetcodeId != null ? `#${solution.leetcodeId}` : null,
      ...solution.topicTags,
      ...solution.companyTags,
    ]),
  }))

  const companies = [...companyMap.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  )

  const topicItems: TopicSearchItem[] = topics.map((topic) => ({
    name: topic.name,
    slug: topic.slug,
    count: topic.solutionCount,
    haystack: topic.name.toLowerCase(),
  }))

  return {
    problems,
    companies,
    topics: topicItems,
  }
}

export function tokenizeQuery(query: string): string[] {
  return parseSearchQuery(query).tokens
}

export function matchesHaystack(haystack: string, tokens: string[]): boolean {
  return tokens.every((token) => haystack.includes(token))
}

export interface SearchResults {
  companies: CompanySearchItem[]
  topics: TopicSearchItem[]
  problems: ProblemSearchItem[]
}

const DEFAULT_LIMITS = {
  companies: 5,
  topics: 3,
  problems: 12,
} as const

export type SearchIndexOptions = Partial<typeof DEFAULT_LIMITS> & {
  /** UI chip override for difficulty (wins over query token). */
  difficulty?: Difficulty | null
}

export function searchIndex(
  index: SearchIndex,
  query: string,
  limits: SearchIndexOptions = {},
): SearchResults {
  const caps = { ...DEFAULT_LIMITS, ...limits }
  const parsed = parseSearchQuery(query)
  const difficulty = limits.difficulty ?? parsed.difficulty
  const { tokens, leetcodeId, company } = parsed

  const hasQuery =
    tokens.length > 0 ||
    leetcodeId != null ||
    difficulty != null ||
    Boolean(company)

  if (!hasQuery) {
    return {
      companies: [],
      topics: [],
      problems: index.problems.slice(0, caps.problems),
    }
  }

  const companyNeedle = company?.toLowerCase() ?? null

  const companies = index.companies
    .filter((item) => {
      if (companyNeedle) {
        return (
          item.slug.includes(companyNeedle) ||
          item.haystack.includes(companyNeedle)
        )
      }
      if (tokens.length === 0) {
        return false
      }
      return matchesHaystack(item.haystack, tokens)
    })
    .slice(0, caps.companies)

  const topics = index.topics
    .filter((item) => {
      if (tokens.length === 0) {
        return false
      }
      return matchesHaystack(item.haystack, tokens)
    })
    .slice(0, caps.topics)

  const scored = index.problems
    .map((item) => {
      if (leetcodeId != null && !problemMatchesLeetcodeId(item, leetcodeId)) {
        return null
      }

      if (difficulty && item.difficulty !== difficulty) {
        return null
      }

      if (companyNeedle && !problemMatchesCompany(item, companyNeedle)) {
        return null
      }

      if (tokens.length === 0) {
        return { item, score: leetcodeId != null ? 1000 : 1 }
      }

      if (matchesHaystack(item.haystack, tokens)) {
        const title = item.title.toLowerCase()
        const prefix = title.startsWith(tokens[0]) ? 100 : 0
        return { item, score: 200 + prefix }
      }

      const fuzzy = fuzzyTitleScore(item.title, tokens)
      if (fuzzy < 0) {
        return null
      }

      return { item, score: fuzzy }
    })
    .filter((entry): entry is { item: ProblemSearchItem; score: number } =>
      Boolean(entry),
    )
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }
      return left.item.title.localeCompare(right.item.title)
    })
    .slice(0, caps.problems)
    .map((entry) => entry.item)

  return { companies, topics, problems: scored }
}

function problemMatchesLeetcodeId(
  item: ProblemSearchItem,
  leetcodeId: number,
): boolean {
  if (typeof item.leetcodeId === "number") {
    return item.leetcodeId === leetcodeId
  }

  // Stale index fallback: haystack may include "#121" or bare id token.
  const id = String(leetcodeId)
  const haystack = ` ${item.haystack} `
  return (
    haystack.includes(` #${id} `) ||
    haystack.includes(` ${id} `) ||
    item.slug.startsWith(`${id}-`) ||
    item.title.startsWith(`${id}.`) ||
    item.title.startsWith(`${id} `)
  )
}

function problemMatchesCompany(
  item: ProblemSearchItem,
  companyNeedle: string,
): boolean {
  const tags = item.companyTags
  if (Array.isArray(tags) && tags.length > 0) {
    return tags.some(
      (tag) =>
        slugify(tag).includes(companyNeedle) ||
        tag.toLowerCase().includes(companyNeedle),
    )
  }

  // Stale index fallback: company names live in haystack.
  return item.haystack.includes(companyNeedle)
}
