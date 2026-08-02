import type { SolutionLanguage } from "@/lib/content/solution-languages"
import type { SolutionNotesMap } from "@/lib/notes/types"
import type { SolutionProgressMap } from "@/lib/progress/types"
import type { TagState } from "@/lib/tags/types"

export type ViewMode = "list" | "grid"

export interface StudyBag {
  version: 2
  exportedAt?: string
  progress: SolutionProgressMap
  notes: SolutionNotesMap
  language: SolutionLanguage | null
  viewMode: ViewMode
  tags: TagState
}

export type StudyBagPatch = Partial<
  Pick<
    StudyBag,
    "progress" | "notes" | "language" | "viewMode" | "tags"
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
  notes: SolutionNotesMap
  language: SolutionLanguage | null
  viewMode: ViewMode
}
