import type { Metadata } from "next"
import Link from "next/link"

import { TitleUnderline } from "@/components/title-underline"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getContentIndex, getTopics } from "@/lib/content/get-content"

export const metadata: Metadata = {
  title: "codestorywithMIK — Interview DS & Algo Solutions",
  description:
    "Browse Interview_DS_Algo solutions by topic and company, with C++/Java code, LeetCode links, and YouTube explanations.",
}

export default function HomePage() {
  const index = getContentIndex()
  const topics = getTopics()

  return (
    <div className="space-y-10">
        <section className="space-y-4">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Interview DS &amp; Algo solutions from codestorywithMIK
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Solutions from the{" "}
            <a
              href="https://github.com/MAZHARMIK/Interview_DS_Algo"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Interview_DS_Algo GitHub repo
            </a>
            , organized by topic and company. Each page has the code, company
            tags, and links to LeetCode and YouTube.
          </p>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Made by{" "}
            <a
              href="https://www.itsjay.in"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Jayant
            </a>
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
              <Card
                key={topic.slug}
                className="group/row relative cursor-pointer bg-card"
              >
                <Link
                  href={`/topics/${topic.slug}`}
                  className="absolute inset-0 z-0 rounded-xl"
                  aria-label={topic.name}
                />
                <CardHeader className="relative z-10 pointer-events-none">
                  <CardTitle className="text-base">
                    <TitleUnderline>{topic.name}</TitleUnderline>
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
    </div>
  )
}
