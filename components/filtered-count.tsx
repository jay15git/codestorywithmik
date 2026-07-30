"use client"

import { useMemo } from "react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import type { SolutionMeta } from "@/lib/content/types"
import type { StatusFilterValue } from "@/lib/progress/filters"
import { matchesAnyStatusFilter } from "@/lib/progress/store"

export function FilteredCount({
  solutions,
  statuses,
  ofTotal,
  trailing,
}: {
  solutions: SolutionMeta[]
  statuses: StatusFilterValue[]
  ofTotal?: number
  trailing?: string
}) {
  const { map } = useSolutionProgress()

  const count = useMemo(() => {
    if (statuses.length === 0) {
      return solutions.length
    }

    return solutions.filter((solution) =>
      matchesAnyStatusFilter(map, solution.slug, statuses),
    ).length
  }, [solutions, statuses, map])

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
