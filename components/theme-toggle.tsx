"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

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

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const transition = reduceMotion ? { duration: 0 } : iconSwap

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative inline-grid size-4 place-items-center">
        <AnimatePresence initial={false}>
          {mounted && isDark ? (
            <motion.span
              key="sun"
              className="col-start-1 row-start-1 inline-flex"
              initial={iconSwapHidden}
              animate={iconSwapVisible}
              exit={iconSwapHidden}
              transition={transition}
            >
              <SunIcon />
            </motion.span>
          ) : mounted ? (
            <motion.span
              key="moon"
              className="col-start-1 row-start-1 inline-flex"
              initial={iconSwapHidden}
              animate={iconSwapVisible}
              exit={iconSwapHidden}
              transition={transition}
            >
              <MoonIcon />
            </motion.span>
          ) : (
            <span className="col-start-1 row-start-1 inline-flex opacity-0" aria-hidden>
              <MoonIcon />
            </span>
          )}
        </AnimatePresence>
      </span>
    </Button>
  )
}
