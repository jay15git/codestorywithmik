const JUNK_TAG_PATTERNS = [
  /^</,
  /^<?\s*soon/i,
  /will\s+update/i,
  /will\s+soon\s+update/i,
  /will\s+share/i,
  /will\s+add/i,
  /will\s+udpate/i,
  /will\s+updat/i,
  /not\s+known/i,
  /not\s+yet/i,
  /not\s+sure/i,
  /let\s+me\s+know/i,
  /leetcode\s+link/i,
  /leetcode\.com/i,
  /^https?:\/\//i,
  /^everyone/i,
  /^generally\s+asked/i,
  /^similar\s+/i,
  /^variation\s+of/i,
  /^a\s+lot\s+of\s+companies/i,
  /^added\s+youtube/i,
  /^it's\s+a\s+classic/i,
  /^most\s+asked\s+online/i,
  /^online\s+assessment\)?$/i,
  /^2nd\s+technical/i,
  /^was\s+asked\s+in/i,
  /^year\s*[-=]/i,
  /^apply$/i,
  /^na$/i,
  /^nil$/i,
  /^n\/a$/i,
  /^\d{1,4}$/,
  /^\d{4}\b/,
  /^and\s+some\s+other\s+company/i,
]

export function cleanCompanyTag(tag: string): string {
  return tag
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/[)\]]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function isValidCompanyTag(tag: string): boolean {
  const cleaned = cleanCompanyTag(tag)
  if (cleaned.length < 2) {
    return false
  }

  if (!/[a-z]/i.test(cleaned)) {
    return false
  }

  return !JUNK_TAG_PATTERNS.some((pattern) => pattern.test(cleaned))
}

export function normalizeCompanyTags(tags: string[]): string[] {
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const tag of tags) {
    const cleaned = cleanCompanyTag(tag)
    if (!isValidCompanyTag(cleaned)) {
      continue
    }

    const key = cleaned.toLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    normalized.push(cleaned)
  }

  return normalized
}
