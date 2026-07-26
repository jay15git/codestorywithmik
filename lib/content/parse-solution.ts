import type { SolutionCode } from "./types"
import { normalizeCompanyTags } from "./normalize-company-tags"
import { PROBLEM_LINK_FALLBACKS } from "./problem-link-fallbacks"

const YOUTUBE_PATTERNS = [
  /(?:MY\s+YOUTUBE\s+VIDEO[^:]*:|youtube[^:]*:)\s*(https?:\/\/[^\s*]+)/i,
  /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^\s*]+)/i,
  /(https?:\/\/youtu\.be\/[^\s*]+)/i,
]

const COMPANY_PATTERN = /Company\s+Tags?\s*:\s*([^\n*]+)/i

const TIME_COMPLEXITY_PATTERN = /T\.C\s*:\s*([^\n*/]+)/i
const SPACE_COMPLEXITY_PATTERN = /S\.C\s*:\s*([^\n*/]+)/i

const JAVA_SPLIT_PATTERN =
  /\/\*{5,}\s*JAVA\s*\*{5,}\s*\*\/|\/\*{5,}\s*JAVA\s*\*{5,}/i

const HEADER_SCAN_LENGTH = 4000

const LEETCODE_LABEL_PATTERN =
  /(?:Leetcode\s+(?:Link|Qn\s+Link)|LeetCode\s+Link)\s*:?\s*(.+)/i

const GFG_LABEL_PATTERN =
  /(?:GfG\s+Link|GFG\s+Link|Problem\s+Link|Question\s+Link|Qn\s+Link(?:\s*\(GfG\))?|Question\s+on\s+GfG)\s*:?\s*(.+)/i

const LEETCODE_URL_PATTERN =
  /https?:\/\/(?:www\.)?leetcode\.com\/problems\/[^\s*"'#?]+/i

const GFG_URL_PATTERN =
  /https?:\/\/(?:www\.)?(?:practice\.)?geeksforgeeks\.org\/[^\s*"'#]+/i

const INVALID_LINK_VALUES = new Set(["nil", "n/a", "na", "none"])

export function parseYoutubeUrl(content: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = content.match(pattern)
    if (match?.[1]) {
      return cleanUrl(match[1])
    }
  }

  return null
}

export function parseLeetcodeUrl(content: string): string | null {
  const header = content.slice(0, HEADER_SCAN_LENGTH)

  const labeled = header.match(LEETCODE_LABEL_PATTERN)
  if (labeled?.[1]) {
    const value = labeled[1].trim()
    if (!isInvalidLinkValue(value)) {
      const urlMatch = value.match(LEETCODE_URL_PATTERN)
      if (urlMatch) {
        return cleanUrl(urlMatch[0])
      }

      const fromTitle = leetcodeUrlFromTitle(value)
      if (fromTitle) {
        return fromTitle
      }
    }
  }

  const urlMatch = header.match(LEETCODE_URL_PATTERN)
  if (urlMatch) {
    return cleanUrl(urlMatch[0])
  }

  return null
}

export function parseCsesUrl(content: string): string | null {
  const header = content.slice(0, HEADER_SCAN_LENGTH)
  const labeled = header.match(/CSES\s+Link\s*:?\s*(.+)/i)
  if (labeled?.[1]) {
    const value = labeled[1].trim()
    const urlMatch = value.match(/https?:\/\/cses\.fi\/[^\s*"'#]+/i)
    if (urlMatch) {
      return cleanUrl(urlMatch[0])
    }
  }

  const urlMatch = header.match(/https?:\/\/cses\.fi\/[^\s*"'#]+/i)
  return urlMatch ? cleanUrl(urlMatch[0]) : null
}

export function parseGfgUrl(content: string): string | null {
  const header = content.slice(0, HEADER_SCAN_LENGTH)

  const labeled = header.match(GFG_LABEL_PATTERN)
  if (labeled?.[1]) {
    const value = labeled[1].trim()
    if (!isInvalidLinkValue(value)) {
      const parenthetical = value.match(
        /\((https?:\/\/(?:www\.)?(?:practice\.)?geeksforgeeks\.org\/[^)]+)\)/i,
      )
      if (parenthetical?.[1]) {
        return cleanUrl(parenthetical[1])
      }

      const urlMatch = value.match(GFG_URL_PATTERN)
      if (urlMatch) {
        return cleanUrl(urlMatch[0])
      }
    }
  }

  const parenthetical = header.match(
    /\((https?:\/\/(?:www\.)?(?:practice\.)?geeksforgeeks\.org\/[^)]+)\)/i,
  )
  if (parenthetical?.[1]) {
    return cleanUrl(parenthetical[1])
  }

  const urlMatch = header.match(GFG_URL_PATTERN)
  if (urlMatch) {
    return cleanUrl(urlMatch[0])
  }

  return null
}

export function resolveProblemLinks(
  slug: string,
  content: string,
): { leetcodeUrl: string | null; gfgUrl: string | null } {
  const leetcodeUrl = parseLeetcodeUrl(content)
  const gfgUrl = parseGfgUrl(content)
  const csesUrl = parseCsesUrl(content)
  const fallback = PROBLEM_LINK_FALLBACKS[slug]

  return {
    leetcodeUrl: leetcodeUrl ?? fallback?.leetcodeUrl ?? null,
    gfgUrl: leetcodeUrl
      ? null
      : (gfgUrl ?? csesUrl ?? fallback?.gfgUrl ?? null),
  }
}

export function parseCompanyTags(content: string): string[] {
  const match = content.match(COMPANY_PATTERN)
  if (!match?.[1]) {
    return []
  }

  return normalizeCompanyTags(
    match[1]
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  )
}

export function parseTimeComplexity(content: string): string | null {
  const match = content.match(TIME_COMPLEXITY_PATTERN)
  return match?.[1]?.trim() ?? null
}

export function parseSpaceComplexity(content: string): string | null {
  const match = content.match(SPACE_COMPLEXITY_PATTERN)
  return match?.[1]?.trim() ?? null
}

export function splitCodeBlocks(content: string): SolutionCode {
  const parts = content.split(JAVA_SPLIT_PATTERN)
  const cppBlock = parts[0]?.trim() ?? null
  const javaBlock = parts[1]?.trim() ?? null

  const cpp = extractLanguageBlock(cppBlock, "C++")
  const java = extractLanguageBlock(javaBlock, "JAVA") ?? javaBlock

  return {
    cpp: cpp || cppBlock,
    java: java || null,
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function extractLanguageBlock(
  block: string | null | undefined,
  label: string,
): string | null {
  if (!block) {
    return null
  }

  const escapedLabel = escapeRegExp(label)
  const pattern = new RegExp(
    `/\\*{5,}\\s*${escapedLabel}\\s*\\*{5,}\\s*\\*/([\\s\\S]*?)(?=/\\*{5,}|$)`,
    "i",
  )
  const match = block.match(pattern)
  return match?.[1]?.trim() ?? null
}

export function leetcodeSlugFromUrl(url: string | null): string | null {
  if (!url) {
    return null
  }

  const match = url.match(/leetcode\.com\/problems\/([^/?#]+)/i)
  return match?.[1]?.toLowerCase() ?? null
}

export function gfgSlugFromUrl(url: string | null): string | null {
  if (!url) {
    return null
  }

  const match = url.match(/geeksforgeeks\.org\/problems\/([^/?#]+)/i)
  return match?.[1] ?? null
}

function leetcodeUrlFromTitle(title: string): string | null {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (!slug || isInvalidLinkValue(slug)) {
    return null
  }

  return `https://leetcode.com/problems/${slug}/`
}

function isInvalidLinkValue(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  return INVALID_LINK_VALUES.has(normalized) || normalized.length === 0
}

function cleanUrl(url: string): string {
  return url.replace(/[#]+$/, "").trim()
}
