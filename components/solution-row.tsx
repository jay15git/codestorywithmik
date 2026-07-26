"use client"

import Link from "next/link"
import { useState } from "react"

import { BadgeLink } from "@/components/button-link"
import { CompanyIcon, hasCompanyIcon } from "@/components/company-icon"
import CenterUnderline from "@/components/fancy/text/underline-center"
import { SolutionExternalLinks } from "@/components/solution-external-links"
import type { SolutionMeta } from "@/lib/content/types"
import { companySlug } from "@/lib/content/slug"

interface SolutionRowProps {
  solution: SolutionMeta
  variant?: "grid" | "list"
}

const MAX_GRID_COMPANIES = 6
const MAX_LIST_COMPANIES = 4

export function SolutionRow({ solution, variant = "grid" }: SolutionRowProps) {
  const [hovered, setHovered] = useState(false)
  const companyTags = [...new Set(solution.companyTags)]
  const hasExternalLinks =
    solution.youtubeUrl || solution.leetcodeUrl || solution.gfgUrl
  const solutionHref = `/solutions/${solution.slug}`

  if (variant === "list") {
    const visibleCompanies = companyTags
      .filter((company) => hasCompanyIcon(company))
      .slice(0, MAX_LIST_COMPANIES)
    const overflowCount = companyTags.length - visibleCompanies.length

    return (
      <div
        className="relative flex min-w-0 items-center gap-3 px-3 py-2"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link
          href={solutionHref}
          className="absolute inset-0 z-0"
          aria-label={solution.title}
        />

        <div className="relative z-10 min-w-0 flex-1 pointer-events-none">
          <span className="text-sm font-medium leading-snug">
            <CenterUnderline active={hovered}>{solution.title}</CenterUnderline>
          </span>
        </div>

        {(visibleCompanies.length > 0 || overflowCount > 0) && (
          <div className="relative z-10 flex shrink-0 items-center gap-1">
            {visibleCompanies.map((company) => (
              <Link
                key={company}
                href={`/companies/${companySlug(company)}`}
                className="rounded-sm p-0.5 transition-colors hover:bg-muted"
                aria-label={company}
              >
                <CompanyIcon company={company} size={16} className="size-4" />
              </Link>
            ))}
            {overflowCount > 0 && (
              <span className="text-xs text-muted-foreground tabular-nums">
                +{overflowCount}
              </span>
            )}
          </div>
        )}

        <SolutionExternalLinks
          className="relative z-10"
          youtubeUrl={solution.youtubeUrl}
          leetcodeUrl={solution.leetcodeUrl}
          gfgUrl={solution.gfgUrl}
        />
      </div>
    )
  }

  const visibleCompanies = companyTags.slice(0, MAX_GRID_COMPANIES)
  const overflowCount = companyTags.length - visibleCompanies.length

  return (
    <article
      className="relative flex min-h-36 cursor-pointer flex-col rounded-xl border bg-card p-4 md:min-h-40 md:p-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={solutionHref}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={solution.title}
      />

      <div className="relative z-10 pointer-events-none text-base font-medium leading-snug md:text-lg">
        <CenterUnderline active={hovered}>{solution.title}</CenterUnderline>
      </div>

      <div className="relative z-10 mt-auto flex flex-col gap-3 pt-4">
        {visibleCompanies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleCompanies.map((company) => (
              <BadgeLink
                key={company}
                href={`/companies/${companySlug(company)}`}
                className="rounded-md bg-muted/60 px-2 py-1 text-xs text-foreground"
              >
                {hasCompanyIcon(company) && (
                  <CompanyIcon company={company} size={14} className="size-3.5" />
                )}
                {company}
              </BadgeLink>
            ))}
            {overflowCount > 0 && (
              <span className="px-1 text-xs text-muted-foreground tabular-nums pointer-events-none">
                +{overflowCount} more
              </span>
            )}
          </div>
        )}

        {hasExternalLinks && (
          <SolutionExternalLinks
            variant="labeled"
            youtubeUrl={solution.youtubeUrl}
            leetcodeUrl={solution.leetcodeUrl}
            gfgUrl={solution.gfgUrl}
          />
        )}
      </div>
    </article>
  )
}
