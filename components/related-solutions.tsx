import Link from "next/link"

import { DifficultyBadge } from "@/components/difficulty-badge"
import { TitleUnderline } from "@/components/title-underline"
import type { SolutionMeta } from "@/lib/content/types"

export function RelatedSolutions({ solutions }: { solutions: SolutionMeta[] }) {
  if (solutions.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">More like this</h2>

      <ul className="divide-y rounded-lg border bg-card">
        {solutions.map((solution) => (
          <li key={solution.slug}>
            <Link
              href={`/solutions/${solution.slug}`}
              data-cuelume-press=""
              data-cuelume-release=""
              className="duration-quick flex items-center gap-3 px-3 py-2.5 transition-colors ease-smooth-out hover:bg-muted/40"
            >
              <DifficultyBadge difficulty={solution.difficulty} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                <TitleUnderline>{solution.title}</TitleUnderline>
              </span>
              {solution.topicTags[0] ? (
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                  {solution.topicTags.slice(0, 2).join(" · ")}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
