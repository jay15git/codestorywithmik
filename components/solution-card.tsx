import Link from "next/link"

import { BadgeLink } from "@/components/button-link"
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
  return (
    <Card className="transition-colors hover:bg-muted/30">
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
      {solution.companyTags.length > 0 && (
        <CardContent className="flex flex-wrap gap-1.5">
          {solution.companyTags.slice(0, 4).map((company) => (
            <BadgeLink
              key={company}
              href={`/companies/${companySlug(company)}`}
            >
              {company}
            </BadgeLink>
          ))}
          {solution.companyTags.length > 4 && (
            <span className="inline-flex h-5 items-center rounded-4xl border border-border px-2 text-xs text-muted-foreground">
              +{solution.companyTags.length - 4}
            </span>
          )}
        </CardContent>
      )}
    </Card>
  )
}
