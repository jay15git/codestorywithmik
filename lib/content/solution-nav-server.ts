import { filterSolutions } from "@/lib/content/filter-solutions"
import {
  getCompanyName,
  getSolutions,
  getSolutionsByCompany,
  getSolutionsByTopic,
} from "@/lib/content/get-content"
import { applyPrepPack } from "@/lib/content/prep-packs"
import {
  getPattern,
  getSolutionsForPattern,
} from "@/lib/content/patterns"
import type { SolutionNavState } from "@/lib/content/solution-nav"
import {
  getStudyPlan,
  getSolutionsForStudyPlan,
} from "@/lib/content/study-plans"
import type { SolutionMeta } from "@/lib/content/types"

/** Build ordered list for prev/next (status applied client-side). Server-only. */
export function getSolutionsForNav(
  nav: SolutionNavState | null,
  fallbackTopicSlug: string,
): SolutionMeta[] {
  if (nav?.from === "plan" && nav.planSlug) {
    const plan = getStudyPlan(nav.planSlug)
    if (!plan) {
      return []
    }
    return getSolutionsForStudyPlan(plan, getSolutions())
  }

  if (nav?.from === "pattern" && nav.patternSlug) {
    const pattern = getPattern(nav.patternSlug)
    if (!pattern) {
      return []
    }
    return getSolutionsForPattern(pattern, getSolutions())
  }

  if (nav?.from === "company" && nav.companySlug) {
    const all = getSolutionsByCompany(nav.companySlug)
    const filtered = filterSolutions(all, {
      difficulty: nav.difficulty,
      companySlug: null,
      topicSlug: nav.topicSlug,
    })
    const companyName = getCompanyName(nav.companySlug) ?? nav.companySlug

    return applyPrepPack(filtered, companyName, nav.prep)
  }

  const topicSlug = nav?.topicSlug ?? fallbackTopicSlug
  const all = getSolutionsByTopic(topicSlug)
  return filterSolutions(all, {
    difficulty: nav?.difficulty ?? null,
    companySlug: nav?.companySlug ?? null,
    topicSlug: null,
  })
}
