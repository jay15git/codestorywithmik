"use client"

import { play, setEnabled } from "cuelume"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Volume2Icon, VolumeXIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  CUELUME_ENABLED_KEY,
  readCuelumeEnabled,
  writeCuelumeEnabled,
} from "@/lib/preferences/cuelume"

const iconSwap = {
  duration: 0.25,
  ease: "easeInOut" as const,
}

const iconSwapHidden = {
  opacity: 0,
  filter: "blur(2px)",
  scale: 0.25,
}

const iconSwapVisible = {
  opacity: 1,
  filter: "blur(0px)",
  scale: 1,
}

export function SoundToggle() {
  const [enabled, setLocalEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : iconSwap

  useEffect(() => {
    setLocalEnabled(readCuelumeEnabled())
    setMounted(true)

    function sync() {
      setLocalEnabled(readCuelumeEnabled())
    }

    function onStorage(event: StorageEvent) {
      if (event.key !== null && event.key !== CUELUME_ENABLED_KEY) return
      sync()
    }

    window.addEventListener("cuelume-preference", sync)
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener("cuelume-preference", sync)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  function toggle() {
    const next = !enabled
    setLocalEnabled(next)
    writeCuelumeEnabled(next)
    setEnabled(next)
    if (next) play("toggle")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
      aria-pressed={mounted ? enabled : undefined}
      data-cuelume-press={undefined}
      data-cuelume-release={undefined}
      data-cuelume-toggle={enabled ? "" : undefined}
      onClick={toggle}
    >
      <span className="relative inline-grid size-4 place-items-center">
        <AnimatePresence initial={false}>
          {mounted && enabled ? (
            <motion.span
              key="on"
              className="col-start-1 row-start-1 inline-flex"
              initial={iconSwapHidden}
              animate={iconSwapVisible}
              exit={iconSwapHidden}
              transition={transition}
            >
              <Volume2Icon />
            </motion.span>
          ) : mounted ? (
            <motion.span
              key="off"
              className="col-start-1 row-start-1 inline-flex"
              initial={iconSwapHidden}
              animate={iconSwapVisible}
              exit={iconSwapHidden}
              transition={transition}
            >
              <VolumeXIcon />
            </motion.span>
          ) : (
            <span
              className="col-start-1 row-start-1 inline-flex opacity-0"
              aria-hidden
            >
              <Volume2Icon />
            </span>
          )}
        </AnimatePresence>
      </span>
    </Button>
  )
}
