"use client"

import Link from "next/link"

import { CompanyTagLink } from "@/components/company-tag-link"
import { CompactTagOverflow } from "@/components/compact-tag-overflow"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { SolutionExternalLinks } from "@/components/solution-external-links"
import { useSolutionListNav } from "@/components/solution-list-nav-provider"
import { SolutionStatusMarkers } from "@/components/solution-status-controls"
import { TitleUnderline } from "@/components/title-underline"
import { buildSolutionHref } from "@/lib/content/solution-nav"
import { sortCompanyTags } from "@/lib/content/sort-company-tags"
import { companySlug, topicSlugFromName } from "@/lib/content/slug"
import type { SolutionMeta } from "@/lib/content/types"
import { cn } from "@/lib/utils"

interface SolutionRowProps {
  solution: SolutionMeta
  variant?: "grid" | "list"
}

const MAX_GRID_COMPANIES = 3
/**
 * Fixed rem tracks for topic/company so columns align across rows.
 * Tags appear at md+ — sm content width can't fit six columns cleanly.
 */
const LIST_ROW_GRID =
  "grid w-full min-h-11 items-center gap-x-3 grid-cols-[4.75rem_minmax(0,1fr)_2.5rem_3rem] md:grid-cols-[4.75rem_minmax(0,1fr)_9rem_11rem_2.5rem_3rem] md:gap-x-4 lg:grid-cols-[4.75rem_minmax(0,1fr)_10rem_12rem_2.5rem_3rem] xl:grid-cols-[4.75rem_minmax(0,1fr)_11rem_13rem_2.5rem_3rem]"

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
  const navParams = useSolutionListNav()
  const companyTags = sortCompanyTags([...new Set(solution.companyTags)])
  const topicItems = buildTopicItems(solution.topicTags)
  const companyItems = buildCompanyItems(solution.companyTags)
  const hasExternalLinks =
    solution.youtubeUrl || solution.leetcodeUrl || solution.gfgUrl
  const solutionHref = navParams
    ? buildSolutionHref(solution.slug, navParams)
    : `/solutions/${solution.slug}`

  if (variant === "list") {
    return (
      <div
        className={cn(
          "group/row relative px-(--spacing-solution-row-x) py-(--spacing-solution-row-y) transition-colors duration-quick ease-smooth-out hover:bg-muted/40",
          LIST_ROW_GRID,
        )}
      >
        <Link
          href={solutionHref}
          className="absolute inset-0 z-0"
          aria-label={solution.title}
          data-solution-row
        />

        <div className="relative z-10 flex min-h-7 items-center pointer-events-none">
          <DifficultyBadge difficulty={solution.difficulty} size="xs" />
        </div>

        <div className="relative z-10 flex min-h-7 min-w-0 items-center pointer-events-none">
          <TitleUnderline className="block max-w-full truncate text-sm font-medium leading-snug">
            {solution.title}
          </TitleUnderline>
        </div>

        <div className="relative z-10 hidden min-h-7 min-w-0 items-center pointer-events-auto md:flex">
          <CompactTagOverflow items={topicItems} />
        </div>

        <div className="relative z-10 hidden min-h-7 min-w-0 items-center pointer-events-auto md:flex">
          <CompactTagOverflow items={companyItems} />
        </div>

        <div className="relative z-10 flex min-h-7 items-center justify-center pointer-events-none">
          <SolutionStatusMarkers slug={solution.slug} />
        </div>

        <div className="relative z-10 flex min-h-7 items-center justify-end pointer-events-auto">
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
        data-solution-row
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
                <CompactTagOverflow items={topicItems} />
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
