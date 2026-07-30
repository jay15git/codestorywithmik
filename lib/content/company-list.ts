import { companySlug } from "@/lib/content/slug"
import type { SolutionMeta } from "@/lib/content/types"

export type CompanySort = "name" | "frequency"

export interface CompanyListItem {
  name: string
  slug: string
  problemCount: number
  /** Sum of per-problem interview frequency % for this company. */
  frequencyScore: number
}

export function parseCompanySort(value: string | undefined): CompanySort {
  return value === "frequency" ? "frequency" : "name"
}

export function buildCompanyList(
  solutions: SolutionMeta[],
  companyNames: string[],
): CompanyListItem[] {
  const bySlug = new Map<string, CompanyListItem>()

  for (const name of companyNames) {
    const slug = companySlug(name)
    bySlug.set(slug, {
      name,
      slug,
      problemCount: 0,
      frequencyScore: 0,
    })
  }

  for (const solution of solutions) {
    for (const company of solution.companyTags) {
      const slug = companySlug(company)
      let entry = bySlug.get(slug)
      if (!entry) {
        entry = {
          name: company,
          slug,
          problemCount: 0,
          frequencyScore: 0,
        }
        bySlug.set(slug, entry)
      }

      entry.problemCount += 1
      const freq =
        solution.companyFrequencies?.[company] ??
        solution.companyFrequencies?.[slug] ??
        0
      entry.frequencyScore += freq
    }
  }

  return [...bySlug.values()]
}

export function sortCompanies(
  companies: CompanyListItem[],
  sort: CompanySort,
): CompanyListItem[] {
  const copy = [...companies]

  if (sort === "frequency") {
    return copy.sort((left, right) => {
      if (right.frequencyScore !== left.frequencyScore) {
        return right.frequencyScore - left.frequencyScore
      }
      if (right.problemCount !== left.problemCount) {
        return right.problemCount - left.problemCount
      }
      return left.name.localeCompare(right.name)
    })
  }

  return copy.sort((left, right) => left.name.localeCompare(right.name))
}
