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

export function buildLeetcodeCompanyTagIndex(
  sourceDir: string,
): Map<string, string[]> {
  const index = new Map<string, Set<string>>()

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
      const companies = index.get(slug) ?? new Set<string>()
      companies.add(companyName)
      index.set(slug, companies)
    }
  }

  const normalized = new Map<string, string[]>()
  for (const [slug, companies] of index) {
    normalized.set(slug, [...companies].sort((a, b) => a.localeCompare(b)))
  }

  return normalized
}

export function loadLeetcodeCompanyTagIndex(): Map<string, string[]> {
  const sourceDir = resolveCompanyTagsSourceDir()
  return buildLeetcodeCompanyTagIndex(sourceDir)
}

export function enrichCompanyTags(
  markdownTags: string[],
  leetcodeUrl: string | null,
  index: Map<string, string[]>,
): string[] {
  const slug = leetcodeSlugFromUrl(leetcodeUrl)
  const fromLeetcode = slug ? (index.get(slug) ?? []) : []

  return normalizeCompanyTags([...markdownTags, ...fromLeetcode])
}
