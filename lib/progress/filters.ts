import type {
  SolutionProgressMap,
  StatusFilter,
} from "@/lib/progress/types"

export function parseStatusFilter(value: string | undefined): StatusFilter {
  switch (value) {
    case "solved":
    case "unsolved":
    case "starred":
    case "revisit":
      return value
    default:
      return "all"
  }
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
