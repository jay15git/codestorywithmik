"use client"

import { useMemo } from "react"

import { ListKeyboardNav } from "@/components/list-keyboard-nav"
import { SolutionView } from "@/components/solution-view-list"
import { useSolutionProgress } from "@/components/solution-progress-provider"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import type { SolutionMeta, Topic } from "@/lib/content/types"
import type { StatusFilterValue } from "@/lib/progress/filters"
import { matchesAnyStatusFilter } from "@/lib/progress/store"

export function StatusAwareTopicSections({
  topic,
  solutions,
  statuses,
}: {
  topic: Topic
  solutions: SolutionMeta[]
  statuses: StatusFilterValue[]
}) {
  const { map } = useSolutionProgress()

  const filtered = useMemo(() => {
    if (statuses.length === 0) {
      return solutions
    }

    return solutions.filter((solution) =>
      matchesAnyStatusFilter(map, solution.slug, statuses),
    )
  }, [solutions, statuses, map])

  if (filtered.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No solutions match these filters.</EmptyTitle>
          <EmptyDescription>
            {statuses.length === 0
              ? "Try a different difficulty or company filter."
              : "Mark problems from a solution page, or clear the progress filter."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (topic.subtopics.length === 0) {
    return (
      <ListKeyboardNav>
        <SolutionView solutions={filtered} />
      </ListKeyboardNav>
    )
  }

  return (
    <ListKeyboardNav>
      <div className="flex flex-col gap-8">
        {topic.subtopics.map((subtopic) => {
          const subtopicSolutions = filtered.filter(
            (solution) => solution.subtopicSlug === subtopic.slug,
          )

          if (subtopicSolutions.length === 0) {
            return null
          }

          return (
            <section
              key={subtopic.slug}
              className="solution-list-section flex flex-col gap-4"
            >
              <h2 className="text-lg font-medium">{subtopic.name}</h2>
              <SolutionView solutions={subtopicSolutions} />
            </section>
          )
        })}

        {filtered.some((solution) => !solution.subtopic) ? (
          <section className="solution-list-section flex flex-col gap-4">
            <h2 className="text-lg font-medium">General</h2>
            <SolutionView
              solutions={filtered.filter((solution) => !solution.subtopic)}
            />
          </section>
        ) : null}
      </div>
    </ListKeyboardNav>
  )
}
