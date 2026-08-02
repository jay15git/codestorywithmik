"use client"

import { play, setEnabled } from "cuelume"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Volume2Icon, VolumeXIcon } from "lucide-react"
import { useSyncExternalStore } from "react"

import { Button } from "@/components/ui/button"
import {
  getServerCuelumeEnabled,
  readCuelumeEnabled,
  subscribeToCuelumeEnabled,
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
  const enabled = useSyncExternalStore(
    subscribeToCuelumeEnabled,
    readCuelumeEnabled,
    getServerCuelumeEnabled
  )
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion ? { duration: 0 } : iconSwap

  function toggle() {
    const next = !enabled
    writeCuelumeEnabled(next)
    setEnabled(next)
    if (next) play("toggle")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={enabled ? "Mute sounds" : "Unmute sounds"}
      aria-pressed={enabled}
      data-cuelume-press={undefined}
      data-cuelume-release={undefined}
      data-cuelume-toggle={enabled ? "" : undefined}
      onClick={toggle}
    >
      <span className="relative inline-grid size-4 place-items-center">
        <AnimatePresence initial={false}>
          {enabled ? (
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
          ) : (
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
          )}
        </AnimatePresence>
      </span>
    </Button>
  )
}
