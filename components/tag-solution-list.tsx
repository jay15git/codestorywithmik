"use client"

import { useMemo } from "react"

import { ListKeyboardNav } from "@/components/list-keyboard-nav"
import { SolutionView } from "@/components/solution-view-list"
import { useSolutionTags } from "@/components/solution-tags-provider"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { sortSolutions } from "@/lib/content/filter-solutions"
import type { SolutionMeta } from "@/lib/content/types"
import { getSlugsForTagId } from "@/lib/tags/lists"

export function TagSolutionList({
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

  if (filtered.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No problems in this list yet.</EmptyTitle>
          <EmptyDescription>
            Open a solution and use Save to tag it, or pick another list.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ListKeyboardNav>
      <SolutionView solutions={filtered} />
    </ListKeyboardNav>
  )
}
