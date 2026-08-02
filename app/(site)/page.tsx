import type { Metadata } from "next"
import Link from "next/link"

import { RandomProblemButton } from "@/components/random-problem-button"
import { PageHeader } from "@/components/page-header"
import { TitleUnderline } from "@/components/title-underline"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getContentIndex,
  getSolutions,
  getTopics,
} from "@/lib/content/get-content"
import {
  getSolutionsForStudyPlan,
  getStudyPlans,
  studyPlanIdCount,
} from "@/lib/content/study-plans"

export const metadata: Metadata = {
  title: {
    absolute: "LeetSeek · LeetCode DS & Algo",
  },
  description:
    "Browse LeetCode solutions by topic and company, with C++ and Java code from walkccc/LeetCode (MIT).",
}

export default function HomePage() {
  const index = getContentIndex()
  const topics = getTopics()
  const solutions = getSolutions()
  const plans = getStudyPlans().map((plan) => ({
    plan,
    available: getSolutionsForStudyPlan(plan, solutions).length,
    curated: studyPlanIdCount(plan),
  }))
  const featuredTopics = topics.slice(0, 12)
  const remainingTopics = topics.slice(featuredTopics.length)

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="LeetCode interview solutions"
        actions={
          <>
            <Link
              href="/problems"
              className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              All problems
            </Link>
            <RandomProblemButton
              slugs={solutions.map((solution) => solution.slug)}
              label="Random unsolved"
              size="default"
            />
          </>
        }
      >
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
          (MIT), by topic and company. Code plus links to practice on LeetCode.
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
      </PageHeader>

      <section
        aria-label="Library overview"
        className="grid gap-4 sm:grid-cols-3"
      >
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

      <section
        aria-labelledby="study-plans-heading"
        className="flex flex-col gap-4"
      >
        <div>
          <h2 id="study-plans-heading" className="text-xl font-semibold">
            Study plans
          </h2>
          <p className="text-sm text-muted-foreground">
            Blind 75, NeetCode 150, and NeetCode 250.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map(({ plan, available, curated }) => (
            <Link
              key={plan.slug}
              href={`/plans/${plan.slug}`}
              className="block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Card className="h-full bg-card transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">
                    <TitleUnderline>{plan.name}</TitleUnderline>
                  </CardTitle>
                  <CardDescription className="tabular-nums">
                    {available} available
                    {available !== curated ? ` · ${curated} curated` : null}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="topics-heading" className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="topics-heading" className="text-xl font-semibold">
              Browse by topic
            </h2>
            <p className="text-sm text-muted-foreground">
              Problems can appear under more than one topic.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTopics.map((topic) => (
            <Card
              key={topic.slug}
              className="group/row relative cursor-pointer bg-card"
            >
              <Link
                href={`/topics/${topic.slug}`}
                className="absolute inset-0 z-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={topic.name}
              />
              <CardHeader className="pointer-events-none relative z-10">
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
        {remainingTopics.length > 0 ? (
          <details className="group/topics">
            <summary className="t-tactile flex min-h-10 w-fit cursor-pointer list-none items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-[background-color,color,transform] hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <span className="group-open/topics:hidden">
                Show all {topics.length} topics
              </span>
              <span className="hidden group-open/topics:inline">
                Show fewer topics
              </span>
            </summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {remainingTopics.map((topic) => (
                <Card key={topic.slug} className="group/row relative bg-card">
                  <Link
                    href={`/topics/${topic.slug}`}
                    className="absolute inset-0 z-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    aria-label={topic.name}
                  />
                  <CardHeader className="pointer-events-none relative z-10">
                    <CardTitle className="text-base">
                      <TitleUnderline>{topic.name}</TitleUnderline>
                    </CardTitle>
                    <CardDescription>{topic.solutionCount} listings</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </details>
        ) : null}
      </section>
    </div>
  )
}
