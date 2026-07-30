"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { EyeIcon, EyeOffIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SolutionStudyHotkeys } from "@/components/solution-study-hotkeys"
import { cn } from "@/lib/utils"

const TIMER_PRESETS_SEC = [15 * 60, 20 * 60, 30 * 60] as const

interface BlindModeContextValue {
  blind: boolean
  toggleBlind: () => void
  setBlind: (value: boolean) => void
}

const BlindModeContext = createContext<BlindModeContextValue | null>(null)

export function useBlindMode(): BlindModeContextValue | null {
  return useContext(BlindModeContext)
}

function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
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
  const [blind, setBlind] = useState(true)
  const [running, setRunning] = useState(false)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [targetSec, setTargetSec] = useState<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  const toggleBlind = useCallback(() => {
    setBlind((value) => !value)
  }, [])

  const clearTimer = useEffectEvent(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  })

  useEffect(() => {
    if (!running) {
      clearTimer()
      return
    }

    intervalRef.current = window.setInterval(() => {
      setElapsedSec((value) => value + 1)
    }, 1000)

    return () => clearTimer()
  }, [running])

  const overtime = targetSec !== null && elapsedSec >= targetSec

  const contextValue = useMemo(
    () => ({ blind, toggleBlind, setBlind }),
    [blind, toggleBlind],
  )

  return (
    <BlindModeContext.Provider value={contextValue}>
      {slug ? <SolutionStudyHotkeys slug={slug} /> : null}
      <section className={cn("flex flex-col gap-3", className)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={blind ? "default" : "outline"}
              size="sm"
              aria-pressed={blind}
              onClick={toggleBlind}
            >
              {blind ? (
                <EyeOffIcon data-icon="inline-start" />
              ) : (
                <EyeIcon data-icon="inline-start" />
              )}
              {blind ? "Blind on" : "Code visible"}
            </Button>

            {blind ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setBlind(false)}
              >
                Reveal code
              </Button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "min-w-14 font-mono text-sm tabular-nums",
                overtime ? "text-destructive" : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {formatTime(elapsedSec)}
              {targetSec !== null ? (
                <span className="text-muted-foreground">
                  {" "}
                  / {formatTime(targetSec)}
                </span>
              ) : null}
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={running ? "Pause timer" : "Start timer"}
              onClick={() => setRunning((value) => !value)}
            >
              {running ? (
                <PauseIcon data-icon="inline-start" />
              ) : (
                <PlayIcon data-icon="inline-start" />
              )}
              {running ? "Pause" : "Timer"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Reset timer"
              onClick={() => {
                setRunning(false)
                setElapsedSec(0)
              }}
            >
              <RotateCcwIcon data-icon="inline-start" />
              Reset
            </Button>

            <div className="flex items-center gap-1">
              {TIMER_PRESETS_SEC.map((seconds) => (
                <Button
                  key={seconds}
                  type="button"
                  variant={targetSec === seconds ? "secondary" : "ghost"}
                  size="sm"
                  className="px-2 tabular-nums"
                  aria-pressed={targetSec === seconds}
                  onClick={() => {
                    setTargetSec((current) =>
                      current === seconds ? null : seconds,
                    )
                    setElapsedSec(0)
                    setRunning(true)
                  }}
                >
                  {seconds / 60}m
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className={cn(blind && "select-none blur-md")}
            aria-hidden={blind}
            inert={blind ? true : undefined}
          >
            {children}
          </div>

          {blind ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-dashed bg-background/70 px-4 text-center backdrop-blur-[2px]">
              <div className="flex max-w-sm flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Code hidden. Solve on LeetCode first, then reveal.
                </p>
                <Button type="button" size="sm" onClick={() => setBlind(false)}>
                  Reveal code
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </BlindModeContext.Provider>
  )
}
