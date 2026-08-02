import type { Metadata } from "next"

import { DataBackupPanel } from "@/components/data-backup-panel"
import { SoundPreferencePanel } from "@/components/sound-preference-panel"

export const metadata: Metadata = {
  title: "Settings",
  description: "Export or import local study data.",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="max-w-2xl text-muted-foreground">
          Local study data for this browser.
        </p>
      </section>

      <SoundPreferencePanel />
      <DataBackupPanel />
    </div>
  )
}
