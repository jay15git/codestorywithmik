import { companySlug } from "@/lib/content/slug"
import type { Difficulty, SolutionMeta } from "@/lib/content/types"

export const DIFFICULTY_VALUES = ["Easy", "Medium", "Hard"] as const satisfies readonly Difficulty[]

export interface ListFilterState {
  difficulty: Difficulty | null
  companySlug: string | null
  page: number
}

export interface ListHrefParams {
  difficulty?: Difficulty | null
  companySlug?: string | null
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
  page?: string
}): ListFilterState {
  return {
    difficulty: parseDifficultyParam(searchParams.difficulty),
    companySlug: searchParams.company?.trim() || null,
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
