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
      />

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
                className="absolute inset-0 z-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={topic.name}
              />
              <CardHeader className="pointer-events-none relative z-10">
                <CardTitle className="text-base">
                  <TitleUnderline>{topic.name}</TitleUnderline>
                </CardTitle>
                <CardDescription>
                  {topic.solutionCount} solutions
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
