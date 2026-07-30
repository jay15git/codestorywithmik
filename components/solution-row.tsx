import Link from "next/link"

import { CompanyTagLink } from "@/components/company-tag-link"
import { CompactTagOverflow } from "@/components/compact-tag-overflow"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { SolutionExternalLinks } from "@/components/solution-external-links"
import { SolutionStatusMarkers } from "@/components/solution-status-controls"
import { TitleUnderline } from "@/components/title-underline"
import { sortCompanyTags } from "@/lib/content/sort-company-tags"
import { companySlug, topicSlugFromName } from "@/lib/content/slug"
import type { SolutionMeta } from "@/lib/content/types"
import { cn } from "@/lib/utils"

interface SolutionRowProps {
  solution: SolutionMeta
  variant?: "grid" | "list"
}

const MAX_GRID_COMPANIES = 3
const LIST_ROW_GRID =
  "grid w-full grid-cols-[3.5rem_minmax(0,1fr)_2.5rem_3.5rem] items-center gap-x-2 sm:grid-cols-[3.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_2.5rem_3.5rem] sm:gap-x-3 md:grid-cols-[3.5rem_minmax(0,1.4fr)_minmax(7rem,1fr)_minmax(7rem,1fr)_2.5rem_3.5rem]"

function buildTopicItems(topicTags: string[]) {
  return [...new Set(topicTags)]
    .sort((left, right) => left.localeCompare(right))
    .map((topic) => ({
      label: topic,
      href: `/topics/${topicSlugFromName(topic)}`,
    }))
}

function buildCompanyItems(companyTags: string[]) {
  return sortCompanyTags([...new Set(companyTags)]).map((company) => ({
    label: company,
    href: `/companies/${companySlug(company)}`,
  }))
}

export function SolutionRow({ solution, variant = "grid" }: SolutionRowProps) {
  const companyTags = sortCompanyTags([...new Set(solution.companyTags)])
  const topicItems = buildTopicItems(solution.topicTags)
  const companyItems = buildCompanyItems(solution.companyTags)
  const hasExternalLinks =
    solution.youtubeUrl || solution.leetcodeUrl || solution.gfgUrl
  const solutionHref = `/solutions/${solution.slug}`

  if (variant === "list") {
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
          <TitleUnderline className="block max-w-full truncate text-sm font-medium leading-snug">
            {solution.title}
          </TitleUnderline>
        </div>

        <div className="relative z-10 hidden min-w-0 items-center pointer-events-auto sm:flex">
          <CompactTagOverflow items={topicItems} maxVisible={3} />
        </div>

        <div className="relative z-10 hidden min-w-0 items-center pointer-events-auto sm:flex">
          <CompactTagOverflow items={companyItems} maxVisible={3} />
        </div>

        <div className="relative z-10 flex min-h-6 items-center justify-center pointer-events-none">
          <SolutionStatusMarkers slug={solution.slug} />
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
            <TitleUnderline>{solution.title}</TitleUnderline>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SolutionStatusMarkers slug={solution.slug} />
            <DifficultyBadge
              difficulty={solution.difficulty}
              className="shrink-0"
            />
          </div>
        </div>

        {(topicItems.length > 0 ||
          visibleCompanies.length > 0 ||
          hasExternalLinks) && (
          <div className="flex flex-1 flex-col">
            {topicItems.length > 0 && (
              <div className="mt-(--spacing-solution-title-meta) pointer-events-auto">
                <CompactTagOverflow items={topicItems} maxVisible={4} />
              </div>
            )}

            {visibleCompanies.length > 0 && (
              <div className="mt-2 pointer-events-auto flex flex-wrap items-center gap-x-2 gap-y-1">
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
