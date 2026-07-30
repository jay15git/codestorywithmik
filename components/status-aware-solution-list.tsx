"use client"

import { useMemo } from "react"

import { SolutionsPagination } from "@/components/solutions-pagination"
import { SolutionView } from "@/components/solution-view-list"
import { useSolutionProgress } from "@/components/solution-progress-provider"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  LIST_PAGE_SIZE,
  type ListHrefParams,
} from "@/lib/content/filter-solutions"
import type { SolutionMeta } from "@/lib/content/types"
import { matchesStatusFilter } from "@/lib/progress/store"
import type { StatusFilter } from "@/lib/progress/types"

export function StatusAwareSolutionList({
  solutions,
  status,
  basePath,
  page,
  query = {},
  emptyTitle = "No solutions match these filters.",
}: {
  solutions: SolutionMeta[]
  status: StatusFilter
  basePath: string
  page: number
  query?: Omit<ListHrefParams, "page" | "status">
  emptyTitle?: string
}) {
  const { map } = useSolutionProgress()

  const filtered = useMemo(() => {
    if (status === "all") {
      return solutions
    }

    return solutions.filter((solution) =>
      matchesStatusFilter(map, solution.slug, status),
    )
  }, [solutions, status, map])

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIST_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageSolutions = filtered.slice(
    (safePage - 1) * LIST_PAGE_SIZE,
    safePage * LIST_PAGE_SIZE,
  )

  if (filtered.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>
            {status === "all"
              ? "Try a different difficulty or company filter."
              : "Mark problems from a solution page, or clear the progress filter."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <SolutionView solutions={pageSolutions} />
      <SolutionsPagination
        basePath={basePath}
        page={safePage}
        totalPages={totalPages}
        query={{ ...query, status }}
      />
    </div>
  )
}
