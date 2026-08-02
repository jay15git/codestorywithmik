import { notFound } from "next/navigation"

import { BlindCodeSection } from "@/components/blind-code-section"
import { SolutionCodePanel } from "@/components/solution-code-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { getPreparedSolution } from "@/lib/content/get-prepared-solution"
import type { SolutionLanguage } from "@/lib/content/solution-languages"

export function SolutionCodeSectionFallback() {
  return (
    <section className="flex flex-col gap-3" aria-hidden="true">
      <div className="h-8" />
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        <div className="flex h-10 items-center gap-2 border-b border-border/70 px-3">
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
        <div className="space-y-3 p-5">
          {Array.from({ length: 12 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-4 rounded-sm"
              style={{ width: `${55 + ((index * 17) % 42)}%` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export async function SolutionCodeSection({
  slug,
  initialLang,
}: {
  slug: string
  initialLang: SolutionLanguage | null
}) {
  const solution = await getPreparedSolution(slug)

  if (!solution) {
    notFound()
  }

  return (
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
  )
}
