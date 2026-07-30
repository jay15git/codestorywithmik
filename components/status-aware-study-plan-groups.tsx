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
import type { SolutionMeta } from "@/lib/content/types"
import { matchesStatusFilter } from "@/lib/progress/store"
import type { StatusFilter } from "@/lib/progress/types"

export function StatusAwareStudyPlanGroups({
  groups,
  status,
}: {
  groups: Array<{ name: string; solutions: SolutionMeta[] }>
  status: StatusFilter
}) {
  const { map } = useSolutionProgress()

  const visibleGroups = useMemo(() => {
    return groups
      .map((group) => {
        const solutions =
          status === "all"
            ? group.solutions
            : group.solutions.filter((solution) =>
                matchesStatusFilter(map, solution.slug, status),
              )
        return { name: group.name, solutions }
      })
      .filter((group) => group.solutions.length > 0)
  }, [groups, status, map])

  if (visibleGroups.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No solutions match these filters.</EmptyTitle>
          <EmptyDescription>
            Mark problems from a solution page, or clear the progress filter.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ListKeyboardNav>
      <div className="flex flex-col gap-8">
        {visibleGroups.map((group) => (
          <section key={group.name} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              {group.name}
              <span className="ml-2 text-sm font-normal tabular-nums text-muted-foreground">
                {group.solutions.length}
              </span>
            </h2>
            <SolutionView solutions={group.solutions} />
          </section>
        ))}
      </div>
    </ListKeyboardNav>
  )
}
