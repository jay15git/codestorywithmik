"use client"

import Link from "next/link"
import { useState } from "react"

import { CompanyIcon, hasCompanyIcon } from "@/components/company-icon"
import { DifficultyBadge } from "@/components/difficulty-badge"
import CenterUnderline from "@/components/fancy/text/underline-center"
import { SolutionExternalLinks } from "@/components/solution-external-links"
import type { SolutionMeta } from "@/lib/content/types"
import { companySlug } from "@/lib/content/slug"

interface SolutionRowProps {
  solution: SolutionMeta
  variant?: "grid" | "list"
}

const MAX_GRID_COMPANIES = 3
const MAX_LIST_COMPANIES = 4
const LIST_ROW_GRID =
  "grid w-full grid-cols-[3.5rem_minmax(0,1fr)_7.5rem_minmax(1rem,1fr)_3.5rem] items-center gap-x-3"

function sortCompaniesForDisplay(companies: string[]): string[] {
  return [...companies].sort((a, b) => {
    const aHasIcon = hasCompanyIcon(a) ? 0 : 1
    const bHasIcon = hasCompanyIcon(b) ? 0 : 1

    if (aHasIcon !== bHasIcon) {
      return aHasIcon - bHasIcon
    }

    return a.localeCompare(b)
  })
}

function SolutionCompanyIconLink({ company }: { company: string }) {
  return (
    <Link
      href={`/companies/${companySlug(company)}`}
      className="relative z-10 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={company}
    >
      {hasCompanyIcon(company) ? (
        <CompanyIcon company={company} size={16} className="size-4" />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-4 items-center justify-center text-[9px] font-semibold uppercase"
        >
          {company.charAt(0)}
        </span>
      )}
    </Link>
  )
}

export function SolutionRow({ solution, variant = "grid" }: SolutionRowProps) {
  const [cardHovered, setCardHovered] = useState(false)
  const companyTags = sortCompaniesForDisplay([...new Set(solution.companyTags)])
  const hasExternalLinks =
    solution.youtubeUrl || solution.leetcodeUrl || solution.gfgUrl
  const solutionHref = `/solutions/${solution.slug}`

  if (variant === "list") {
    const visibleCompanies = companyTags.slice(0, MAX_LIST_COMPANIES)
    const overflowCount = companyTags.length - visibleCompanies.length

    return (
      <div
        className={`relative px-3 py-2.5 ${LIST_ROW_GRID}`}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
      >
        <Link
          href={solutionHref}
          className="absolute inset-0 z-0"
          aria-label={solution.title}
        />

        <div className="relative z-10 flex min-h-6 items-center pointer-events-none">
          <DifficultyBadge difficulty={solution.difficulty} />
        </div>

        <div className="relative z-10 flex min-h-6 min-w-0 items-center pointer-events-none">
          <span className="text-sm font-medium leading-snug">
            <CenterUnderline active={cardHovered}>
              {solution.title}
            </CenterUnderline>
          </span>
        </div>

        <div className="relative z-10 flex min-h-6 items-center justify-center gap-1 pointer-events-none">
          <div className="grid grid-cols-4 gap-1 pointer-events-auto">
            {Array.from({ length: MAX_LIST_COMPANIES }, (_, index) => {
              const company = visibleCompanies[index]
              return (
                <div
                  key={company ?? `company-slot-${index}`}
                  className="flex size-6 items-center justify-center"
                >
                  {company ? <SolutionCompanyIconLink company={company} /> : null}
                </div>
              )
            })}
          </div>
          {overflowCount > 0 && (
            <span className="pointer-events-none w-5 shrink-0 text-center text-xs text-muted-foreground tabular-nums">
              +{overflowCount}
            </span>
          )}
        </div>

        <div aria-hidden="true" />

        <div className="relative z-10 flex min-h-6 items-center justify-end pointer-events-auto">
          {hasExternalLinks ? (
            <SolutionExternalLinks
              iconLayout="slots"
              youtubeUrl={solution.youtubeUrl}
              leetcodeUrl={solution.leetcodeUrl}
              gfgUrl={solution.gfgUrl}
            />
          ) : null}
        </div>
      </div>
    )
  }

  const visibleCompanies = companyTags.slice(0, MAX_GRID_COMPANIES)
  const overflowCount = companyTags.length - visibleCompanies.length

  return (
    <article
      className="relative flex min-h-32 cursor-pointer flex-col rounded-lg border bg-card p-(--spacing-solution-card) md:min-h-36"
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      <Link
        href={solutionHref}
        className="absolute inset-0 z-0 rounded-lg"
        aria-label={solution.title}
      />

      <div className="pointer-events-none relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-base font-medium leading-snug text-balance md:text-lg">
            <CenterUnderline active={cardHovered}>
              {solution.title}
            </CenterUnderline>
          </div>
          <DifficultyBadge
            difficulty={solution.difficulty}
            className="shrink-0"
          />
        </div>

        {(visibleCompanies.length > 0 || hasExternalLinks) && (
          <div className="flex flex-1 flex-col">
            {visibleCompanies.length > 0 && (
              <div className="mt-(--spacing-solution-title-meta) pointer-events-auto flex items-center gap-1">
                {visibleCompanies.map((company) => (
                  <SolutionCompanyIconLink key={company} company={company} />
                ))}
                {overflowCount > 0 && (
                  <span className="text-xs text-muted-foreground tabular-nums pointer-events-none">
                    +{overflowCount}
                  </span>
                )}
              </div>
            )}

            {hasExternalLinks && (
              <>
                <div
                  className="min-h-(--spacing-solution-actions) flex-1"
                  aria-hidden="true"
                />
                <SolutionExternalLinks
                  className="pointer-events-auto"
                  variant="labeled"
                  youtubeUrl={solution.youtubeUrl}
                  leetcodeUrl={solution.leetcodeUrl}
                  gfgUrl={solution.gfgUrl}
                />
              </>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
