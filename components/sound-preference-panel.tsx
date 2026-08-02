"use client"

import { play, setEnabled } from "cuelume"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import {
  getServerCuelumeEnabled,
  readCuelumeEnabled,
  subscribeToCuelumeEnabled,
  writeCuelumeEnabled,
} from "@/lib/preferences/cuelume"

export function SoundPreferencePanel() {
  const enabled = useSyncExternalStore(
    subscribeToCuelumeEnabled,
    readCuelumeEnabled,
    getServerCuelumeEnabled
  )

  function toggle() {
    const next = !enabled
    writeCuelumeEnabled(next)
    setEnabled(next)
    if (next) play("toggle")
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Sound</h2>
        <p className="text-sm text-muted-foreground">
          Soft UI feedback sounds. Saved in this browser.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        data-cuelume-press={undefined}
        data-cuelume-release={undefined}
        data-cuelume-toggle={enabled ? "" : undefined}
        aria-pressed={enabled}
        onClick={toggle}
      >
        {enabled ? "Sounds on" : "Sounds muted"}
      </Button>
    </div>
  )
}
