import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { FilteredCount } from "@/components/filtered-count"
import { PageHeader } from "@/components/page-header"
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
  getTopicOptions,
  parseListSearchParams,
} from "@/lib/content/filter-solutions"
import {
  getSolutionsByTopic,
  getTopic,
} from "@/lib/content/get-content"
import { listFiltersToNavParams } from "@/lib/content/solution-nav"

interface TopicPageProps {
  params: Promise<{ topic: string }>
  searchParams: Promise<{
    difficulty?: string
    company?: string
    topic?: string
    page?: string
    status?: string
  }>
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
    title: topic.name,
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

  if (!topic) {
    notFound()
  }

  const allSolutions = getSolutionsByTopic(topicSlug)
  const companyOptions = getCompanyOptions(allSolutions)
  const relatedTopics = getTopicOptions(allSolutions).filter(
    (option) => option.slug !== topicSlug,
  )
  const solutions = filterSolutions(allSolutions, {
    difficulties: filters.difficulties,
    companySlugs: filters.companySlugs,
    topicSlugs: filters.topicSlugs,
  })
  const basePath = `/topics/${topicSlug}`
  const navParams = listFiltersToNavParams("topic", {
    topicSlug,
    topicSlugs: filters.topicSlugs,
    companySlugs: filters.companySlugs,
    difficulties: filters.difficulties,
    statuses: filters.statuses,
    tagIds: filters.tagIds,
  })

  return (
    <SolutionViewProvider>
      <SolutionListNavProvider value={navParams}>
        <div className="flex flex-col gap-8">
          <PageHeader
            title={topic.name}
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
            topics={relatedTopics}
            currentTopicSlug={topicSlug}
          />

          {topic.subtopics.length === 0 ? (
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
              }}
            />
          ) : (
            <StatusAwareTopicSections
              topic={topic}
              solutions={solutions}
              statuses={filters.statuses}
              tagIds={filters.tagIds}
            />
          )}
        </div>
      </SolutionListNavProvider>
    </SolutionViewProvider>
  )
}
