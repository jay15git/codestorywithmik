import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { SettingsPreferencesPanel } from "@/components/settings-preferences-panel"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage local study preferences.",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" />

      <SettingsPreferencesPanel />
    </div>
  )
}
