import { execSync } from "node:child_process"
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

import {
  LEETCODE_COMPANY_TAGS_BRANCH,
  LEETCODE_COMPANY_TAGS_CACHE_PATH,
  LEETCODE_COMPANY_TAGS_REPO,
} from "./constants"
import { normalizeCompanyTags } from "./normalize-company-tags"
import { leetcodeSlugFromUrl } from "./parse-solution"

const LEETCODE_SLUG_PATTERN = /leetcode\.com\/problems\/([^/?#,"]+)/i
const FREQUENCY_PATTERN = /,(\d+(?:\.\d+)?)%\s*$/

export interface CompanyTagEnrichment {
  companyTags: string[]
  companyFrequencies: Record<string, number>
}

export type LeetcodeCompanyTagIndex = Map<string, Record<string, number>>

export function companyFolderToDisplayName(folder: string): string {
  return folder
    .split("-")
    .map((part) => {
      if (/^\d/.test(part)) {
        return part
      }

      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(" ")
}

function resolveCompanyTagsSourceDir(): string {
  const cachePath = path.join(process.cwd(), LEETCODE_COMPANY_TAGS_CACHE_PATH)

  if (existsSync(path.join(cachePath, ".git"))) {
    console.log("Updating cached LeetCode company tags repo...")
    execSync(
      `git fetch origin && git reset --hard origin/${LEETCODE_COMPANY_TAGS_BRANCH}`,
      {
        cwd: cachePath,
        stdio: "inherit",
      },
    )
    return cachePath
  }

  mkdirSync(path.dirname(cachePath), { recursive: true })
  console.log(`Cloning ${LEETCODE_COMPANY_TAGS_REPO}...`)
  execSync(
    `git clone --depth 1 --branch ${LEETCODE_COMPANY_TAGS_BRANCH} ${LEETCODE_COMPANY_TAGS_REPO} ${cachePath}`,
    { stdio: "inherit" },
  )
  return cachePath
}

function parseFrequencyPercent(line: string): number {
  const match = line.match(FREQUENCY_PATTERN)
  if (!match?.[1]) {
    return 0
  }

  const value = Number.parseFloat(match[1])
  return Number.isFinite(value) ? value : 0
}

export function buildLeetcodeCompanyTagIndex(
  sourceDir: string,
): LeetcodeCompanyTagIndex {
  const index: LeetcodeCompanyTagIndex = new Map()

  for (const entry of readdirSync(sourceDir)) {
    const companyDir = path.join(sourceDir, entry)
    if (!statSync(companyDir).isDirectory() || entry === "meta" || entry === "src") {
      continue
    }

    const csvPath = path.join(companyDir, "all.csv")
    if (!existsSync(csvPath)) {
      continue
    }

    const companyName = companyFolderToDisplayName(entry)
    const lines = readFileSync(csvPath, "utf8").split("\n")

    for (let lineIndex = 1; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex]?.trim()
      if (!line) {
        continue
      }

      const slugMatch = line.match(LEETCODE_SLUG_PATTERN)
      if (!slugMatch?.[1]) {
        continue
      }

      const slug = slugMatch[1].toLowerCase()
      const frequency = parseFrequencyPercent(line)
      const frequencies = index.get(slug) ?? {}
      const existing = frequencies[companyName] ?? 0
      frequencies[companyName] = Math.max(existing, frequency)
      index.set(slug, frequencies)
    }
  }

  return index
}

export function loadLeetcodeCompanyTagIndex(): LeetcodeCompanyTagIndex {
  const sourceDir = resolveCompanyTagsSourceDir()
  return buildLeetcodeCompanyTagIndex(sourceDir)
}

export function enrichCompanyTags(
  markdownTags: string[],
  leetcodeUrl: string | null,
  index: LeetcodeCompanyTagIndex,
): CompanyTagEnrichment {
  const slug = leetcodeSlugFromUrl(leetcodeUrl)
  const frequencies = slug ? { ...(index.get(slug) ?? {}) } : {}
  const fromLeetcode = Object.keys(frequencies)
  const companyTags = normalizeCompanyTags([...markdownTags, ...fromLeetcode])

  const companyFrequencies: Record<string, number> = {}
  for (const company of companyTags) {
    const value = frequencies[company]
    if (typeof value === "number" && value > 0) {
      companyFrequencies[company] = value
    }
  }

  return { companyTags, companyFrequencies }
}
