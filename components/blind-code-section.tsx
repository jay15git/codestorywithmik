"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { SolutionStudyHotkeys } from "@/components/solution-study-hotkeys"
import {
  getServerHideSolutionByDefault,
  readHideSolutionByDefault,
  subscribeToHideSolutionByDefault,
} from "@/lib/preferences/hide-solution"
import { cn } from "@/lib/utils"

interface BlindModeContextValue {
  blind: boolean
  toggleBlind: () => void
  setBlind: (value: boolean) => void
}

const BlindModeContext = createContext<BlindModeContextValue | null>(null)

export function useBlindMode(): BlindModeContextValue | null {
  return useContext(BlindModeContext)
}

export function BlindCodeSection({
  children,
  className,
  slug,
}: {
  children: ReactNode
  className?: string
  /** Enables s/d/b study hotkeys for this solution. */
  slug?: string
}) {
  const hideSolutionByDefault = useSyncExternalStore(
    subscribeToHideSolutionByDefault,
    readHideSolutionByDefault,
    getServerHideSolutionByDefault
  )
  const [blindOverride, setBlindOverride] = useState<boolean | null>(null)
  const blind = blindOverride ?? hideSolutionByDefault
  const reduceMotion = useReducedMotion()
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: "easeInOut" as const }

  const toggleBlind = useCallback(() => {
    setBlindOverride((value) => !(value ?? hideSolutionByDefault))
  }, [hideSolutionByDefault])

  const contextValue = useMemo(
    () => ({ blind, toggleBlind, setBlind: setBlindOverride }),
    [blind, toggleBlind]
  )

  return (
    <BlindModeContext.Provider value={contextValue}>
      {slug ? <SolutionStudyHotkeys slug={slug} /> : null}
      <section className={cn("flex flex-col gap-3", className)}>
        <div className="flex h-8 items-center">
          {!blind ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBlindOverride(true)}
            >
              Hide solution
            </Button>
          ) : null}
        </div>

        <div className="relative">
          <div
            className={cn(
              "duration-fast transition-[filter,opacity] ease-in-out",
              blind && "pointer-events-none opacity-65 blur-[3px] select-none"
            )}
            aria-hidden={blind}
            inert={blind ? true : undefined}
          >
            {children}
          </div>

          <AnimatePresence initial={false}>
            {blind ? (
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-lg border border-dashed bg-background/30 px-4 text-center backdrop-blur-[1px]"
                initial={{ opacity: 0, filter: "blur(2px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(2px)" }}
                transition={transition}
              >
                <div className="flex max-w-md flex-col items-center gap-5 px-6 py-5">
                  <p className="text-base font-semibold text-foreground sm:text-lg">
                    Solve first, then reveal.
                  </p>
                  <Button type="button" onClick={() => setBlindOverride(false)}>
                    Reveal code
                  </Button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </BlindModeContext.Provider>
  )
}
