import type { UserTag } from "@/lib/tags/types"

export const STARRED_TAG_ID = "starred"
export const REVISIT_TAG_ID = "revisit"

export const DEFAULT_TAGS: UserTag[] = [
  { id: STARRED_TAG_ID, name: "Starred", kind: "default" },
  { id: REVISIT_TAG_ID, name: "Revisit", kind: "default" },
]
