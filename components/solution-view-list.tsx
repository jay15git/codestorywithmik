"use client"

import { SolutionRow } from "@/components/solution-row"
import { useSolutionViewContext } from "@/components/solution-view"
import type { SolutionMeta } from "@/lib/content/types"
import { cn } from "@/lib/utils"

export function SolutionView({
  solutions,
  className,
}: {
  solutions: SolutionMeta[]
  className?: string
}) {
  const { viewMode } = useSolutionViewContext()

  if (solutions.length === 0) {
    return null
  }

  return (
    <div className={cn("solution-view-stack", className)}>
      <div
        className={cn(
          "solution-view-list divide-y rounded-lg border bg-card",
          viewMode !== "list" && "solution-view-inactive",
        )}
        aria-hidden={viewMode !== "list"}
      >
        {solutions.map((solution) => (
          <SolutionRow key={solution.slug} solution={solution} variant="list" />
        ))}
      </div>
      <div
        className={cn(
          "solution-view-grid grid gap-3 md:grid-cols-2",
          viewMode !== "grid" && "solution-view-inactive",
        )}
        aria-hidden={viewMode !== "grid"}
      >
        {solutions.map((solution) => (
          <SolutionRow key={solution.slug} solution={solution} variant="grid" />
        ))}
      </div>
    </div>
  )
}
