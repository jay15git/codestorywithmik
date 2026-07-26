import Link from "next/link"

import { Badge } from "@/components/ui/badge"
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
            <Badge key={company} variant="secondary" render={<Link href={`/companies/${companySlug(company)}`} />}>
              {company}
            </Badge>
          ))}
          {solution.companyTags.length > 4 && (
            <Badge variant="outline">+{solution.companyTags.length - 4}</Badge>
          )}
        </CardContent>
      )}
    </Card>
  )
}
