export function toUtcDateKeyFromDate(date: Date): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const day = String(date.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function utcDateKeyToDate(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00.000Z`)
}

export function toUtcDateKey(date: Date = new Date()): string {
  return toUtcDateKeyFromDate(date)
}

export function addUtcDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return toUtcDateKey(date)
}

export function compareDateKeys(left: string, right: string): number {
  return left.localeCompare(right)
}

export function isDueOnOrBefore(dueAt: string, today: string): boolean {
  return compareDateKeys(dueAt, today) <= 0
}
