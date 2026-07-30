import type { Difficulty } from "@/lib/content/types"
import { DIFFICULTY_VALUES } from "@/lib/content/filter-solutions"

export interface ParsedSearchQuery {
  /** Remaining free-text tokens (lowercased). */
  tokens: string[]
  raw: string
  leetcodeId: number | null
  difficulty: Difficulty | null
  company: string | null
}

const DIFFICULTY_TOKEN: Record<string, Difficulty> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
}

/**
 * Parse Cmd+K query extras:
 * - `#121` / `121` alone → LeetCode id
 * - `easy` / `medium` / `hard` → difficulty filter
 * - `company:google` / `@google` → company filter
 * - `diff:hard` → difficulty filter
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const raw = query.trim()
  if (!raw) {
    return {
      tokens: [],
      raw,
      leetcodeId: null,
      difficulty: null,
      company: null,
    }
  }

  let leetcodeId: number | null = null
  let difficulty: Difficulty | null = null
  let company: string | null = null
  const tokens: string[] = []

  for (const part of raw.split(/\s+/).filter(Boolean)) {
    const lower = part.toLowerCase()

    // Incomplete filter prefixes — wait for more input.
    if (lower === "#" || lower === "@" || lower === "company:" || lower === "diff:" || lower === "difficulty:") {
      continue
    }

    const hashMatch = lower.match(/^#(\d+)$/)
    if (hashMatch) {
      leetcodeId = Number.parseInt(hashMatch[1], 10)
      continue
    }

    if (/^\d+$/.test(lower) && tokens.length === 0 && !leetcodeId) {
      leetcodeId = Number.parseInt(lower, 10)
      continue
    }

    const diffPrefixed = lower.match(/^diff(?:iculty)?:(.+)$/)
    if (diffPrefixed) {
      const value = DIFFICULTY_TOKEN[diffPrefixed[1]]
      if (value && DIFFICULTY_VALUES.includes(value)) {
        difficulty = value
        continue
      }
    }

    if (DIFFICULTY_TOKEN[lower] && !difficulty) {
      difficulty = DIFFICULTY_TOKEN[lower]
      continue
    }

    const companyPrefixed = lower.match(/^(?:company:|@)(.+)$/)
    if (companyPrefixed) {
      company = companyPrefixed[1]
      continue
    }

    tokens.push(lower)
  }

  return { tokens, raw, leetcodeId, difficulty, company }
}

/** True if every char of needle appears in order in haystack. */
export function fuzzySubsequence(haystack: string, needle: string): boolean {
  if (!needle) {
    return true
  }

  let index = 0
  for (const char of needle) {
    index = haystack.indexOf(char, index)
    if (index === -1) {
      return false
    }
    index += 1
  }
  return true
}

export function fuzzyTitleScore(title: string, tokens: string[]): number {
  if (tokens.length === 0) {
    return 0
  }

  const lower = title.toLowerCase()
  let score = 0

  for (const token of tokens) {
    if (lower.startsWith(token)) {
      score += 40
    } else if (lower.includes(token)) {
      score += 20
    } else if (fuzzySubsequence(lower, token)) {
      score += 8
    } else {
      return -1
    }
  }

  return score
}
