"use client"

import { useMemo } from "react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { useSolutionTags } from "@/components/solution-tags-provider"
import type { SolutionMeta } from "@/lib/content/types"
import type { StatusFilterValue } from "@/lib/progress/filters"
import { matchesSolutionListFilters } from "@/lib/content/list-progress-filters"

export function FilteredCount({
  solutions,
  statuses,
  tagIds = [],
  ofTotal,
  trailing,
}: {
  solutions: SolutionMeta[]
  statuses: StatusFilterValue[]
  tagIds?: string[]
  ofTotal?: number
  trailing?: string
}) {
  const { map } = useSolutionProgress()
  const { assignments } = useSolutionTags()

  const count = useMemo(() => {
    if (statuses.length === 0 && tagIds.length === 0) {
      return solutions.length
    }

    return solutions.filter((solution) =>
      matchesSolutionListFilters(
        solution.slug,
        map,
        assignments,
        statuses,
        tagIds,
      ),
    ).length
  }, [solutions, statuses, tagIds, map, assignments])

  const baseline = ofTotal ?? solutions.length
  const showOf = count !== baseline

  return (
    <p className="text-muted-foreground">
      {count} solution{count === 1 ? "" : "s"}
      {showOf ? ` of ${baseline}` : ""}
      {trailing ? ` ${trailing}` : ""}
    </p>
  )
}
