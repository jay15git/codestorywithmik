import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ExternalLinkIcon, CodeIcon, VideoIcon } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { BadgeLink, ButtonLink } from "@/components/button-link"
import { CodeBlock } from "@/components/code-block"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { companySlug } from "@/lib/content/slug"
import { getSolution, getSolutions } from "@/lib/content/get-content"
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

  const defaultTab = solution.code.cpp ? "cpp" : "java"

  return (
    <AppShell>
      <div className="space-y-8">
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

            <div className="flex flex-wrap gap-2">
              {solution.companyTags.map((company) => (
                <BadgeLink
                  key={company}
                  href={`/companies/${companySlug(company)}`}
                >
                  {company}
                </BadgeLink>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {solution.timeComplexity && (
                <span className="rounded-md bg-muted px-2 py-1">
                  T.C: {solution.timeComplexity}
                </span>
              )}
              {solution.spaceComplexity && (
                <span className="rounded-md bg-muted px-2 py-1">
                  S.C: {solution.spaceComplexity}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {solution.leetcodeUrl && (
                <ButtonLink
                  variant="outline"
                  size="sm"
                  href={solution.leetcodeUrl}
                  external
                >
                  LeetCode
                  <ExternalLinkIcon />
                </ButtonLink>
              )}
              {solution.youtubeUrl && (
                <ButtonLink
                  variant="outline"
                  size="sm"
                  href={solution.youtubeUrl}
                  external
                >
                  <VideoIcon />
                  Watch explanation
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
          </div>
        </div>

        <Tabs defaultValue={defaultTab}>
          <TabsList>
            {solution.code.cpp && <TabsTrigger value="cpp">C++</TabsTrigger>}
            {solution.code.java && <TabsTrigger value="java">Java</TabsTrigger>}
          </TabsList>

          {solution.code.cpp && cppHtml && (
            <TabsContent value="cpp" className="mt-4">
              <CodeBlock html={cppHtml} code={solution.code.cpp} label="C++" />
            </TabsContent>
          )}

          {solution.code.java && javaHtml && (
            <TabsContent value="java" className="mt-4">
              <CodeBlock html={javaHtml} code={solution.code.java} label="Java" />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppShell>
  )
}
