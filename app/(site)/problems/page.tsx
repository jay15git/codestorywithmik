import type { Metadata } from "next"

import { FilteredCount } from "@/components/filtered-count"
import { RandomProblemButton } from "@/components/random-problem-button"
import { SolutionFilters } from "@/components/solution-filters"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import { StatusAwareSolutionList } from "@/components/status-aware-solution-list"
import {
  filterSolutions,
  getCompanyOptions,
  getTopicOptions,
  parseListSearchParams,
  sortSolutions,
} from "@/lib/content/filter-solutions"
import { getSolutions } from "@/lib/content/get-content"

export const metadata: Metadata = {
  title: "All Problems — LeetSeek",
  description:
    "Browse every indexed LeetCode solution. Filter by topic, company, difficulty, and sort the list.",
}

interface ProblemsPageProps {
  searchParams: Promise<{
    difficulty?: string
    company?: string
    topic?: string
    page?: string
    status?: string
    sort?: string
  }>
}

export default async function ProblemsPage({ searchParams }: ProblemsPageProps) {
  const filters = parseListSearchParams(await searchParams)
  const allSolutions = getSolutions()
  const companyOptions = getCompanyOptions(allSolutions)
  const topicOptions = getTopicOptions(allSolutions)
  const solutions = sortSolutions(
    filterSolutions(allSolutions, filters),
    filters.sort,
  )
  const basePath = "/problems"

  return (
    <SolutionViewProvider>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              All problems
            </h1>
            <FilteredCount
              solutions={solutions}
              statuses={filters.statuses}
              ofTotal={allSolutions.length}
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <RandomProblemButton solutions={solutions} />
            <SolutionViewToggle />
          </div>
        </div>

        <SolutionFilters
          basePath={basePath}
          filters={filters}
          companies={companyOptions}
          topics={topicOptions}
          showSort
        />

        <StatusAwareSolutionList
          solutions={solutions}
          statuses={filters.statuses}
          basePath={basePath}
          page={filters.page}
          query={{
            difficulties: filters.difficulties,
            companySlugs: filters.companySlugs,
            topicSlugs: filters.topicSlugs,
            sort: filters.sort,
          }}
        />
      </div>
    </SolutionViewProvider>
  )
}
