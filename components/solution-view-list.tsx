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

  if (viewMode === "list") {
    return (
      <div
        className={cn(
          "solution-view-list divide-y rounded-lg border bg-card",
          className,
        )}
      >
        {solutions.map((solution) => (
          <SolutionRow key={solution.slug} solution={solution} variant="list" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn("solution-view-grid grid gap-3 md:grid-cols-2", className)}>
      {solutions.map((solution) => (
        <SolutionRow key={solution.slug} solution={solution} variant="grid" />
      ))}
    </div>
  )
}
