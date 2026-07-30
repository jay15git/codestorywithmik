export const CUELUME_ENABLED_KEY = "leetseek-cuelume-enabled"

export function readCuelumeEnabled(): boolean {
  if (typeof window === "undefined") return true

  try {
    const raw = window.localStorage.getItem(CUELUME_ENABLED_KEY)
    if (raw === null) return true
    return raw === "true"
  } catch {
    return true
  }
}

export function writeCuelumeEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(CUELUME_ENABLED_KEY, String(enabled))
  } catch {
    // ignore quota / private mode
  }

  window.dispatchEvent?.(new Event("cuelume-preference"))
}
