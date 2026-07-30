import type {
  SolutionProgressMap,
  StatusFilter,
} from "@/lib/progress/types"

export type StatusFilterValue = Exclude<StatusFilter, "all">

const STATUS_FILTER_VALUES = [
  "solved",
  "unsolved",
  "starred",
  "revisit",
] as const satisfies readonly StatusFilterValue[]

export function parseStatusFilter(value: string | undefined): StatusFilter {
  const [first] = parseStatusFilters(value)
  return first ?? "all"
}

export function parseStatusFilters(
  value: string | undefined,
): StatusFilterValue[] {
  if (!value) {
    return []
  }

  const seen = new Set<StatusFilterValue>()
  for (const part of value.split(",")) {
    const trimmed = part.trim()
    if (
      STATUS_FILTER_VALUES.includes(trimmed as StatusFilterValue) &&
      !seen.has(trimmed as StatusFilterValue)
    ) {
      seen.add(trimmed as StatusFilterValue)
    }
  }
  return [...seen]
}

export function getProgressEntry(
  map: SolutionProgressMap,
  slug: string,
) {
  return map[slug] ?? {}
}

export function matchesStatusFilter(
  map: SolutionProgressMap,
  slug: string,
  filter: StatusFilter,
): boolean {
  const entry = getProgressEntry(map, slug)

  switch (filter) {
    case "all":
      return true
    case "solved":
      return Boolean(entry.solved)
    case "unsolved":
      return !entry.solved
    case "starred":
      return Boolean(entry.starred)
    case "revisit":
      return Boolean(entry.revisit)
    default:
      return true
  }
}

export function matchesAnyStatusFilter(
  map: SolutionProgressMap,
  slug: string,
  filters: StatusFilterValue[],
): boolean {
  if (filters.length === 0) {
    return true
  }

  return filters.some((filter) => matchesStatusFilter(map, slug, filter))
}
