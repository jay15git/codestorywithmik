import type { Metadata } from "next"
import Link from "next/link"

import { TitleUnderline } from "@/components/title-underline"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getContentIndex, getTopics } from "@/lib/content/get-content"

export const metadata: Metadata = {
  title: "Interview Solutions — LeetCode DS & Algo",
  description:
    "Browse LeetCode solutions by topic and company, with C++ and Java code from walkccc/LeetCode (MIT).",
}

export default function HomePage() {
  const index = getContentIndex()
  const topics = getTopics()

  return (
    <div className="space-y-10">
        <section className="space-y-4">
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            LeetCode interview solutions
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            Solutions from{" "}
            <a
              href="https://github.com/walkccc/LeetCode"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              walkccc/LeetCode
            </a>{" "}
            (MIT), organized by LeetCode topic tags and company. Each page has
            the code and links to practice on LeetCode.
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
              <CardDescription>Topic tags</CardDescription>
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
                LeetCode topic tags — problems can appear in multiple topics.
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
                    {topic.solutionCount} listings
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
    </div>
  )
}
