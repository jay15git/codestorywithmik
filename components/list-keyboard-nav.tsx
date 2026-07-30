"use client"

import { useEffect, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  )
}

function getRows(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("[data-solution-row]")]
}

/** j/k list navigation among `[data-solution-row]` links. Enter opens. */
export function ListKeyboardNav({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    if (!root) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      if (isTypingTarget(event.target)) {
        return
      }
      if (!root) {
        return
      }

      const rows = getRows(root)
      if (rows.length === 0) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === "j" || key === "arrowdown") {
        event.preventDefault()
        setIndex((current) => {
          const next = current < 0 ? 0 : Math.min(current + 1, rows.length - 1)
          rows[next]?.focus()
          return next
        })
        return
      }

      if (key === "k" || key === "arrowup") {
        event.preventDefault()
        setIndex((current) => {
          const next =
            current < 0 ? 0 : Math.max(current - 1, 0)
          rows[next]?.focus()
          return next
        })
        return
      }

      if (key === "enter" && index >= 0 && rows[index]) {
        event.preventDefault()
        rows[index].click()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [root, index])

  return (
    <div ref={setRoot} className={cn(className)}>
      {children}
    </div>
  )
}
