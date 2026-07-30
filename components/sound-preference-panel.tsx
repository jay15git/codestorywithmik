"use client"

import { play, setEnabled } from "cuelume"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  CUELUME_ENABLED_KEY,
  readCuelumeEnabled,
  writeCuelumeEnabled,
} from "@/lib/preferences/cuelume"

export function SoundPreferencePanel() {
  const [enabled, setLocalEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocalEnabled(readCuelumeEnabled())
    setMounted(true)

    function sync() {
      setLocalEnabled(readCuelumeEnabled())
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== CUELUME_ENABLED_KEY && event.key !== null) return
      sync()
    }

    window.addEventListener("cuelume-preference", sync)
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener("cuelume-preference", sync)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  function toggle() {
    const next = !enabled
    setLocalEnabled(next)
    writeCuelumeEnabled(next)
    setEnabled(next)
    if (next) play("toggle")
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Sound</h2>
        <p className="text-sm text-muted-foreground">
          Soft interaction cues for buttons, navigation, and successful actions.
          Stored only in this browser. Same control as the header speaker icon.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          data-cuelume-press={undefined}
          data-cuelume-release={undefined}
          data-cuelume-toggle={enabled ? "" : undefined}
          aria-pressed={mounted ? enabled : undefined}
          onClick={toggle}
        >
          {mounted ? (enabled ? "Sounds on" : "Sounds muted") : "Sounds on"}
        </Button>
        <p className="text-sm text-muted-foreground">
          {mounted
            ? enabled
              ? "Playing UI feedback sounds."
              : "All interaction sounds are muted."
            : "Loading preference…"}
        </p>
      </div>
    </div>
  )
}
