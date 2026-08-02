import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { FilteredCount } from "@/components/filtered-count"
import { PageHeader } from "@/components/page-header"
import { RandomProblemButton } from "@/components/random-problem-button"
import { SolutionListNavProvider } from "@/components/solution-list-nav-provider"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import { StatusAwareStudyPlanGroups } from "@/components/status-aware-study-plan-groups"
import { StatusFilterDropdown } from "@/components/status-filter-dropdown"
import { TagFilterDropdown } from "@/components/tag-filter-dropdown"
import { parseProgressListParams } from "@/lib/content/filter-solutions"
import { getSolutions } from "@/lib/content/get-content"
import { listFiltersToNavParams } from "@/lib/content/solution-nav"
import {
  getSolutionsForStudyPlan,
  getStudyPlan,
  getStudyPlanGroupsWithSolutions,
  studyPlanIdCount,
} from "@/lib/content/study-plans"
import type { StatusFilter } from "@/lib/progress/types"

interface StudyPlanPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    status?: string
    tag?: string
  }>
}

export async function generateMetadata({
  params,
}: StudyPlanPageProps): Promise<Metadata> {
  const { slug } = await params
  const plan = getStudyPlan(slug)

  if (!plan) {
    return { title: "Plan not found" }
  }

  return {
    title: plan.name,
    description: plan.description,
  }
}

export default async function StudyPlanPage({
  params,
  searchParams,
}: StudyPlanPageProps) {
  const { slug } = await params
  const query = await searchParams
  const plan = getStudyPlan(slug)

  if (!plan) {
    notFound()
  }

  const progressFilters = parseProgressListParams(query)
  const statuses = progressFilters.statuses
  const tagIds = progressFilters.tagIds
  const dropdownStatus: StatusFilter =
    statuses.length === 1 ? statuses[0] : "all"
  const allSolutions = getSolutions()
  const solutions = getSolutionsForStudyPlan(plan, allSolutions)
  const groups = getStudyPlanGroupsWithSolutions(plan, allSolutions)
  const basePath = `/plans/${plan.slug}`
  const navParams = listFiltersToNavParams("plan", {
    planSlug: plan.slug,
    status: dropdownStatus,
    tagIds,
  })
  const curated = studyPlanIdCount(plan)

  return (
    <SolutionViewProvider>
      <SolutionListNavProvider value={navParams}>
        <div className="flex flex-col gap-8">
          <PageHeader
            title={plan.name}
            description={plan.description}
            actions={
              <>
                <RandomProblemButton solutions={solutions} />
                <SolutionViewToggle />
              </>
            }
          >
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/plans"
                  className="underline-offset-2 hover:underline"
                >
                  Study plans
                </Link>
              </p>
              <FilteredCount
                solutions={solutions}
                statuses={statuses}
                tagIds={tagIds}
                trailing={
                  solutions.length !== curated
                    ? `· ${curated} curated`
                    : undefined
                }
              />
          </PageHeader>

          <div className="flex flex-wrap items-center gap-2">
            <StatusFilterDropdown
              basePath={basePath}
              status={dropdownStatus}
              hrefParams={{ tagIds }}
            />
            <TagFilterDropdown
              basePath={basePath}
              tagIds={tagIds}
              hrefParams={{ status: dropdownStatus }}
            />
          </div>

          <StatusAwareStudyPlanGroups
            groups={groups}
            status={dropdownStatus}
            tagIds={tagIds}
          />
        </div>
      </SolutionListNavProvider>
    </SolutionViewProvider>
  )
}
