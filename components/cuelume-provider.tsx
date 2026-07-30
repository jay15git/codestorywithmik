"use client"

import { bind, setEnabled } from "cuelume"
import { useEffect } from "react"

import {
  CUELUME_ENABLED_KEY,
  readCuelumeEnabled,
} from "@/lib/preferences/cuelume"

export function CuelumeProvider() {
  useEffect(() => {
    bind()
    setEnabled(readCuelumeEnabled())

    function onStorage(event: StorageEvent) {
      if (event.key !== CUELUME_ENABLED_KEY) return
      setEnabled(readCuelumeEnabled())
    }

    function onPreferenceChange() {
      setEnabled(readCuelumeEnabled())
    }

    window.addEventListener("storage", onStorage)
    window.addEventListener("cuelume-preference", onPreferenceChange)

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("cuelume-preference", onPreferenceChange)
    }
  }, [])

  return null
}
