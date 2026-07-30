import { existsSync, readdirSync, statSync } from "node:fs"
import path from "node:path"

import { CONTENT_SOLUTIONS_ROOT } from "./constants"

const PROBLEM_DIR_PATTERN = /^(\d+)\.\s+(.+)$/

export const WALKCCC_LANGUAGE_EXTENSIONS = [
  "cpp",
  "java",
  "py",
  "sql",
  "ts",
] as const

export type WalkcccLanguageExtension =
  (typeof WALKCCC_LANGUAGE_EXTENSIONS)[number]

export function parseWalkcccProblemDir(
  dirName: string,
): { leetcodeId: number; title: string } | null {
  const match = PROBLEM_DIR_PATTERN.exec(dirName)
  if (!match) {
    return null
  }

  return {
    leetcodeId: Number.parseInt(match[1], 10),
    title: match[2].trim(),
  }
}

export interface WalkcccSolutionFile {
  leetcodeId: number
  title: string
  relativeDir: string
  primaryRelativePath: string
  languagePaths: Partial<Record<WalkcccLanguageExtension, string>>
}

function findPrimaryLanguageFile(
  files: string[],
  leetcodeId: number,
  extension: WalkcccLanguageExtension,
): string | null {
  const primary = `${leetcodeId}.${extension}`
  return files.includes(primary) ? primary : null
}

export function walkWalkcccSolutions(sourceDir: string): WalkcccSolutionFile[] {
  const solutionsRoot = path.join(sourceDir, CONTENT_SOLUTIONS_ROOT)

  if (!existsSync(solutionsRoot)) {
    throw new Error(
      `Walkccc solutions directory not found: ${CONTENT_SOLUTIONS_ROOT}`,
    )
  }

  const entries: WalkcccSolutionFile[] = []

  for (const dirName of readdirSync(solutionsRoot)) {
    if (dirName.startsWith(".")) {
      continue
    }

    const absoluteDir = path.join(solutionsRoot, dirName)
    if (!statSync(absoluteDir).isDirectory()) {
      continue
    }

    const parsed = parseWalkcccProblemDir(dirName)
    if (!parsed) {
      continue
    }

    const { leetcodeId, title } = parsed
    const files = readdirSync(absoluteDir)
    const relativeDir = `${CONTENT_SOLUTIONS_ROOT}/${dirName}`
    const languagePaths: Partial<Record<WalkcccLanguageExtension, string>> = {}

    for (const extension of WALKCCC_LANGUAGE_EXTENSIONS) {
      const fileName = findPrimaryLanguageFile(files, leetcodeId, extension)
      if (fileName) {
        languagePaths[extension] = `${relativeDir}/${fileName}`
      }
    }

    const primaryRelativePath = WALKCCC_LANGUAGE_EXTENSIONS.map(
      (extension) => languagePaths[extension],
    ).find((value): value is string => Boolean(value))

    if (!primaryRelativePath) {
      continue
    }

    entries.push({
      leetcodeId,
      title,
      relativeDir,
      primaryRelativePath,
      languagePaths,
    })
  }

  return entries.sort((left, right) => left.leetcodeId - right.leetcodeId)
}
