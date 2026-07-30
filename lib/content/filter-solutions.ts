import { companySlug } from "@/lib/content/slug"
import {
  parsePrepPack,
  type PrepPack,
} from "@/lib/content/prep-packs"
import type { Difficulty, SolutionMeta } from "@/lib/content/types"
import {
  parseStatusFilter,
} from "@/lib/progress/store"
import type { StatusFilter } from "@/lib/progress/types"

export const LIST_PAGE_SIZE = 48

export const DIFFICULTY_VALUES = ["Easy", "Medium", "Hard"] as const satisfies readonly Difficulty[]

export interface ListFilterState {
  difficulty: Difficulty | null
  companySlug: string | null
  prep: PrepPack | null
  status: StatusFilter
  page: number
}

export interface ListHrefParams {
  difficulty?: Difficulty | null
  companySlug?: string | null
  prep?: PrepPack | null
  status?: StatusFilter | null
  page?: number
}

export function parseDifficultyParam(value: string | undefined): Difficulty | null {
  if (!value) {
    return null
  }

  return DIFFICULTY_VALUES.includes(value as Difficulty)
    ? (value as Difficulty)
    : null
}

export function parseListSearchParams(searchParams: {
  difficulty?: string
  company?: string
  prep?: string
  status?: string
  page?: string
}): ListFilterState {
  return {
    difficulty: parseDifficultyParam(searchParams.difficulty),
    companySlug: searchParams.company?.trim() || null,
    prep: parsePrepPack(searchParams.prep),
    status: parseStatusFilter(searchParams.status),
    page: Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1),
  }
}

export function buildListHref(basePath: string, params: ListHrefParams = {}): string {
  const query = new URLSearchParams()

  if (params.difficulty) {
    query.set("difficulty", params.difficulty)
  }

  if (params.companySlug) {
    query.set("company", params.companySlug)
  }

  if (params.prep) {
    query.set("prep", params.prep)
  }

  if (params.status && params.status !== "all") {
    query.set("status", params.status)
  }

  if (params.page && params.page > 1) {
    query.set("page", String(params.page))
  }

  const search = query.toString()
  return search ? `${basePath}?${search}` : basePath
}

export function filterSolutions(
  solutions: SolutionMeta[],
  filters: Pick<ListFilterState, "difficulty" | "companySlug">,
): SolutionMeta[] {
  const { difficulty, companySlug: companyFilterSlug } = filters

  if (!difficulty && !companyFilterSlug) {
    return solutions
  }

  return solutions.filter((solution) => {
    if (difficulty && solution.difficulty !== difficulty) {
      return false
    }

    if (
      companyFilterSlug &&
      !solution.companyTags.some((tag) => companySlug(tag) === companyFilterSlug)
    ) {
      return false
    }

    return true
  })
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
