import type { SolutionCode } from "./types"
import { normalizeCompanyTags } from "./normalize-company-tags"

const YOUTUBE_PATTERNS = [
  /(?:MY\s+YOUTUBE\s+VIDEO[^:]*:|youtube[^:]*:)\s*(https?:\/\/[^\s*]+)/i,
  /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^\s*]+)/i,
  /(https?:\/\/youtu\.be\/[^\s*]+)/i,
]

const COMPANY_PATTERN = /Company\s+Tags?\s*:\s*([^\n*]+)/i

const TIME_COMPLEXITY_PATTERN = /T\.C\s*:\s*([^\n]+)/i
const SPACE_COMPLEXITY_PATTERN = /S\.C\s*:\s*([^\n]+)/i

const LANGUAGE_MARKER_PATTERN =
  /(?:\/\*{5,}\s*(C\+\+|JAVA)\s*\*{5,}\s*\*\/|^\s*\*{5,}\s*(C\+\+|JAVA)\s*\*{5,}\s*\/?\s*$)/gim

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
  _slug: string,
  content: string,
): { leetcodeUrl: string | null; gfgUrl: string | null } {
  const leetcodeUrl = parseLeetcodeUrl(content)
  const gfgUrl = parseGfgUrl(content)
  const csesUrl = parseCsesUrl(content)

  return {
    leetcodeUrl,
    gfgUrl: leetcodeUrl ? null : (gfgUrl ?? csesUrl ?? null),
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
  return cleanComplexityValue(match?.[1])
}

export function parseSpaceComplexity(content: string): string | null {
  const match = content.match(SPACE_COMPLEXITY_PATTERN)
  return cleanComplexityValue(match?.[1])
}

export function splitCodeBlocks(content: string): SolutionCode {
  const markers = findLanguageMarkers(content)

  if (markers.length === 0) {
    const trimmed = content.trim()
    return {
      cpp: trimmed || null,
      java: null,
      python: null,
      sql: null,
      typescript: null,
    }
  }

  const blocks: { cpp: string[]; java: string[] } = { cpp: [], java: [] }

  for (let index = 0; index < markers.length; index += 1) {
    const marker = markers[index]
    const nextMarker = markers[index + 1]
    const start = marker.index + marker.length
    const end = nextMarker?.index ?? content.length
    const block = content.slice(start, end).trim()

    if (block) {
      blocks[marker.lang].push(block)
    }
  }

  const joinBlocks = (parts: string[]) => (parts.length > 0 ? parts.join("\n\n") : null)

  return {
    cpp: joinBlocks(blocks.cpp),
    java: joinBlocks(blocks.java),
    python: null,
    sql: null,
    typescript: null,
  }
}

type SolutionLanguage = "cpp" | "java"

interface LanguageMarker {
  lang: SolutionLanguage
  index: number
  length: number
}

function findLanguageMarkers(content: string): LanguageMarker[] {
  const markers: LanguageMarker[] = []

  for (const match of content.matchAll(LANGUAGE_MARKER_PATTERN)) {
    const label = match[1] ?? match[2]
    if (!label || match.index === undefined) {
      continue
    }

    markers.push({
      lang: label.toUpperCase() === "JAVA" ? "java" : "cpp",
      index: match.index,
      length: match[0].length,
    })
  }

  return markers.sort((left, right) => left.index - right.index)
}

export function leetcodeSlugFromUrl(url: string | null): string | null {
  if (!url) {
    return null
  }

  const match = url.match(/leetcode\.com\/problems\/([^/?#]+)/i)
  return match?.[1]?.toLowerCase() ?? null
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

function cleanComplexityValue(value: string | undefined): string | null {
  if (!value) {
    return null
  }

  const cleaned = value.replace(/\*+\/?$/, "").trim()
  return cleaned || null
}

function cleanUrl(url: string): string {
  return url.replace(/[#]+$/, "").trim()
}
