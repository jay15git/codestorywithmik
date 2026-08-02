export const CUELUME_ENABLED_KEY = "leetseek-cuelume-enabled"
const CUELUME_PREFERENCE_EVENT = "cuelume-preference"

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

  window.dispatchEvent?.(new Event(CUELUME_PREFERENCE_EVENT))
}

export function subscribeToCuelumeEnabled(onStoreChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== null && event.key !== CUELUME_ENABLED_KEY) return
    onStoreChange()
  }

  window.addEventListener(CUELUME_PREFERENCE_EVENT, onStoreChange)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(CUELUME_PREFERENCE_EVENT, onStoreChange)
    window.removeEventListener("storage", onStorage)
  }
}

export function getServerCuelumeEnabled() {
  return true
}
