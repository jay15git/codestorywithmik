import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { ButtonLink } from "@/components/button-link"
import { PageHeader } from "@/components/page-header"
import { CompanyTagList } from "@/components/company-tag-list"
import { DifficultyBadge } from "@/components/difficulty-badge"
import Link from "next/link"
import { DeviconLeetcode } from "@/components/icons/devicon/leetcode"
import { LogosYoutubeIcon } from "@/components/icons/logos/youtube-icon"
import { SimpleIconsGeeksforgeeks } from "@/components/icons/simple-icons/geeksforgeeks"
import { RelatedSolutions } from "@/components/related-solutions"
import {
  SolutionCodeSection,
  SolutionCodeSectionFallback,
} from "@/components/solution-code-section"
import { SolutionNeighborsNav } from "@/components/solution-neighbors-nav"
import { SolutionStatusControls } from "@/components/solution-status-controls"
import { buttonVariants } from "@/components/ui/button-variants"
import { sortCompanyTags } from "@/lib/content/sort-company-tags"
import { getRelatedSolutions } from "@/lib/content/related-solutions"
import { getSolutionMeta, getSolutions } from "@/lib/content/get-content"
import { practiceLinkLabel } from "@/lib/content/practice-link-label"
import {
  navStateToHrefParams,
  parseSolutionNavParams,
} from "@/lib/content/solution-nav"
import { getSolutionsForNav } from "@/lib/content/solution-nav-server"
import { topicSlugFromName } from "@/lib/content/slug"
import { parseLanguageParam } from "@/lib/preferences/language-param"

interface SolutionPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    from?: string
    topic?: string
    company?: string
    pattern?: string
    plan?: string
    difficulty?: string
    prep?: string
    status?: string
    lang?: string
  }>
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params
  const solution = getSolutionMeta(slug)

  if (!solution) {
    notFound()
  }

  return {
    title: solution.title,
    description: `Interview solution for ${solution.title} with company tags and code.`,
  }
}

export default async function SolutionPage({
  params,
  searchParams,
}: SolutionPageProps) {
  const { slug } = await params
  const meta = getSolutionMeta(slug)

  if (!meta) {
    notFound()
  }

  const query = await searchParams
  const nav = parseSolutionNavParams(query)
  const navParams = nav ? navStateToHrefParams(nav) : null
  const neighborSolutions = getSolutionsForNav(nav, meta.topicSlug).map(
    (item) => ({ slug: item.slug, title: item.title }),
  )
  const related = getRelatedSolutions(meta, getSolutions())
  const initialLang = parseLanguageParam(query.lang)

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <PageHeader title={meta.title} className="gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <SolutionStatusControls slug={meta.slug} />
            {meta.leetcodeUrl && (
              <ButtonLink
                variant="outline"
                size="sm"
                href={meta.leetcodeUrl}
                external
              >
                <DeviconLeetcode className="size-4" aria-hidden="true" />
                Practice
              </ButtonLink>
            )}
            {!meta.leetcodeUrl && meta.gfgUrl && (
              <ButtonLink
                variant="outline"
                size="sm"
                href={meta.gfgUrl}
                external
              >
                <SimpleIconsGeeksforgeeks
                  className="size-4"
                  style={{ color: "#2f8d46" }}
                  aria-hidden="true"
                />
                {practiceLinkLabel(meta.gfgUrl)}
              </ButtonLink>
            )}
            {meta.difficulty && (
              <DifficultyBadge
                difficulty={meta.difficulty}
                className="text-sm"
              />
            )}
          </div>

          {meta.youtubeUrl && (
            <div className="flex flex-wrap items-center gap-2">
              <ButtonLink
                variant="outline"
                size="sm"
                href={meta.youtubeUrl}
                external
              >
                <LogosYoutubeIcon className="size-4" aria-hidden="true" />
                Watch solution
              </ButtonLink>
            </div>
          )}

          {(meta.timeComplexity || meta.spaceComplexity) && (
            <div className="flex flex-wrap items-center gap-2">
              {meta.timeComplexity && (
                <span
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Time: {meta.timeComplexity}
                </span>
              )}
              {meta.spaceComplexity && (
                <span
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Space: {meta.spaceComplexity}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {meta.topicTags.map((tag) => (
              <Link
                key={tag}
                href={`/topics/${topicSlugFromName(tag)}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {tag}
              </Link>
            ))}
          </div>

          <CompanyTagList companies={sortCompanyTags(meta.companyTags)} />
        </div>
      </PageHeader>

      <SolutionNeighborsNav
        solutions={neighborSolutions}
        currentSlug={meta.slug}
        status={nav?.status ?? "all"}
        navParams={navParams}
      />

      <Suspense fallback={<SolutionCodeSectionFallback />}>
        <SolutionCodeSection slug={meta.slug} initialLang={initialLang} />
      </Suspense>

      <RelatedSolutions solutions={related} />
    </div>
  )
}
