import type { UserTag } from "@/lib/tags/types"

export const STARRED_TAG_ID = "starred"

export const DEFAULT_TAGS: UserTag[] = [
  { id: STARRED_TAG_ID, name: "Starred", kind: "default" },
]
