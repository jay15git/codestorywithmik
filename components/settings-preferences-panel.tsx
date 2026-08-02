"use client"

import { play, setEnabled } from "cuelume"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  getServerCuelumeEnabled,
  readCuelumeEnabled,
  subscribeToCuelumeEnabled,
  writeCuelumeEnabled,
} from "@/lib/preferences/cuelume"
import {
  getServerHideSolutionByDefault,
  readHideSolutionByDefault,
  subscribeToHideSolutionByDefault,
  writeHideSolutionByDefault,
} from "@/lib/preferences/hide-solution"
import {
  getServerLanguagePreference,
  readLanguagePreference,
  subscribeToLanguagePreference,
  writeLanguagePreference,
} from "@/lib/preferences/language"

const mountedSubscription = () => () => {}
const getMountedSnapshot = () => true
const getServerMountedSnapshot = () => false

function SettingRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  )
}

export function SettingsPreferencesPanel() {
  const soundEnabled = useSyncExternalStore(
    subscribeToCuelumeEnabled,
    readCuelumeEnabled,
    getServerCuelumeEnabled
  )
  const hideSolution = useSyncExternalStore(
    subscribeToHideSolutionByDefault,
    readHideSolutionByDefault,
    getServerHideSolutionByDefault
  )
  const language = useSyncExternalStore(
    subscribeToLanguagePreference,
    readLanguagePreference,
    getServerLanguagePreference
  )
  const mounted = useSyncExternalStore(
    mountedSubscription,
    getMountedSnapshot,
    getServerMountedSnapshot
  )
  const { resolvedTheme, setTheme } = useTheme()
  const darkMode = resolvedTheme === "dark"

  function toggleSound() {
    const next = !soundEnabled
    writeCuelumeEnabled(next)
    setEnabled(next)
    if (next) play("toggle")
  }

  return (
    <section
      className="divide-y rounded-lg border bg-card p-4"
      aria-label="Preferences"
    >
      <SettingRow label="Hide solution by default">
        <Switch
          label={hideSolution ? "On" : "Off"}
          checked={hideSolution}
          onToggle={() => writeHideSolutionByDefault(!hideSolution)}
        />
      </SettingRow>

      <SettingRow label="Sound">
        <Switch
          label={soundEnabled ? "On" : "Off"}
          checked={soundEnabled}
          onToggle={toggleSound}
        />
      </SettingRow>

      <SettingRow label="Dark mode">
        <Switch
          label={mounted && darkMode ? "On" : "Off"}
          checked={mounted && darkMode}
          onToggle={() => setTheme(darkMode ? "light" : "dark")}
        />
      </SettingRow>

      <SettingRow label="Default language">
        {(["cpp", "java", "python"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={language === value ? "default" : "outline"}
            aria-pressed={language === value}
            onClick={() => writeLanguagePreference(value)}
          >
            {value === "cpp" ? "C++" : value === "java" ? "Java" : "Python"}
          </Button>
        ))}
      </SettingRow>
    </section>
  )
}
