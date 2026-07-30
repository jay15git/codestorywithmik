import type { SolutionLanguage } from "@/lib/content/solution-languages"
import type { SolutionNotesMap } from "@/lib/notes/types"
import type { SolutionProgressMap } from "@/lib/progress/types"
import type { SrsMap } from "@/lib/srs/types"

export type ViewMode = "list" | "grid"

export interface StudyBag {
  version: 1
  exportedAt?: string
  progress: SolutionProgressMap
  notes: SolutionNotesMap
  srs: SrsMap
  language: SolutionLanguage | null
  viewMode: ViewMode
}

export type StudyBagPatch = Partial<
  Pick<StudyBag, "progress" | "notes" | "srs" | "language" | "viewMode">
>

export interface StudyBackup extends StudyBag {
  exportedAt: string
}
