import Link from "next/link"

import { CompanyTagLink } from "@/components/company-tag-link"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { SolutionExternalLinks } from "@/components/solution-external-links"
import { sortCompanyTags } from "@/lib/content/sort-company-tags"
import type { SolutionMeta } from "@/lib/content/types"
import { cn } from "@/lib/utils"

interface SolutionRowProps {
  solution: SolutionMeta
  variant?: "grid" | "list"
}

const MAX_GRID_COMPANIES = 3
const MAX_LIST_COMPANIES = 3
const LIST_ROW_GRID =
  "grid w-full grid-cols-[3.5rem_minmax(0,1fr)_16rem_3.5rem] items-center gap-x-3"

const titleUnderlineClassName =
  "relative inline-block after:absolute after:bottom-0 after:left-1/2 after:h-[0.1em] after:w-0 after:-translate-x-1/2 after:bg-current after:transition-[width] after:duration-200 after:ease-out group-hover/row:after:w-full group-focus-within/row:after:w-full"

export function SolutionRow({ solution, variant = "grid" }: SolutionRowProps) {
  const companyTags = sortCompanyTags([...new Set(solution.companyTags)])
  const hasExternalLinks =
    solution.youtubeUrl || solution.leetcodeUrl || solution.gfgUrl
  const solutionHref = `/solutions/${solution.slug}`

  if (variant === "list") {
    const visibleCompanies = companyTags.slice(0, MAX_LIST_COMPANIES)
    const overflowCount = companyTags.length - visibleCompanies.length

    return (
      <div className={cn("group/row relative px-3 py-2.5", LIST_ROW_GRID)}>
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
            <span className={titleUnderlineClassName}>{solution.title}</span>
          </span>
        </div>

        <div className="relative z-10 flex min-h-6 w-full items-center justify-start gap-1.5 overflow-hidden whitespace-nowrap pointer-events-auto">
          {visibleCompanies.map((company, index) => (
            <span key={company} className="inline-flex items-center">
              {index > 0 ? (
                <span className="mr-1.5 text-xs text-muted-foreground">·</span>
              ) : null}
              <CompanyTagLink company={company} />
            </span>
          ))}
          {overflowCount > 0 && (
            <span className="pointer-events-none text-xs text-muted-foreground tabular-nums">
              +{overflowCount}
            </span>
          )}
        </div>

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
    <article className="group/row relative flex min-h-32 cursor-pointer flex-col rounded-lg border bg-card p-(--spacing-solution-card) md:min-h-36">
      <Link
        href={solutionHref}
        className="absolute inset-0 z-0 rounded-lg"
        aria-label={solution.title}
      />

      <div className="pointer-events-none relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-base font-medium leading-snug text-balance md:text-lg">
            <span className={titleUnderlineClassName}>{solution.title}</span>
          </div>
          <DifficultyBadge
            difficulty={solution.difficulty}
            className="shrink-0"
          />
        </div>

        {(visibleCompanies.length > 0 || hasExternalLinks) && (
          <div className="flex flex-1 flex-col">
            {visibleCompanies.length > 0 && (
              <div className="mt-(--spacing-solution-title-meta) pointer-events-auto flex flex-wrap items-center gap-x-2 gap-y-1">
                {visibleCompanies.map((company) => (
                  <CompanyTagLink key={company} company={company} />
                ))}
                {overflowCount > 0 && (
                  <span className="pointer-events-none text-xs text-muted-foreground tabular-nums">
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
