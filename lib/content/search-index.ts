import { slugify } from "./slug"
import type {
  CompanySearchItem,
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
    haystack: buildHaystack([
      solution.title,
      solution.topic,
      solution.subtopic,
      solution.difficulty,
      solution.slug,
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
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean)
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

export function searchIndex(
  index: SearchIndex,
  query: string,
  limits: Partial<typeof DEFAULT_LIMITS> = {},
): SearchResults {
  const caps = { ...DEFAULT_LIMITS, ...limits }
  const tokens = tokenizeQuery(query)

  if (tokens.length === 0) {
    return {
      companies: [],
      topics: [],
      problems: index.problems.slice(0, caps.problems),
    }
  }

  const companies = index.companies
    .filter((item) => matchesHaystack(item.haystack, tokens))
    .slice(0, caps.companies)

  const topics = index.topics
    .filter((item) => matchesHaystack(item.haystack, tokens))
    .slice(0, caps.topics)

  const firstToken = tokens[0]
  const problems = index.problems
    .filter((item) => matchesHaystack(item.haystack, tokens))
    .sort((left, right) => {
      const leftPrefix = left.title.toLowerCase().startsWith(firstToken) ? 0 : 1
      const rightPrefix = right.title.toLowerCase().startsWith(firstToken) ? 0 : 1

      if (leftPrefix !== rightPrefix) {
        return leftPrefix - rightPrefix
      }

      return left.title.localeCompare(right.title)
    })
    .slice(0, caps.problems)

  return { companies, topics, problems }
}
