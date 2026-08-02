import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"
import { unstable_cache } from "next/cache"

import { highlightCode } from "@/lib/shiki"
import { getContentIndex, getSolutionMeta } from "./get-content"
import {
  getShikiLanguage,
  getSolutionCacheVersion,
  getSolutionLanguageFilename,
  prepareSolution,
  type PreparedSolution,
} from "./prepare-solution"
import type { SolutionLanguage } from "./solution-languages"

const solutionsDirectory = path.join(process.cwd(), "generated/solutions")
export const SOLUTION_CACHE_VERSION = getSolutionCacheVersion(
  getContentIndex().upstreamSha,
)

async function readSolutionLanguage(
  slug: string,
  language: SolutionLanguage,
): Promise<string | null> {
  const filePath = path.join(
    /* turbopackIgnore: true */
    solutionsDirectory,
    getSolutionLanguageFilename(slug, language),
  )

  try {
    return await readFile(filePath, "utf8")
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return null
    }
    throw error
  }
}

async function loadPreparedSolution(
  slug: string,
): Promise<PreparedSolution | undefined> {
  const meta = getSolutionMeta(slug)
  if (!meta) {
    return undefined
  }

  return prepareSolution(meta, readSolutionLanguage, (code, language) =>
    highlightCode(code, getShikiLanguage(language)),
  )
}

const getCachedPreparedSolution = unstable_cache(
  loadPreparedSolution,
  [SOLUTION_CACHE_VERSION],
  { revalidate: false },
)

export async function getPreparedSolution(
  slug: string,
): Promise<PreparedSolution | undefined> {
  if (!getSolutionMeta(slug)) {
    return undefined
  }

  return process.env.NODE_ENV === "development"
    ? loadPreparedSolution(slug)
    : getCachedPreparedSolution(slug)
}
