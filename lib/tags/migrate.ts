import type { LegacyProgressEntry } from "@/lib/storage/types"
import type { SolutionProgressMap } from "@/lib/progress/types"
import { DEFAULT_TAGS, REVISIT_TAG_ID, STARRED_TAG_ID } from "@/lib/tags/constants"
import type { TagAssignmentsMap, TagState, UserTag } from "@/lib/tags/types"

function uniqueIds(ids: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id)
      result.push(id)
    }
  }
  return result
}

export function createDefaultTagState(): TagState {
  return {
    definitions: [...DEFAULT_TAGS],
    assignments: {},
  }
}

export function mergeDefaultTagDefinitions(definitions: UserTag[]): UserTag[] {
  const byId = new Map<string, UserTag>()
  for (const tag of DEFAULT_TAGS) {
    byId.set(tag.id, tag)
  }
  for (const tag of definitions) {
    if (tag.kind === "default" && byId.has(tag.id)) {
      continue
    }
    byId.set(tag.id, tag)
  }
  return [...byId.values()]
}

export function migrateProgressFlagsToTags(
  progress: Record<string, LegacyProgressEntry>,
  assignments: TagAssignmentsMap,
): {
  progress: SolutionProgressMap
  assignments: TagAssignmentsMap
} {
  const nextProgress: SolutionProgressMap = {}
  const nextAssignments: TagAssignmentsMap = { ...assignments }

  for (const [slug, entry] of Object.entries(progress)) {
    const cleaned: { solved?: boolean } = {}
    if (entry.solved) {
      cleaned.solved = true
    }

    const tagIds = [...(nextAssignments[slug] ?? [])]
    if (entry.starred) {
      tagIds.push(STARRED_TAG_ID)
    }
    if (entry.revisit) {
      tagIds.push(REVISIT_TAG_ID)
    }

    const merged = uniqueIds(tagIds)
    if (merged.length > 0) {
      nextAssignments[slug] = merged
    } else {
      delete nextAssignments[slug]
    }

    if (cleaned.solved) {
      nextProgress[slug] = cleaned
    }
  }

  return { progress: nextProgress, assignments: nextAssignments }
}

export function coerceTagState(value: unknown): TagState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return createDefaultTagState()
  }

  const record = value as Record<string, unknown>
  const definitionsRaw = record.definitions
  const assignmentsRaw = record.assignments

  const definitions: UserTag[] = []
  if (Array.isArray(definitionsRaw)) {
    for (const item of definitionsRaw) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        continue
      }
      const tag = item as Record<string, unknown>
      const id = typeof tag.id === "string" ? tag.id.trim() : ""
      const name = typeof tag.name === "string" ? tag.name.trim() : ""
      if (!id || !name) {
        continue
      }
      const kind =
        tag.kind === "default" || tag.kind === "custom" ? tag.kind : "custom"
      const color =
        typeof tag.color === "string" && tag.color.trim()
          ? tag.color.trim()
          : undefined
      definitions.push({ id, name, kind, color })
    }
  }

  const assignments: TagAssignmentsMap = {}
  if (
    assignmentsRaw &&
    typeof assignmentsRaw === "object" &&
    !Array.isArray(assignmentsRaw)
  ) {
    for (const [slug, ids] of Object.entries(assignmentsRaw)) {
      if (!Array.isArray(ids)) {
        continue
      }
      const normalized = uniqueIds(
        ids.filter(
          (id): id is string =>
            typeof id === "string" && id.trim().length > 0,
        ),
      )
      if (normalized.length > 0) {
        assignments[slug] = normalized
      }
    }
  }

  return {
    definitions: mergeDefaultTagDefinitions(definitions),
    assignments,
  }
}
