"use client"

import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  clearStudyBag,
  exportStudyBag,
  parseStudyBackup,
  replaceStudyBag,
} from "@/lib/storage/study-bag"

function backupFilename() {
  const date = new Date().toISOString().slice(0, 10)
  return `leetseek-backup-${date}.json`
}

export function DataBackupPanel() {
  const importStatusId = "backup-import-status"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pendingImport, setPendingImport] = useState<string | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [clearOpen, setClearOpen] = useState(false)

  function handleExport() {
    const backup = exportStudyBag()
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = backupFilename()
    anchor.click()
    URL.revokeObjectURL(url)
    setStatusMessage("Backup downloaded.")
    setImportError(null)
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown
        parseStudyBackup(parsed)
        setPendingImport(String(reader.result))
        setImportError(null)
      } catch {
        setImportError("Choose a valid LeetSeek backup JSON file.")
        setStatusMessage(null)
        setPendingImport(null)
      }
    }
    reader.readAsText(file)
  }

  function confirmImport() {
    if (!pendingImport) return

    try {
      const bag = parseStudyBackup(JSON.parse(pendingImport) as unknown)
      replaceStudyBag(bag)
      setPendingImport(null)
      setStatusMessage("Backup imported. Local study data replaced.")
      setImportError(null)
    } catch {
      setImportError("Could not import backup.")
      setPendingImport(null)
    }
  }

  function confirmClear() {
    clearStudyBag()
    setClearOpen(false)
    setStatusMessage("Local study data cleared.")
    setImportError(null)
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Data</h2>
        <p className="text-sm text-muted-foreground">
          Progress, notes, review cards, and preferences stay in this browser.
          Export before clearing site data or switching devices.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={handleExport}>
          Export backup
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-describedby={importStatusId}
          onClick={() => fileInputRef.current?.click()}
        >
          Import backup
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => setClearOpen(true)}
        >
          Clear local data
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFileChange}
      />

      <div id={importStatusId} aria-live="polite">
        {statusMessage ? (
          <p role="status" className="text-sm text-muted-foreground">
            {statusMessage}
          </p>
        ) : null}
        {importError ? (
          <p role="alert" className="text-sm text-destructive">
            {importError}
          </p>
        ) : null}
      </div>

      <Dialog
        open={pendingImport !== null}
        onOpenChange={(open) => {
          if (!open) setPendingImport(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace all local data?</DialogTitle>
            <DialogDescription>
              Replaces progress, notes, review cards, and preferences on this
              device.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingImport(null)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmImport}>
              Import and replace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear local study data?</DialogTitle>
            <DialogDescription>
              Removes progress, notes, review cards, and preferences from this
              browser. Export first if you need them later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setClearOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmClear}>
              Clear data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
