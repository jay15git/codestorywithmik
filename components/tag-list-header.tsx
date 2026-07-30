"use client"

import { useMemo } from "react"

import { RandomProblemButton } from "@/components/random-problem-button"
import { useSolutionTags } from "@/components/solution-tags-provider"
import { SolutionViewToggle } from "@/components/solution-view"
import { sortSolutions } from "@/lib/content/filter-solutions"
import type { SolutionMeta } from "@/lib/content/types"
import { getSlugsForTagId } from "@/lib/tags/lists"

export function TagListActions({
  solutions,
  tagId,
}: {
  solutions: SolutionMeta[]
  tagId: string
}) {
  const { assignments } = useSolutionTags()

  const filtered = useMemo(() => {
    const slugs = new Set(getSlugsForTagId(assignments, tagId))
    return sortSolutions(
      solutions.filter((solution) => slugs.has(solution.slug)),
      "id",
    )
  }, [solutions, tagId, assignments])

  return (
    <div className="flex shrink-0 items-center gap-2">
      <RandomProblemButton solutions={filtered} />
      <SolutionViewToggle />
    </div>
  )
}

export function TagListCount({
  solutions,
  tagId,
}: {
  solutions: SolutionMeta[]
  tagId: string
}) {
  const { assignments } = useSolutionTags()

  const count = useMemo(() => {
    const slugs = new Set(getSlugsForTagId(assignments, tagId))
    return solutions.filter((solution) => slugs.has(solution.slug)).length
  }, [solutions, tagId, assignments])

  return (
    <p className="text-muted-foreground">
      {count} solution{count === 1 ? "" : "s"}
    </p>
  )
}
