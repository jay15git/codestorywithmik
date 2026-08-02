import {
  LANGUAGE_TO_GENERATED_EXTENSION,
  SOLUTION_LANGUAGE_ORDER,
  SOLUTION_LANGUAGE_SHIKI,
  type SolutionLanguage,
  type SolutionShikiLanguage,
} from "./solution-languages"
import type { Solution, SolutionCode, SolutionMeta } from "./types"

export type HighlightedSolutionCode = Partial<
  Record<SolutionLanguage, string>
>

export interface PreparedSolution extends Solution {
  highlighted: HighlightedSolutionCode
}

export type ReadSolutionLanguage = (
  slug: string,
  language: SolutionLanguage,
) => Promise<string | null>

export type HighlightSolutionLanguage = (
  code: string,
  language: SolutionLanguage,
) => Promise<string>

export function getSolutionLanguageFilename(
  slug: string,
  language: SolutionLanguage,
): string {
  return `${slug}.${LANGUAGE_TO_GENERATED_EXTENSION[language]}`
}

export function getSolutionCacheVersion(upstreamSha: string): string {
  return `solutions:${upstreamSha}`
}

export async function prepareSolution(
  meta: SolutionMeta,
  readLanguage: ReadSolutionLanguage,
  highlightLanguage: HighlightSolutionLanguage,
): Promise<PreparedSolution | undefined> {
  const entries = await Promise.all(
    SOLUTION_LANGUAGE_ORDER.map(async (language) => {
      const code = (await readLanguage(meta.slug, language))?.trim() || null
      return [language, code] as const
    }),
  )
  const code = Object.fromEntries(entries) as unknown as SolutionCode
  const available = entries.filter(
    (entry): entry is readonly [SolutionLanguage, string] => Boolean(entry[1]),
  )

  if (available.length === 0) {
    return undefined
  }

  const highlighted = Object.fromEntries(
    await Promise.all(
      available.map(async ([language, source]) => [
        language,
        await highlightLanguage(source, language),
      ]),
    ),
  ) as HighlightedSolutionCode

  return {
    ...meta,
    rawContent: available[0][1],
    code,
    highlighted,
  }
}

export function getShikiLanguage(
  language: SolutionLanguage,
): SolutionShikiLanguage {
  return SOLUTION_LANGUAGE_SHIKI[language]
}
