import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AppShell } from "@/components/app-shell"
import { SolutionCard } from "@/components/solution-card"
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
    <AppShell>
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

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{topic.name}</h1>
            <p className="mt-2 text-muted-foreground">
              {topic.solutionCount} solutions
              {topic.subtopics.length > 0
                ? ` across ${topic.subtopics.length} subtopics`
                : ""}
            </p>
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
            <section key={subtopic.slug} className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">{subtopic.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {subtopic.solutionCount} solutions
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {subtopicSolutions.map((solution) => (
                  <SolutionCard key={solution.slug} solution={solution} />
                ))}
              </div>
            </section>
          )
        })}

        {solutions.some((solution) => !solution.subtopic) && (
          <section className="space-y-4">
            <h2 className="text-lg font-medium">General</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {solutions
                .filter((solution) => !solution.subtopic)
                .map((solution) => (
                  <SolutionCard key={solution.slug} solution={solution} />
                ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  )
}
