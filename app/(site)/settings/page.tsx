import type { Metadata } from "next"

import { DataBackupPanel } from "@/components/data-backup-panel"
import { PageHeader } from "@/components/page-header"
import { SoundPreferencePanel } from "@/components/sound-preference-panel"

export const metadata: Metadata = {
  title: "Settings",
  description: "Export or import local study data.",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Settings"
        description="Manage preferences and local study data for this browser."
      />

      <SoundPreferencePanel />
      <DataBackupPanel />
    </div>
  )
}
