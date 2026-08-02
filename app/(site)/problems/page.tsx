import type { Metadata } from "next"

import { FilteredCount } from "@/components/filtered-count"
import { PageHeader } from "@/components/page-header"
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
  title: "All Problems",
  description:
    "Browse every indexed LeetCode solution. Filter by topic, company, difficulty, and sort.",
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

export default async function ProblemsPage({
  searchParams,
}: ProblemsPageProps) {
  const filters = parseListSearchParams(await searchParams)
  const allSolutions = getSolutions()
  const companyOptions = getCompanyOptions(allSolutions)
  const topicOptions = getTopicOptions(allSolutions)
  const solutions = sortSolutions(
    filterSolutions(allSolutions, filters),
    filters.sort
  )
  const basePath = "/problems"

  return (
    <SolutionViewProvider>
      <div className="flex flex-col gap-8">
        <PageHeader
          title="All problems"
          actions={
            <>
              <RandomProblemButton solutions={solutions} />
              <SolutionViewToggle />
            </>
          }
        >
            <FilteredCount
              solutions={solutions}
              statuses={filters.statuses}
              tagIds={filters.tagIds}
              ofTotal={allSolutions.length}
            />
        </PageHeader>

        <SolutionFilters
          basePath={basePath}
          filters={filters}
          companies={companyOptions}
          topics={topicOptions}
          showSort
          showColumns
        />

        <StatusAwareSolutionList
          solutions={solutions}
          statuses={filters.statuses}
          tagIds={filters.tagIds}
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
