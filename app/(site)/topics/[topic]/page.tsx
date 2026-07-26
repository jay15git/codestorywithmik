import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SolutionView } from "@/components/solution-view-list"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  getSolutionsByTopic,
  getTopic,
  getTopics,
} from "@/lib/content/get-content"

interface TopicPageProps {
  params: Promise<{ topic: string }>
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
    title: `${topic.name} — codestorywithMIK`,
    description: `Browse ${topic.solutionCount} ${topic.name} interview solutions.`,
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topic: topicSlug } = await params
  const topic = getTopic(topicSlug)

  if (!topic) {
    notFound()
  }

  const solutions = getSolutionsByTopic(topicSlug)

  return (
    <SolutionViewProvider>
      <div className="space-y-8">
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{topic.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-semibold tracking-tight">
                {topic.name}
              </h1>
              <SolutionViewToggle />
            </div>
          </div>

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
                className="solution-list-section space-y-4"
              >
                <h2 className="text-lg font-medium">{subtopic.name}</h2>
                <SolutionView solutions={subtopicSolutions} />
              </section>
            )
          })}

          {solutions.some((solution) => !solution.subtopic) && (
            <section className="solution-list-section space-y-4">
              <h2 className="text-lg font-medium">General</h2>
              <SolutionView
                solutions={solutions.filter((solution) => !solution.subtopic)}
              />
            </section>
          )}
      </div>
    </SolutionViewProvider>
  )
}
