import Link from "next/link"

import { BadgeLink } from "@/components/button-link"
import { CompanyIcon } from "@/components/company-icon"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { SolutionMeta } from "@/lib/content/types"
import { companySlug } from "@/lib/content/slug"

interface SolutionCardProps {
  solution: SolutionMeta
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const companyTags = [...new Set(solution.companyTags)]

  return (
    <Card className="bg-card">
      <CardHeader className="gap-2">
        <CardTitle className="text-base">
          <Link
            href={`/solutions/${solution.slug}`}
            className="hover:underline"
          >
            {solution.title}
          </Link>
        </CardTitle>
        <CardDescription>
          {solution.subtopic ? `${solution.subtopic} · ` : ""}
          {solution.topic}
        </CardDescription>
      </CardHeader>
      {companyTags.length > 0 && (
        <CardContent className="flex flex-wrap gap-1.5">
          {companyTags.slice(0, 4).map((company) => (
            <BadgeLink
              key={company}
              href={`/companies/${companySlug(company)}`}
            >
              <CompanyIcon company={company} />
              {company}
            </BadgeLink>
          ))}
          {companyTags.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{companyTags.length - 4}
            </span>
          )}
        </CardContent>
      )}
    </Card>
  )
}
