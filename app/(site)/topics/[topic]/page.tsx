import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SolutionFilters } from "@/components/solution-filters"
import { SolutionsPagination } from "@/components/solutions-pagination"
import { SolutionView } from "@/components/solution-view-list"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import {
  filterSolutions,
  getCompanyOptions,
  LIST_PAGE_SIZE,
  parseListSearchParams,
} from "@/lib/content/filter-solutions"
import {
  getSolutionsByTopic,
  getTopic,
  getTopics,
} from "@/lib/content/get-content"

interface TopicPageProps {
  params: Promise<{ topic: string }>
  searchParams: Promise<{
    difficulty?: string
    company?: string
    page?: string
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
  const solutions = filterSolutions(allSolutions, filters)
  const totalPages = Math.max(1, Math.ceil(solutions.length / LIST_PAGE_SIZE))
  const page = Math.min(filters.page, totalPages)
  const pageSolutions = solutions.slice(
    (page - 1) * LIST_PAGE_SIZE,
    page * LIST_PAGE_SIZE,
  )
  const basePath = `/topics/${topicSlug}`

  return (
    <SolutionViewProvider>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {topic.name}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {solutions.length} solution{solutions.length === 1 ? "" : "s"}
              {solutions.length !== allSolutions.length
                ? ` of ${allSolutions.length}`
                : ""}
              {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
            </p>
          </div>
          <SolutionViewToggle />
        </div>

        <SolutionFilters
          basePath={basePath}
          filters={filters}
          companies={companyOptions}
          topics={topics.map((item) => ({ slug: item.slug, name: item.name }))}
          currentTopicSlug={topicSlug}
        />

        {solutions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No solutions match these filters.
          </p>
        ) : topic.subtopics.length === 0 ? (
          <>
            <SolutionView solutions={pageSolutions} />
            <SolutionsPagination
              basePath={basePath}
              page={page}
              totalPages={totalPages}
              query={{
                difficulty: filters.difficulty,
                companySlug: filters.companySlug,
              }}
            />
          </>
        ) : (
          <>
            {topic.subtopics.map((subtopic) => {
              const subtopicSolutions = solutions.filter(
                (solution) => solution.subtopicSlug === subtopic.slug,
              )

              if (subtopicSolutions.length === 0) {
                return null
              }

              return (
                <section
                  key={subtopic.slug}
                  className="solution-list-section flex flex-col gap-4"
                >
                  <h2 className="text-lg font-medium">{subtopic.name}</h2>
                  <SolutionView solutions={subtopicSolutions} />
                </section>
              )
            })}

            {solutions.some((solution) => !solution.subtopic) ? (
              <section className="solution-list-section flex flex-col gap-4">
                <h2 className="text-lg font-medium">General</h2>
                <SolutionView
                  solutions={solutions.filter((solution) => !solution.subtopic)}
                />
              </section>
            ) : null}
          </>
        )}
      </div>
    </SolutionViewProvider>
  )
}
