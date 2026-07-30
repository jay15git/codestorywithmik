"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { useSolutionProgress } from "@/components/solution-progress-provider"
import { useSolutionTags } from "@/components/solution-tags-provider"
import type { SolutionMeta } from "@/lib/content/types"
import type { StatusFilterValue } from "@/lib/progress/filters"
import { matchesSolutionListFilters } from "@/lib/content/list-progress-filters"
import { cn } from "@/lib/utils"

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
  const prevCount = useRef<number | null>(null)
  const [animating, setAnimating] = useState(false)

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

  useEffect(() => {
    if (prevCount.current === null) {
      prevCount.current = count
      return
    }
    if (prevCount.current === count) return
    setAnimating(false)
    void document.body.offsetWidth
    setAnimating(true)
    prevCount.current = count
  }, [count])

  const baseline = ofTotal ?? solutions.length
  const showOf = count !== baseline
  const digits = String(count).split("")

  return (
    <p className="text-muted-foreground">
      <span className={cn("t-digit-group", animating && "is-animating")}>
        {digits.map((digit, index) => (
          <span
            key={`${count}-${index}`}
            className="t-digit"
            data-stagger={index > 0 ? String(Math.min(index, 3)) : undefined}
          >
            {digit}
          </span>
        ))}
      </span>
      <span> solution{count === 1 ? "" : "s"}</span>
      {showOf ? (
        <span>
          {" "}
          of {baseline}
        </span>
      ) : null}
      {trailing ? ` ${trailing}` : ""}
    </p>
  )
}
