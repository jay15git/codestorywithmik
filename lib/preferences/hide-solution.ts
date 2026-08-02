const HIDE_SOLUTION_BY_DEFAULT_KEY = "hide-solution-by-default-v1"
const HIDE_SOLUTION_PREFERENCE_EVENT = "hide-solution-preference"

export function readHideSolutionByDefault(): boolean {
  if (typeof window === "undefined") return true

  try {
    const value = window.localStorage.getItem(HIDE_SOLUTION_BY_DEFAULT_KEY)
    return value === null ? true : value === "true"
  } catch {
    return true
  }
}

export function writeHideSolutionByDefault(value: boolean): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(HIDE_SOLUTION_BY_DEFAULT_KEY, String(value))
  } catch {
    // Ignore quota and private-mode storage failures.
  }

  window.dispatchEvent?.(new Event(HIDE_SOLUTION_PREFERENCE_EVENT))
}

export function subscribeToHideSolutionByDefault(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== null && event.key !== HIDE_SOLUTION_BY_DEFAULT_KEY) return
    listener()
  }

  window.addEventListener(HIDE_SOLUTION_PREFERENCE_EVENT, listener)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(HIDE_SOLUTION_PREFERENCE_EVENT, listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function getServerHideSolutionByDefault(): boolean {
  return true
}
