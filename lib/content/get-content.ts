import contentIndexJson from "@/generated/content-index.json"
import { slugify, topicSlugFromName } from "./slug"
import type {
  ContentIndex,
  SolutionMeta,
  Topic,
} from "./types"

const normalizedIndex = contentIndexJson as ContentIndex
const solutionBySlug = new Map(
  normalizedIndex.solutions.map((solution) => [solution.slug, solution]),
)
const topicBySlug = new Map(
  normalizedIndex.topics.map((topic) => [topic.slug, topic]),
)
const companyBySlug = new Map(
  normalizedIndex.companies.map((company) => [slugify(company), company]),
)

export function getContentIndex(): ContentIndex {
  return normalizedIndex
}

export function getTopics(): Topic[] {
  return getContentIndex().topics
}

export function getTopic(slug: string): Topic | undefined {
  return topicBySlug.get(slug)
}

export function getSolutions(): SolutionMeta[] {
  return getContentIndex().solutions
}

export function getSolutionMeta(slug: string): SolutionMeta | undefined {
  return solutionBySlug.get(slug)
}

export function getSolutionsByTopic(topicSlug: string): SolutionMeta[] {
  return getSolutions().filter((solution) => {
    if (solution.topicSlug === topicSlug) {
      return true
    }

    return solution.topicTags.some(
      (tag) => topicSlugFromName(tag) === topicSlug,
    )
  })
}

export function getSolutionsByCompany(companySlug: string): SolutionMeta[] {
  return getSolutions().filter((solution) =>
    solution.companyTags.some((tag) => slugify(tag) === companySlug),
  )
}

export function getCompanyName(companySlug: string): string | undefined {
  return companyBySlug.get(companySlug)
}

export function getCompanies(): string[] {
  return getContentIndex().companies
}
