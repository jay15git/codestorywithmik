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
import { StatusAwareSolutionList } from "@/components/status-aware-solution-list"
import { StatusFilterDropdown } from "@/components/status-filter-dropdown"
import { TagFilterDropdown } from "@/components/tag-filter-dropdown"
import { parseProgressListParams } from "@/lib/content/filter-solutions"
import { buttonVariants } from "@/components/ui/button-variants"
import { getSolutions } from "@/lib/content/get-content"
import {
  getPattern,
  getPatterns,
  getSolutionsForPattern,
  patternTopicHrefs,
} from "@/lib/content/patterns"
import { listFiltersToNavParams } from "@/lib/content/solution-nav"
import type { StatusFilter } from "@/lib/progress/types"
import { cn } from "@/lib/utils"

interface PatternPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    page?: string
    status?: string
    tag?: string
  }>
}

export async function generateStaticParams() {
  return getPatterns().map((pattern) => ({ slug: pattern.slug }))
}

export async function generateMetadata({
  params,
}: PatternPageProps): Promise<Metadata> {
  const { slug } = await params
  const pattern = getPattern(slug)

  if (!pattern) {
    return { title: "Pattern not found" }
  }

  return {
    title: pattern.name,
    description: pattern.description,
  }
}

export default async function PatternPage({
  params,
  searchParams,
}: PatternPageProps) {
  const { slug } = await params
  const query = await searchParams
  const pattern = getPattern(slug)

  if (!pattern) {
    notFound()
  }

  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1)
  const progressFilters = parseProgressListParams(query)
  const statuses = progressFilters.statuses
  const tagIds = progressFilters.tagIds
  const dropdownStatus: StatusFilter =
    statuses.length === 1 ? statuses[0] : "all"
  const solutions = getSolutionsForPattern(pattern, getSolutions())
  const topicLinks = patternTopicHrefs(pattern)
  const basePath = `/patterns/${pattern.slug}`
  const navParams = listFiltersToNavParams("pattern", {
    patternSlug: pattern.slug,
    status: dropdownStatus,
    tagIds,
  })

  return (
    <SolutionViewProvider>
      <SolutionListNavProvider value={navParams}>
        <div className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                <Link
                  href="/patterns"
                  className="underline-offset-2 hover:underline"
                >
                  Patterns
                </Link>
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                {pattern.name}
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                {pattern.description}
              </p>
              <FilteredCount
                solutions={solutions}
                statuses={statuses}
                tagIds={tagIds}
                trailing="· Easy → Hard"
              />
              <div className="flex flex-wrap gap-2">
                {topicLinks.map((topic) => (
                  <Link
                    key={topic.href}
                    href={topic.href}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    {topic.name}
                  </Link>
                ))}
              </div>
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

          <StatusAwareSolutionList
            solutions={solutions}
            statuses={statuses}
            tagIds={tagIds}
            basePath={basePath}
            page={page}
            query={{}}
          />
        </div>
      </SolutionListNavProvider>
    </SolutionViewProvider>
  )
}
