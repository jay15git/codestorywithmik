import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CodeIcon } from "lucide-react"

import { ButtonLink } from "@/components/button-link"
import { CompanyTagLink, sortCompanyTags } from "@/components/company-tag-link"
import { DifficultyBadge } from "@/components/difficulty-badge"
import { DeviconLeetcode } from "@/components/icons/devicon/leetcode"
import { LogosYoutubeIcon } from "@/components/icons/logos/youtube-icon"
import { SimpleIconsGeeksforgeeks } from "@/components/icons/simple-icons/geeksforgeeks"
import { SolutionCodePanel } from "@/components/solution-code-panel"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buttonVariants } from "@/components/ui/button"
import { getSolution, getSolutions } from "@/lib/content/get-content"
import { practiceLinkLabel } from "@/lib/content/practice-link-label"
import { highlightCode } from "@/lib/shiki"

interface SolutionPageProps {
  params: Promise<{ slug: string }>
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

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params
  const solution = getSolution(slug)

  if (!solution) {
    notFound()
  }

  const [cppHtml, javaHtml] = await Promise.all([
    solution.code.cpp
      ? highlightCode(solution.code.cpp, "cpp")
      : Promise.resolve(null),
    solution.code.java
      ? highlightCode(solution.code.java, "java")
      : Promise.resolve(null),
  ])

  return (
    <div className="min-w-0 max-w-full space-y-8">
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/topics/${solution.topicSlug}`}>
                  {solution.topic}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {solution.subtopic && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{solution.subtopic}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{solution.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {solution.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {solution.difficulty && (
                <DifficultyBadge difficulty={solution.difficulty} className="text-sm" />
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
              <ButtonLink
                variant="outline"
                size="sm"
                href={solution.githubUrl}
                external
              >
                <CodeIcon />
                View on GitHub
              </ButtonLink>
            </div>

            {(solution.timeComplexity || solution.spaceComplexity) && (
              <div className="flex flex-wrap items-center gap-2">
                {solution.timeComplexity && (
                  <span className={buttonVariants({ variant: "outline", size: "sm" })}>
                    T.C: {solution.timeComplexity}
                  </span>
                )}
                {solution.spaceComplexity && (
                  <span className={buttonVariants({ variant: "outline", size: "sm" })}>
                    S.C: {solution.spaceComplexity}
                  </span>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-2">
              {sortCompanyTags(solution.companyTags).map((company) => (
                <CompanyTagLink key={company} company={company} />
              ))}
            </div>
          </div>
        </div>

        <SolutionCodePanel
          cpp={solution.code.cpp}
          java={solution.code.java}
          cppHtml={cppHtml}
          javaHtml={javaHtml}
        />
    </div>
  )
}
