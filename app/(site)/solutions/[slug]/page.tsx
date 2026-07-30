import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ButtonLink } from "@/components/button-link"
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
import {
  getSolution,
  getSolutions,
} from "@/lib/content/get-content"
import { practiceLinkLabel } from "@/lib/content/practice-link-label"
import {
  navStateToHrefParams,
  parseSolutionNavParams,
} from "@/lib/content/solution-nav"
import { getSolutionsForNav } from "@/lib/content/solution-nav-server"
import {
  getAvailableLanguages,
  SOLUTION_LANGUAGE_SHIKI,
  type SolutionLanguage,
} from "@/lib/content/solution-languages"
import { topicSlugFromName } from "@/lib/content/slug"
import { parseLanguageParam } from "@/lib/preferences/language"
import { highlightCode } from "@/lib/shiki"

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

export async function generateStaticParams() {
  return getSolutions().map((solution) => ({ slug: solution.slug }))
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params
  const solution = getSolution(slug)

  if (!solution) {
    return { title: "Solution not found" }
  }

  return {
    title: `${solution.title} — ${solution.topic}`,
    description: `Interview solution for ${solution.title} with company tags and code.`,
  }
}

export default async function SolutionPage({
  params,
  searchParams,
}: SolutionPageProps) {
  const { slug } = await params
  const query = await searchParams
  const solution = getSolution(slug)

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

  const availableLanguages = getAvailableLanguages(solution.code)
  const highlighted = Object.fromEntries(
    await Promise.all(
      availableLanguages.map(async (language) => [
        language,
        await highlightCode(
          solution.code[language]!,
          SOLUTION_LANGUAGE_SHIKI[language] as
            | "cpp"
            | "java"
            | "python"
            | "sql"
            | "typescript",
        ),
      ]),
    ),
  ) as Partial<Record<SolutionLanguage, string>>

  return (
    <div className="min-w-0 max-w-full space-y-8">
      <div className="space-y-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {solution.title}
          </h1>

          <SolutionStatusControls slug={solution.slug} />
          <SrsReviewControls slug={solution.slug} />

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
                  T.C: {solution.timeComplexity}
                </span>
              )}
              {solution.spaceComplexity && (
                <span
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  S.C: {solution.spaceComplexity}
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
      </div>

      <SolutionNeighborsNav
        solutions={neighborSolutions}
        currentSlug={solution.slug}
        status={nav?.status ?? "all"}
        navParams={navParams}
      />

      <BlindCodeSection slug={solution.slug}>
        <SolutionCodePanel
          slug={solution.slug}
          code={solution.code}
          highlighted={highlighted}
          initialLang={initialLang}
        />
      </BlindCodeSection>

      <SolutionNotes slug={solution.slug} />

      <RelatedSolutions solutions={related} />
    </div>
  )
}
