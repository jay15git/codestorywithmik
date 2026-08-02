import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { FilteredCount } from "@/components/filtered-count"
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
  getStudyPlans,
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

export async function generateStaticParams() {
  return getStudyPlans().map((plan) => ({ slug: plan.slug }))
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/plans"
                  className="underline-offset-2 hover:underline"
                >
                  Study plans
                </Link>
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {plan.name}
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                {plan.description}
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
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <RandomProblemButton solutions={solutions} />
              <SolutionViewToggle />
            </div>
          </div>

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
