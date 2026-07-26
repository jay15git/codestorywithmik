"use client"

import Link from "next/link"
import { useState } from "react"

import { BadgeLink } from "@/components/button-link"
import { CompanyIcon } from "@/components/company-icon"
import CenterUnderline from "@/components/fancy/text/underline-center"
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
  const [hovered, setHovered] = useState(false)
  const companyTags = [...new Set(solution.companyTags)]

  return (
    <Card
      className="cursor-pointer bg-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <CardHeader className="gap-2">
        <CardTitle className="text-base">
          <Link href={`/solutions/${solution.slug}`}>
            <CenterUnderline active={hovered}>{solution.title}</CenterUnderline>
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
