import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PrepPackFilter } from "@/components/prep-pack-filter"
import { RandomProblemButton } from "@/components/random-problem-button"
import { FilteredCount } from "@/components/filtered-count"
import { SolutionFilters } from "@/components/solution-filters"
import { SolutionListNavProvider } from "@/components/solution-list-nav-provider"
import { StatusAwareSolutionList } from "@/components/status-aware-solution-list"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import {
  filterSolutions,
  getTopicOptions,
  parseListSearchParams,
} from "@/lib/content/filter-solutions"
import {
  applyPrepPack,
  parsePrepPack,
  prepPackLabel,
} from "@/lib/content/prep-packs"
import {
  getCompanies,
  getCompanyName,
  getSolutionsByCompany,
} from "@/lib/content/get-content"
import { listFiltersToNavParams } from "@/lib/content/solution-nav"
import { slugify } from "@/lib/content/slug"

interface CompanyPageProps {
  params: Promise<{ company: string }>
  searchParams: Promise<{
    page?: string
    difficulty?: string
    topic?: string
    lang?: string
    prep?: string
    status?: string
  }>
}

export async function generateStaticParams() {
  return getCompanies().map((company) => ({ company: slugify(company) }))
}

export async function generateMetadata({
  params,
  searchParams,
}: CompanyPageProps): Promise<Metadata> {
  const { company: companySlug } = await params
  const { prep } = await searchParams
  const company = getCompanyName(companySlug)

  if (!company) {
    return { title: "Company not found" }
  }

  const pack = parsePrepPack(prep)

  return {
    title: pack
      ? `${company} ${prepPackLabel(pack)} interview prep`
      : `${company} interview questions`,
    description: pack
      ? `${prepPackLabel(pack)} most frequent ${company} interview questions with solutions.`
      : `Solutions tagged with ${company} in coding interviews.`,
  }
}

export default async function CompanyPage({
  params,
  searchParams,
}: CompanyPageProps) {
  const { company: companySlug } = await params
  const filters = parseListSearchParams(await searchParams)
  const company = getCompanyName(companySlug)

  if (!company) {
    notFound()
  }

  const allSolutions = getSolutionsByCompany(companySlug)
  const topicOptions = getTopicOptions(allSolutions)
  const filtered = filterSolutions(allSolutions, filters)
  const solutions = applyPrepPack(filtered, company, filters.prep)
  const basePath = `/companies/${companySlug}`
  const navParams = listFiltersToNavParams("company", {
    companySlug,
    topicSlug: filters.topicSlug,
    difficulty: filters.difficulty,
    prep: filters.prep,
    status: filters.status,
    lang: filters.lang,
  })

  return (
    <SolutionViewProvider>
      <SolutionListNavProvider value={navParams}>
        <div className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {company}
              </h1>
              <FilteredCount
                solutions={solutions}
                status={filters.status}
                ofTotal={allSolutions.length}
                trailing={
                  filters.prep
                    ? `· ${prepPackLabel(filters.prep)} by frequency`
                    : "tagged with this company"
                }
              />
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <RandomProblemButton solutions={solutions} />
              <SolutionViewToggle />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <PrepPackFilter
              basePath={basePath}
              prep={filters.prep}
              hrefParams={{
                difficulty: filters.difficulty,
                topicSlug: filters.topicSlug,
                status: filters.status,
                lang: filters.lang,
              }}
            />
            <SolutionFilters
              basePath={basePath}
              filters={filters}
              topics={topicOptions}
            />
          </div>

          <StatusAwareSolutionList
            solutions={solutions}
            status={filters.status}
            basePath={basePath}
            page={filters.page}
            query={{
              difficulty: filters.difficulty,
              topicSlug: filters.topicSlug,
              prep: filters.prep,
              lang: filters.lang,
            }}
          />
        </div>
      </SolutionListNavProvider>
    </SolutionViewProvider>
  )
}
