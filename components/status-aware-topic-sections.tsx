"use client"

import { useMemo } from "react"

import { ListKeyboardNav } from "@/components/list-keyboard-nav"
import { SolutionView } from "@/components/solution-view-list"
import { useSolutionProgress } from "@/components/solution-progress-provider"
import { useSolutionTags } from "@/components/solution-tags-provider"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { matchesSolutionListFilters } from "@/lib/content/list-progress-filters"
import type { SolutionMeta, Topic } from "@/lib/content/types"
import type { StatusFilterValue } from "@/lib/progress/filters"

export function StatusAwareTopicSections({
  topic,
  solutions,
  statuses,
  tagIds = [],
}: {
  topic: Topic
  solutions: SolutionMeta[]
  statuses: StatusFilterValue[]
  tagIds?: string[]
}) {
  const { map } = useSolutionProgress()
  const { assignments } = useSolutionTags()

  const filtered = useMemo(() => {
    return solutions.filter((solution) =>
      matchesSolutionListFilters(
        solution.slug,
        map,
        assignments,
        statuses,
        tagIds,
      ),
    )
  }, [solutions, statuses, tagIds, map, assignments])

  if (filtered.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No solutions match these filters.</EmptyTitle>
          <EmptyDescription>
            {statuses.length === 0 && tagIds.length === 0
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
