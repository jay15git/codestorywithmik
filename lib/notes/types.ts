export interface SolutionNoteEntry {
  markdown: string
  updatedAt: string
}

export type SolutionNotesMap = Record<string, SolutionNoteEntry>
