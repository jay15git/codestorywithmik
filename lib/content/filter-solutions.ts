import { companySlug, topicSlugFromName } from "@/lib/content/slug"
import type { PrepPack } from "@/lib/content/prep-packs"
import { parsePrepPack } from "@/lib/content/prep-packs"
import type { Difficulty, SolutionMeta } from "@/lib/content/types"
import { parseStatusFilters, type StatusFilterValue } from "@/lib/progress/filters"
import type { StatusFilter } from "@/lib/progress/types"
import { parseTagFilters } from "@/lib/tags/filters"

export const LIST_PAGE_SIZE = 48

export const DIFFICULTY_VALUES = [
  "Easy",
  "Medium",
  "Hard",
] as const satisfies readonly Difficulty[]

export const LIST_SORT_VALUES = [
  "id",
  "title",
  "difficulty",
] as const

export type ListSort = (typeof LIST_SORT_VALUES)[number]

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
}

export interface ListFilterState {
  difficulties: Difficulty[]
  companySlugs: string[]
  topicSlugs: string[]
  prep: PrepPack | null
  statuses: StatusFilterValue[]
  tagIds: string[]
  page: number
  sort: ListSort
}

export interface ListHrefParams {
  difficulties?: Difficulty[] | null
  companySlugs?: string[] | null
  topicSlugs?: string[] | null
  prep?: PrepPack | null
  statuses?: StatusFilterValue[] | null
  tagIds?: string[] | null
  /** @deprecated Prefer `statuses`. Kept for single-status callers. */
  status?: StatusFilter | null
  page?: number
  sort?: ListSort | null
}

function splitParam(value: string | undefined): string[] {
  if (!value) {
    return []
  }

  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

export function parseDifficultyParam(
  value: string | undefined,
): Difficulty | null {
  const [first] = parseDifficultyList(value)
  return first ?? null
}

export function parseDifficultyList(value: string | undefined): Difficulty[] {
  const seen = new Set<Difficulty>()
  for (const part of splitParam(value)) {
    if (DIFFICULTY_VALUES.includes(part as Difficulty)) {
      seen.add(part as Difficulty)
    }
  }
  return [...seen]
}

export function parseSlugList(value: string | undefined): string[] {
  const seen = new Set<string>()
  for (const part of splitParam(value)) {
    if (!seen.has(part)) {
      seen.add(part)
    }
  }
  return [...seen]
}

export function parseSortParam(value: string | undefined): ListSort {
  if (value && LIST_SORT_VALUES.includes(value as ListSort)) {
    return value as ListSort
  }

  return "id"
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value)
      result.push(value)
    }
  }
  return result
}

export function parseProgressListParams(searchParams: {
  status?: string
  tag?: string
}): {
  statuses: StatusFilterValue[]
  tagIds: string[]
} {
  return {
    statuses: parseStatusFilters(searchParams.status),
    tagIds: uniqueStrings(parseTagFilters(searchParams.tag)),
  }
}

export function parseListSearchParams(searchParams: {
  difficulty?: string
  company?: string
  topic?: string
  lang?: string
  prep?: string
  status?: string
  tag?: string
  page?: string
  sort?: string
}): ListFilterState {
  const progress = parseProgressListParams(searchParams)

  return {
    difficulties: parseDifficultyList(searchParams.difficulty),
    companySlugs: parseSlugList(searchParams.company),
    topicSlugs: parseSlugList(searchParams.topic),
    prep: parsePrepPack(searchParams.prep),
    statuses: progress.statuses,
    tagIds: progress.tagIds,
    page: Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1),
    sort: parseSortParam(searchParams.sort),
  }
}

function setCsvParam(
  query: URLSearchParams,
  key: string,
  values: string[] | null | undefined,
) {
  if (values && values.length > 0) {
    query.set(key, values.join(","))
  }
}

export function buildListHref(
  basePath: string,
  params: ListHrefParams = {},
): string {
  const query = new URLSearchParams()

  setCsvParam(query, "difficulty", params.difficulties ?? undefined)
  setCsvParam(query, "company", params.companySlugs ?? undefined)
  setCsvParam(query, "topic", params.topicSlugs ?? undefined)

  if (params.prep) {
    query.set("prep", params.prep)
  }

  const statuses =
    params.statuses ??
    (params.status && params.status !== "all" ? [params.status] : [])
  setCsvParam(query, "status", statuses)

  setCsvParam(query, "tag", params.tagIds ?? undefined)

  if (params.sort && params.sort !== "id") {
    query.set("sort", params.sort)
  }

  if (params.page && params.page > 1) {
    query.set("page", String(params.page))
  }

  const search = query.toString()
  return search ? `${basePath}?${search}` : basePath
}

export function filterSolutions(
  solutions: SolutionMeta[],
  filters: {
    difficulties?: Difficulty[] | null
    companySlugs?: string[] | null
    topicSlugs?: string[] | null
    /** @deprecated Prefer `difficulties`. */
    difficulty?: Difficulty | null
    /** @deprecated Prefer `companySlugs`. */
    companySlug?: string | null
    /** @deprecated Prefer `topicSlugs`. */
    topicSlug?: string | null
  },
): SolutionMeta[] {
  const difficulties =
    filters.difficulties ??
    (filters.difficulty ? [filters.difficulty] : [])
  const companyFilterSlugs =
    filters.companySlugs ??
    (filters.companySlug ? [filters.companySlug] : [])
  const topicFilterSlugs =
    filters.topicSlugs ?? (filters.topicSlug ? [filters.topicSlug] : [])

  if (
    difficulties.length === 0 &&
    companyFilterSlugs.length === 0 &&
    topicFilterSlugs.length === 0
  ) {
    return solutions
  }

  const companySet = new Set(companyFilterSlugs)
  const topicSet = new Set(topicFilterSlugs)
  const difficultySet = new Set(difficulties)

  return solutions.filter((solution) => {
    if (
      difficultySet.size > 0 &&
      (!solution.difficulty || !difficultySet.has(solution.difficulty))
    ) {
      return false
    }

    if (
      companySet.size > 0 &&
      !solution.companyTags.some((tag) => companySet.has(companySlug(tag)))
    ) {
      return false
    }

    if (
      topicSet.size > 0 &&
      !(
        (solution.topicSlug && topicSet.has(solution.topicSlug)) ||
        solution.topicTags.some((tag) =>
          topicSet.has(topicSlugFromName(tag)),
        )
      )
    ) {
      return false
    }

    return true
  })
}

export function sortSolutions(
  solutions: SolutionMeta[],
  sort: ListSort,
): SolutionMeta[] {
  const copy = [...solutions]

  copy.sort((left, right) => {
    if (sort === "title") {
      return left.title.localeCompare(right.title)
    }

    if (sort === "difficulty") {
      const leftDiff = left.difficulty ? DIFFICULTY_RANK[left.difficulty] : 99
      const rightDiff = right.difficulty
        ? DIFFICULTY_RANK[right.difficulty]
        : 99
      if (leftDiff !== rightDiff) {
        return leftDiff - rightDiff
      }
    }

    const leftId = left.leetcodeId ?? Number.MAX_SAFE_INTEGER
    const rightId = right.leetcodeId ?? Number.MAX_SAFE_INTEGER
    if (leftId !== rightId) {
      return leftId - rightId
    }

    return left.title.localeCompare(right.title)
  })

  return copy
}

export function getCompanyOptions(
  solutions: SolutionMeta[],
): Array<{ slug: string; name: string }> {
  const bySlug = new Map<string, string>()

  for (const solution of solutions) {
    for (const company of solution.companyTags) {
      const slug = companySlug(company)
      if (!bySlug.has(slug)) {
        bySlug.set(slug, company)
      }
    }
  }

  return [...bySlug.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function getTopicOptions(
  solutions: SolutionMeta[],
): Array<{ slug: string; name: string }> {
  const bySlug = new Map<string, string>()

  for (const solution of solutions) {
    for (const tag of solution.topicTags) {
      const slug = topicSlugFromName(tag)
      if (!bySlug.has(slug)) {
        bySlug.set(slug, tag)
      }
    }
  }

  return [...bySlug.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

export function formatMultiLabel(
  values: string[],
  emptyLabel: string,
  labels?: Map<string, string> | Record<string, string>,
): string {
  if (values.length === 0) {
    return emptyLabel
  }

  const resolve = (value: string) => {
    if (!labels) return value
    if (labels instanceof Map) return labels.get(value) ?? value
    return labels[value] ?? value
  }

  if (values.length === 1) {
    return resolve(values[0])
  }

  return `${resolve(values[0])} +${values.length - 1}`
}
