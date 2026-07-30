"use client"

import { useEffect } from "react"

import { useBlindMode } from "@/components/blind-code-section"
import { useSolutionProgress } from "@/components/solution-progress-provider"

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

/** Solution page hotkeys: s star, d done/solved, b blind toggle. */
export function SolutionStudyHotkeys({ slug }: { slug: string }) {
  const { toggleFlag } = useSolutionProgress()
  const blind = useBlindMode()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      if (isTypingTarget(event.target)) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === "s") {
        event.preventDefault()
        toggleFlag(slug, "starred")
        return
      }

      if (key === "d") {
        event.preventDefault()
        toggleFlag(slug, "solved")
        return
      }

      if (key === "b" && blind) {
        event.preventDefault()
        blind.toggleBlind()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [slug, toggleFlag, blind])

  return null
}
