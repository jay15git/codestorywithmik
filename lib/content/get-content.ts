import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import contentIndexJson from "@/generated/content-index.json"
import { GENERATED_SOLUTIONS_PATH } from "./constants"
import {
  LANGUAGE_TO_GENERATED_EXTENSION,
  SOLUTION_LANGUAGE_ORDER,
  type SolutionLanguage,
} from "./solution-languages"
import { slugify, topicSlugFromName } from "./slug"
import type {
  ContentIndex,
  Solution,
  SolutionCode,
  SolutionMeta,
  Topic,
} from "./types"

const normalizedIndex = contentIndexJson as ContentIndex

function readLanguageFile(
  slug: string,
  language: SolutionLanguage,
): string | null {
  const filePath = path.join(
    process.cwd(),
    GENERATED_SOLUTIONS_PATH,
    `${slug}.${LANGUAGE_TO_GENERATED_EXTENSION[language]}`,
  )

  if (!existsSync(filePath)) {
    return null
  }

  const content = readFileSync(filePath, "utf8").trim()
  return content || null
}

function loadSolutionCode(slug: string): SolutionCode {
  return {
    cpp: readLanguageFile(slug, "cpp"),
    java: readLanguageFile(slug, "java"),
    python: readLanguageFile(slug, "python"),
    sql: readLanguageFile(slug, "sql"),
    typescript: readLanguageFile(slug, "typescript"),
  }
}

export function getContentIndex(): ContentIndex {
  return normalizedIndex
}

export function getTopics(): Topic[] {
  return getContentIndex().topics
}

export function getTopic(slug: string): Topic | undefined {
  return getTopics().find((topic) => topic.slug === slug)
}

export function getSolutions(): SolutionMeta[] {
  return getContentIndex().solutions
}

export function getSolutionMeta(slug: string): SolutionMeta | undefined {
  return getSolutions().find((solution) => solution.slug === slug)
}

export function getSolution(slug: string): Solution | undefined {
  const meta = getSolutionMeta(slug)
  if (!meta) {
    return undefined
  }

  const code = loadSolutionCode(slug)
  const rawContent =
    SOLUTION_LANGUAGE_ORDER.map((language) => code[language]).find(Boolean) ??
    ""

  if (!rawContent) {
    return undefined
  }

  return {
    ...meta,
    rawContent,
    code,
  }
}

export function getSolutionsByTopic(topicSlug: string): SolutionMeta[] {
  return getSolutions().filter((solution) => {
    if (solution.topicSlug === topicSlug) {
      return true
    }

    return solution.topicTags.some(
      (tag) => topicSlugFromName(tag) === topicSlug,
    )
  })
}

export function getSolutionsByCompany(companySlug: string): SolutionMeta[] {
  return getSolutions().filter((solution) =>
    solution.companyTags.some((tag) => slugify(tag) === companySlug),
  )
}

export function getCompanyName(companySlug: string): string | undefined {
  const index = getContentIndex()
  return index.companies.find((company) => slugify(company) === companySlug)
}

export function getCompanies(): string[] {
  return getContentIndex().companies
}
