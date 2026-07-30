"use client"

import { useMemo } from "react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import type { SolutionMeta } from "@/lib/content/types"
import { matchesStatusFilter } from "@/lib/progress/store"
import type { StatusFilter } from "@/lib/progress/types"

export function FilteredCount({
  solutions,
  status,
  ofTotal,
  trailing,
}: {
  solutions: SolutionMeta[]
  status: StatusFilter
  ofTotal?: number
  trailing?: string
}) {
  const { map } = useSolutionProgress()

  const count = useMemo(() => {
    if (status === "all") {
      return solutions.length
    }

    return solutions.filter((solution) =>
      matchesStatusFilter(map, solution.slug, status),
    ).length
  }, [solutions, status, map])

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
