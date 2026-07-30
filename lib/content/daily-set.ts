import type { SolutionMeta } from "@/lib/content/types"

/** FNV-1a 32-bit hash for stable deterministic picks. */
export function hashString(input: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function toDateKey(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/** ISO week key YYYY-Www (UTC). */
export function toWeekKey(date: Date): string {
  const target = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  )
  const dayNum = target.getUTCDay() || 7
  target.setUTCDate(target.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(
    ((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  )
  return `${target.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`
}

function pickUnique(
  solutions: SolutionMeta[],
  seed: string,
  count: number,
): SolutionMeta[] {
  if (solutions.length === 0 || count <= 0) {
    return []
  }

  const size = Math.min(count, solutions.length)
  const used = new Set<number>()
  const picks: SolutionMeta[] = []
  let salt = 0

  while (picks.length < size) {
    const index = hashString(`${seed}:${salt}`) % solutions.length
    salt += 1
    if (used.has(index)) {
      continue
    }
    used.add(index)
    picks.push(solutions[index])
  }

  return picks
}

export function getProblemOfTheDay(
  solutions: SolutionMeta[],
  date: Date = new Date(),
): SolutionMeta | null {
  const picks = pickUnique(solutions, `daily:${toDateKey(date)}`, 1)
  return picks[0] ?? null
}

export function getWeeklySet(
  solutions: SolutionMeta[],
  date: Date = new Date(),
  count = 7,
): SolutionMeta[] {
  return pickUnique(solutions, `weekly:${toWeekKey(date)}`, count)
}
