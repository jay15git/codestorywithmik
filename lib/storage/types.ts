import type { SolutionLanguage } from "@/lib/content/solution-languages"
import type { SolutionProgressMap } from "@/lib/progress/types"
import type { TagState } from "@/lib/tags/types"

export type ViewMode = "list" | "grid"

export interface StudyBag {
  version: 2
  exportedAt?: string
  progress: SolutionProgressMap
  language: SolutionLanguage | null
  viewMode: ViewMode
  tags: TagState
}

export type StudyBagPatch = Partial<
  Pick<
    StudyBag,
    "progress" | "language" | "viewMode" | "tags"
  >
>

export interface StudyBackup extends StudyBag {
  exportedAt: string
}

/** @internal legacy import shape */
export interface LegacyProgressEntry {
  solved?: boolean
  starred?: boolean
}

/** @internal legacy import shape */
export interface StudyBagV1 {
  version: 1
  exportedAt?: string
  progress: Record<string, LegacyProgressEntry>
  language: SolutionLanguage | null
  viewMode: ViewMode
}
