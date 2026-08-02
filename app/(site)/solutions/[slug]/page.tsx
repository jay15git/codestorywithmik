import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ButtonLink } from "@/components/button-link"
import { PageHeader } from "@/components/page-header"
import { CompanyTagList } from "@/components/company-tag-list"
import { DifficultyBadge } from "@/components/difficulty-badge"
import Link from "next/link"
import { DeviconLeetcode } from "@/components/icons/devicon/leetcode"
import { LogosYoutubeIcon } from "@/components/icons/logos/youtube-icon"
import { SimpleIconsGeeksforgeeks } from "@/components/icons/simple-icons/geeksforgeeks"
import { RelatedSolutions } from "@/components/related-solutions"
import { BlindCodeSection } from "@/components/blind-code-section"
import { SolutionCodePanel } from "@/components/solution-code-panel"
import { SolutionNeighborsNav } from "@/components/solution-neighbors-nav"
import { SolutionNotes } from "@/components/solution-notes"
import { SolutionStatusControls } from "@/components/solution-status-controls"
import { SrsReviewControls } from "@/components/srs-review-controls"
import { buttonVariants } from "@/components/ui/button-variants"
import { sortCompanyTags } from "@/lib/content/sort-company-tags"
import { getRelatedSolutions } from "@/lib/content/related-solutions"
import { getSolutionMeta, getSolutions } from "@/lib/content/get-content"
import { getPreparedSolution } from "@/lib/content/get-prepared-solution"
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
  const solution = await getPreparedSolution(slug)

  if (!solution) {
    notFound()
  }

  const nav = parseSolutionNavParams(query)
  const navParams = nav ? navStateToHrefParams(nav) : null
  const neighborSolutions = getSolutionsForNav(nav, solution.topicSlug).map(
    (item) => ({ slug: item.slug, title: item.title }),
  )
  const related = getRelatedSolutions(solution, getSolutions())
  const initialLang = parseLanguageParam(query.lang)

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <PageHeader title={solution.title} className="gap-3">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <SolutionStatusControls slug={solution.slug} />
            <SrsReviewControls slug={solution.slug} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {solution.difficulty && (
              <DifficultyBadge
                difficulty={solution.difficulty}
                className="text-sm"
              />
            )}
            {solution.leetcodeUrl && (
              <ButtonLink
                variant="outline"
                size="sm"
                href={solution.leetcodeUrl}
                external
              >
                <DeviconLeetcode className="size-4" aria-hidden="true" />
                LeetCode
              </ButtonLink>
            )}
            {!solution.leetcodeUrl && solution.gfgUrl && (
              <ButtonLink
                variant="outline"
                size="sm"
                href={solution.gfgUrl}
                external
              >
                <SimpleIconsGeeksforgeeks
                  className="size-4"
                  style={{ color: "#2f8d46" }}
                  aria-hidden="true"
                />
                {practiceLinkLabel(solution.gfgUrl)}
              </ButtonLink>
            )}
            {solution.youtubeUrl && (
              <ButtonLink
                variant="outline"
                size="sm"
                href={solution.youtubeUrl}
                external
              >
                <LogosYoutubeIcon className="size-4" aria-hidden="true" />
                Watch solution
              </ButtonLink>
            )}
          </div>

          {(solution.timeComplexity || solution.spaceComplexity) && (
            <div className="flex flex-wrap items-center gap-2">
              {solution.timeComplexity && (
                <span
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Time: {solution.timeComplexity}
                </span>
              )}
              {solution.spaceComplexity && (
                <span
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Space: {solution.spaceComplexity}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {solution.topicTags.map((tag) => (
              <Link
                key={tag}
                href={`/topics/${topicSlugFromName(tag)}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                {tag}
              </Link>
            ))}
          </div>

          <CompanyTagList companies={sortCompanyTags(solution.companyTags)} />
        </div>
      </PageHeader>

      <SolutionNeighborsNav
        solutions={neighborSolutions}
        currentSlug={solution.slug}
        status={nav?.status ?? "all"}
        navParams={navParams}
      />

      <BlindCodeSection slug={solution.slug}>
        <SolutionCodePanel
          slug={solution.slug}
          title={solution.title}
          code={solution.code}
          highlighted={solution.highlighted}
          initialLang={initialLang}
          topic={solution.topic}
          difficulty={solution.difficulty}
          timeComplexity={solution.timeComplexity}
          spaceComplexity={solution.spaceComplexity}
          leetcodeUrl={solution.leetcodeUrl}
          gfgUrl={solution.gfgUrl}
        />
      </BlindCodeSection>

      <SolutionNotes slug={solution.slug} />

      <RelatedSolutions solutions={related} />
    </div>
  )
}
