import type { Metadata } from "next"
import Link from "next/link"

import { TitleUnderline } from "@/components/title-underline"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudyPlans } from "@/lib/content/study-plans"

export const metadata: Metadata = {
  title: "Study Plans",
  description:
    "Work through Blind 75 and NeetCode 150 with local progress tracking.",
}

export default function StudyPlansPage() {
  const plans = getStudyPlans()

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Study plans"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((plan) => (
          <Link key={plan.slug} href={`/plans/${plan.slug}`}>
            <Card className="h-full bg-card transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle className="text-base">
                  <TitleUnderline>{plan.name}</TitleUnderline>
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
