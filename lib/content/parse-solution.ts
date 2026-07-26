import type { SolutionCode } from "./types"

const YOUTUBE_PATTERNS = [
  /(?:MY\s+YOUTUBE\s+VIDEO[^:]*:|youtube[^:]*:)\s*(https?:\/\/[^\s*]+)/i,
  /(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^\s*]+)/i,
  /(https?:\/\/youtu\.be\/[^\s*]+)/i,
]

const LEETCODE_PATTERN =
  /(?:Leetcode\s+Link|LeetCode\s+Link)\s*:\s*(https?:\/\/[^\s*]+)/i

const COMPANY_PATTERN = /Company\s+Tags?\s*:\s*([^\n*]+)/i

const TIME_COMPLEXITY_PATTERN = /T\.C\s*:\s*([^\n*/]+)/i
const SPACE_COMPLEXITY_PATTERN = /S\.C\s*:\s*([^\n*/]+)/i

const JAVA_SPLIT_PATTERN =
  /\/\*{5,}\s*JAVA\s*\*{5,}\s*\*\/|\/\*{5,}\s*JAVA\s*\*{5,}/i

export function parseYoutubeUrl(content: string): string | null {
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = content.match(pattern)
    if (match?.[1]) {
      return match[1].trim()
    }
  }

  return null
}

export function parseLeetcodeUrl(content: string): string | null {
  const match = content.match(LEETCODE_PATTERN)
  return match?.[1]?.trim() ?? null
}

export function parseCompanyTags(content: string): string[] {
  const match = content.match(COMPANY_PATTERN)
  if (!match?.[1]) {
    return []
  }

  return match[1]
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
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
  return match?.[1] ?? null
}
