import type { SolutionProgressMap } from "@/lib/progress/types"
import { matchesAnyStatusFilter } from "@/lib/progress/filters"
import type { StatusFilterValue } from "@/lib/progress/filters"
import type { TagAssignmentsMap } from "@/lib/tags/types"
import { matchesAnyTagFilter } from "@/lib/tags/filters"

export function matchesSolutionListFilters(
  slug: string,
  progressMap: SolutionProgressMap,
  tagAssignments: TagAssignmentsMap,
  statuses: StatusFilterValue[],
  tagIds: string[],
): boolean {
  if (
    statuses.length > 0 &&
    !matchesAnyStatusFilter(progressMap, slug, statuses)
  ) {
    return false
  }

  if (
    tagIds.length > 0 &&
    !matchesAnyTagFilter(tagAssignments, slug, tagIds)
  ) {
    return false
  }

  return true
}
