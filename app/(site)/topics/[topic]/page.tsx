import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { FilteredCount } from "@/components/filtered-count"
import { RandomProblemButton } from "@/components/random-problem-button"
import { SolutionFilters } from "@/components/solution-filters"
import { SolutionListNavProvider } from "@/components/solution-list-nav-provider"
import { StatusAwareSolutionList } from "@/components/status-aware-solution-list"
import { StatusAwareTopicSections } from "@/components/status-aware-topic-sections"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import {
  filterSolutions,
  getCompanyOptions,
  parseListSearchParams,
} from "@/lib/content/filter-solutions"
import {
  getSolutionsByTopic,
  getTopic,
  getTopics,
} from "@/lib/content/get-content"
import { listFiltersToNavParams } from "@/lib/content/solution-nav"

interface TopicPageProps {
  params: Promise<{ topic: string }>
  searchParams: Promise<{
    difficulty?: string
    company?: string
    lang?: string
    page?: string
    status?: string
  }>
}

export async function generateStaticParams() {
  return getTopics().map((topic) => ({ topic: topic.slug }))
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topic: topicSlug } = await params
  const topic = getTopic(topicSlug)

  if (!topic) {
    return { title: "Topic not found" }
  }

  return {
    title: `${topic.name} — Interview Solutions`,
    description: `Browse ${topic.solutionCount} ${topic.name} interview solutions.`,
  }
}

export default async function TopicPage({
  params,
  searchParams,
}: TopicPageProps) {
  const { topic: topicSlug } = await params
  const filters = parseListSearchParams(await searchParams)
  const topic = getTopic(topicSlug)
  const topics = getTopics()

  if (!topic) {
    notFound()
  }

  const allSolutions = getSolutionsByTopic(topicSlug)
  const companyOptions = getCompanyOptions(allSolutions)
  const solutions = filterSolutions(allSolutions, {
    ...filters,
    topicSlug: null,
  })
  const basePath = `/topics/${topicSlug}`
  const navParams = listFiltersToNavParams("topic", {
    topicSlug,
    companySlug: filters.companySlug,
    difficulty: filters.difficulty,
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
                {topic.name}
              </h1>
              <FilteredCount
                solutions={solutions}
                status={filters.status}
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
            topics={topics.map((item) => ({ slug: item.slug, name: item.name }))}
            currentTopicSlug={topicSlug}
          />

          {topic.subtopics.length === 0 ? (
            <StatusAwareSolutionList
              solutions={solutions}
              status={filters.status}
              basePath={basePath}
              page={filters.page}
              query={{
                difficulty: filters.difficulty,
                companySlug: filters.companySlug,
                lang: filters.lang,
              }}
            />
          ) : (
            <StatusAwareTopicSections
              topic={topic}
              solutions={solutions}
              status={filters.status}
            />
          )}
        </div>
      </SolutionListNavProvider>
    </SolutionViewProvider>
  )
}
