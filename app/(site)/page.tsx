import type { Metadata } from "next"

import { SolutionView } from "@/components/solution-view-list"
import {
  SolutionViewProvider,
  SolutionViewToggle,
} from "@/components/solution-view"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getContentIndex, getTopics } from "@/lib/content/get-content"
import Link from "next/link"

export const metadata: Metadata = {
  title: "codestorywithMIK — Interview DS & Algo Solutions",
  description:
    "Browse interview data structures and algorithms solutions by topic, company, and problem name.",
}

export default function HomePage() {
  const index = getContentIndex()
  const topics = getTopics()

  return (
    <div className="space-y-10">
        <section className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            One stop interview prep
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Calm, searchable solutions for coding interviews
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Topic-wise C++ and Java solutions with company tags, LeetCode links,
            and video explanations from codestorywithMIK. Knowledge should be
            free — learn free, share free.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-2xl tabular-nums">
                {index.solutionCount}
              </CardTitle>
              <CardDescription>Solutions indexed</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-2xl tabular-nums">
                {index.topicCount}
              </CardTitle>
              <CardDescription>Topics covered</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-2xl tabular-nums">
                {index.companyCount}
              </CardTitle>
              <CardDescription>Company tags</CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Browse by topic</h2>
              <p className="text-sm text-muted-foreground">
                Pick a category to explore problems and techniques.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <Card key={topic.slug} className="bg-card">
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link href={`/topics/${topic.slug}`} className="hover:underline">
                      {topic.name}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {topic.solutionCount} solutions
                    {topic.subtopics.length > 0
                      ? ` · ${topic.subtopics.length} subtopics`
                      : ""}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <SolutionViewProvider>
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Recently added</h2>
              <SolutionViewToggle />
            </div>
            <SolutionView solutions={index.solutions.slice(0, 6)} />
          </section>
        </SolutionViewProvider>
    </div>
  )
}
