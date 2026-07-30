import type { Metadata } from "next"

import { DataBackupPanel } from "@/components/data-backup-panel"

export const metadata: Metadata = {
  title: "Settings — Interview Solutions",
  description:
    "Export or import local study data: progress, notes, and review cards.",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="max-w-2xl text-muted-foreground">
          Manage local study data stored in your browser.
        </p>
      </section>

      <DataBackupPanel />
    </div>
  )
}
