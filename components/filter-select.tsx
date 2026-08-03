"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
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

  return (
    <Select
      multiple={multiple}
      value={
        multiple
          ? open
            ? draft
            : values
          : ((open ? draft[0] : values[0]) ?? "")
      }
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          const committed = multiple ? draft : draft[0] ? [draft[0]] : []
          if (!sameStringList(committed, values)) {
            onCommit(committed)
          }
        } else {
          setDraft(values)
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
      <SelectTrigger className={cn("t-resize w-fit min-w-0", className)}>
        {(selected) => {
          const selectedValues = Array.isArray(selected)
            ? selected
            : selected
              ? [selected]
              : []
          const activeValues = selectedValues.filter(
            (value) =>
              options.find((option) => option.value === value)?.label !==
              emptyLabel
          )
          return (
            <>
              <span className="shrink-0">{label}</span>
              {activeValues.length > 0 ? (
                <span className="ml-1 shrink-0 text-muted-foreground">
                  ({activeValues.length})
                </span>
              ) : null}
            </>
          )
        }}
      </SelectTrigger>
      <SelectContent
        // Reserve menu width up front. Every row already reserves a checkmark
        // slot, and this keeps the popup itself from resizing when selection
        // state changes.
        className={cn("max-h-80 w-64 max-w-64 min-w-64", menuClassName)}
      >
        {options.map((option, index) => (
          <SelectItem key={option.value} value={option.value} index={index}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
