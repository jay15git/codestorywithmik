"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { formatMultiLabel } from "@/lib/content/filter-solutions"
import { cn } from "@/lib/utils"

function sameStringList(left: string[], right: string[]) {
  if (left.length !== right.length) return false
  const rightSet = new Set(right)
  return left.every((value) => rightSet.has(value))
}

export function FilterSelect({
  label,
  emptyLabel,
  values,
  options,
  onCommit,
  className,
  menuClassName,
  multiple = true,
}: {
  label: string
  emptyLabel: string
  values: string[]
  options: Array<{ label: string; value: string }>
  onCommit: (next: string[]) => void
  className?: string
  menuClassName?: string
  multiple?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(values)
  const draftRef = useRef(draft)
  draftRef.current = draft

  useEffect(() => {
    if (!open) {
      setDraft(values)
    }
  }, [values, open])

  const labelMap = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])),
    [options],
  )

  return (
    <Select
      multiple={multiple}
      value={multiple ? draft : (draft[0] ?? "")}
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          const committed = multiple
            ? draftRef.current
            : draftRef.current[0]
              ? [draftRef.current[0]]
              : []
          if (!sameStringList(committed, values)) {
            onCommit(committed)
          }
        }
        setOpen(next)
      }}
      onValueChange={(next) => {
        if (multiple) {
          setDraft(Array.isArray(next) ? next : [])
          return
        }
        setDraft(typeof next === "string" && next ? [next] : [])
      }}
    >
      <SelectTrigger className={cn("min-w-40", className)}>
        {(selected) => {
          const selectedValues = Array.isArray(selected)
            ? selected
            : selected
              ? [selected]
              : []
          return (
            <>
              <span className="text-muted-foreground">{label}: </span>
              {formatMultiLabel(selectedValues, emptyLabel, labelMap)}
            </>
          )
        }}
      </SelectTrigger>
      <SelectContent className={cn("max-h-80", menuClassName)}>
        {options.map((option, index) => (
          <SelectItem key={option.value} value={option.value} index={index}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
