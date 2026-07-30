import { parseDifficultyParam } from "@/lib/content/filter-solutions"
import { parsePrepPack, type PrepPack } from "@/lib/content/prep-packs"
import type { SolutionLanguage } from "@/lib/content/solution-languages"
import type { Difficulty, SolutionMeta } from "@/lib/content/types"
import { parseLanguageParam } from "@/lib/preferences/language-param"
import { parseStatusFilter } from "@/lib/progress/filters"
import type { StatusFilter } from "@/lib/progress/types"

export type SolutionNavFrom = "topic" | "company" | "pattern" | "plan"

export interface SolutionNavState {
  from: SolutionNavFrom
  topicSlug: string | null
  companySlug: string | null
  patternSlug: string | null
  planSlug: string | null
  difficulty: Difficulty | null
  prep: PrepPack | null
  status: StatusFilter
  lang: SolutionLanguage | null
}

export type SolutionNavHrefParams = {
  from: SolutionNavFrom
  topicSlug?: string | null
  companySlug?: string | null
  patternSlug?: string | null
  planSlug?: string | null
  difficulty?: Difficulty | null
  prep?: PrepPack | null
  status?: StatusFilter | null
  lang?: SolutionLanguage | string | null
}

export function parseSolutionNavParams(searchParams: {
  from?: string
  topic?: string
  company?: string
  pattern?: string
  plan?: string
  difficulty?: string
  prep?: string
  status?: string
  lang?: string
}): SolutionNavState | null {
  const from =
    searchParams.from === "topic" ||
    searchParams.from === "company" ||
    searchParams.from === "pattern" ||
    searchParams.from === "plan"
      ? searchParams.from
      : null

  if (!from) {
    return null
  }

  const topicSlug = searchParams.topic?.trim() || null
  const companySlug = searchParams.company?.trim() || null
  const patternSlug = searchParams.pattern?.trim() || null
  const planSlug = searchParams.plan?.trim() || null

  if (from === "topic" && !topicSlug) {
    return null
  }

  if (from === "company" && !companySlug) {
    return null
  }

  if (from === "pattern" && !patternSlug) {
    return null
  }

  if (from === "plan" && !planSlug) {
    return null
  }

  return {
    from,
    topicSlug,
    companySlug,
    patternSlug,
    planSlug,
    difficulty: parseDifficultyParam(searchParams.difficulty),
    prep: parsePrepPack(searchParams.prep),
    status: parseStatusFilter(searchParams.status),
    lang: parseLanguageParam(searchParams.lang),
  }
}

export function buildSolutionHref(
  slug: string,
  params: SolutionNavHrefParams = { from: "topic" },
): string {
  const query = new URLSearchParams()

  if (params.from) {
    query.set("from", params.from)
  }

  if (params.topicSlug) {
    query.set("topic", params.topicSlug)
  }

  if (params.companySlug) {
    query.set("company", params.companySlug)
  }

  if (params.patternSlug) {
    query.set("pattern", params.patternSlug)
  }

  if (params.planSlug) {
    query.set("plan", params.planSlug)
  }

  if (params.difficulty) {
    query.set("difficulty", params.difficulty)
  }

  if (params.prep) {
    query.set("prep", params.prep)
  }

  if (params.status && params.status !== "all") {
    query.set("status", params.status)
  }

  if (params.lang) {
    query.set("lang", params.lang)
  }

  const search = query.toString()
  return search ? `/solutions/${slug}?${search}` : `/solutions/${slug}`
}

export function navStateToHrefParams(
  nav: SolutionNavState,
): SolutionNavHrefParams {
  return {
    from: nav.from,
    topicSlug: nav.topicSlug,
    companySlug: nav.companySlug,
    patternSlug: nav.patternSlug,
    planSlug: nav.planSlug,
    difficulty: nav.difficulty,
    prep: nav.prep,
    status: nav.status,
    lang: nav.lang,
  }
}

export function listFiltersToNavParams(
  from: SolutionNavFrom,
  filters: {
    topicSlug?: string | null
    companySlug?: string | null
    patternSlug?: string | null
    planSlug?: string | null
    difficulty?: Difficulty | null
    prep?: PrepPack | null
    status?: StatusFilter | null
    lang?: SolutionLanguage | null
  },
): SolutionNavHrefParams {
  return {
    from,
    topicSlug: filters.topicSlug ?? null,
    companySlug: filters.companySlug ?? null,
    patternSlug: filters.patternSlug ?? null,
    planSlug: filters.planSlug ?? null,
    difficulty: filters.difficulty ?? null,
    prep: filters.prep ?? null,
    status: filters.status ?? null,
    lang: filters.lang ?? null,
  }
}

export function findNeighbors(
  solutions: SolutionMeta[],
  currentSlug: string,
): { prev: SolutionMeta | null; next: SolutionMeta | null } {
  const index = solutions.findIndex((solution) => solution.slug === currentSlug)
  if (index === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: index > 0 ? solutions[index - 1] : null,
    next: index < solutions.length - 1 ? solutions[index + 1] : null,
  }
}
