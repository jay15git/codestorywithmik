import type { Metadata } from "next"
import Link from "next/link"

import { TitleUnderline } from "@/components/title-underline"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSolutions } from "@/lib/content/get-content"
import {
  getSolutionsForStudyPlan,
  getStudyPlans,
  studyPlanIdCount,
} from "@/lib/content/study-plans"

export const metadata: Metadata = {
  title: "Study Plans",
  description:
    "Work through Blind 75 and NeetCode 150 with local progress tracking.",
}

export default function StudyPlansPage() {
  const solutions = getSolutions()
  const plans = getStudyPlans().map((plan) => {
    const available = getSolutionsForStudyPlan(plan, solutions).length
    return {
      plan,
      available,
      curated: studyPlanIdCount(plan),
    }
  })

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Study plans</h1>
        <p className="max-w-2xl text-muted-foreground">
          Curated roadmaps by LeetCode id. Progress stays in this browser.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map(({ plan, available, curated }) => (
          <Link key={plan.slug} href={`/plans/${plan.slug}`}>
            <Card className="h-full bg-card transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-base">
                  <TitleUnderline>{plan.name}</TitleUnderline>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {plan.description}
                </CardDescription>
                <p className="pt-1 text-xs tabular-nums text-muted-foreground">
                  {available} available
                  {available !== curated ? ` · ${curated} curated` : null}
                </p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
