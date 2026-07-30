"use client"

import { useMemo } from "react"

import { ListKeyboardNav } from "@/components/list-keyboard-nav"
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
import { matchesAnyStatusFilter } from "@/lib/progress/store"
import type { StatusFilterValue } from "@/lib/progress/filters"

export function StatusAwareSolutionList({
  solutions,
  statuses,
  basePath,
  page,
  query = {},
  emptyTitle = "No solutions match these filters.",
  paginated = true,
}: {
  solutions: SolutionMeta[]
  statuses: StatusFilterValue[]
  basePath: string
  page: number
  query?: Omit<ListHrefParams, "page" | "status" | "statuses">
  emptyTitle?: string
  /** When false, render full filtered list (e.g. study-plan groups). */
  paginated?: boolean
}) {
  const { map } = useSolutionProgress()

  const filtered = useMemo(() => {
    if (statuses.length === 0) {
      return solutions
    }

    return solutions.filter((solution) =>
      matchesAnyStatusFilter(map, solution.slug, statuses),
    )
  }, [solutions, statuses, map])

  const totalPages = Math.max(1, Math.ceil(filtered.length / LIST_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageSolutions = paginated
    ? filtered.slice((safePage - 1) * LIST_PAGE_SIZE, safePage * LIST_PAGE_SIZE)
    : filtered

  if (filtered.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>
            {statuses.length === 0
              ? "Try a different difficulty or company filter."
              : "Mark problems from a solution page, or clear the progress filter."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <ListKeyboardNav>
        <SolutionView solutions={pageSolutions} />
      </ListKeyboardNav>
      {paginated ? (
        <SolutionsPagination
          basePath={basePath}
          page={safePage}
          totalPages={totalPages}
          query={{ ...query, statuses }}
        />
      ) : null}
    </div>
  )
}
