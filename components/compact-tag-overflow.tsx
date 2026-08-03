"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDownIcon } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownContent,
  DropdownMenu,
  DropdownTrigger,
} from "@/components/ui/dropdown"
import { MenuItem } from "@/components/ui/menu-item"
import { cn } from "@/lib/utils"

export interface CompactTagItem {
  label: string
  href: string
}

interface CompactTagOverflowProps {
  items: CompactTagItem[]
  /** Optional hard cap; omit to fit as many as the column allows */
  maxVisible?: number
  className?: string
}

/** Matches Tailwind `gap-1.5` (6px) — compact two-line tag gutters */
const ITEM_GAP_PX = 6
const TAG_CLASS_NAME =
  "inline-flex h-6 max-w-[9rem] items-center overflow-hidden text-xs font-medium leading-none text-muted-foreground"

function fitsWithinRows(widths: readonly number[], containerWidth: number): boolean {
  let rows = 1
  let rowWidth = 0
  for (const width of widths) {
    const nextWidth = rowWidth === 0 ? width : rowWidth + ITEM_GAP_PX + width
    if (nextWidth <= containerWidth) {
      rowWidth = nextWidth
    } else {
      rows += 1
      rowWidth = width
    }
  }
  return rows <= 2
}

/**
 * Fit as many tags as the column allows.
 * 1. If every tag fits with no "+N" chip → show all.
 * 2. Else pick max k where tags[0..k) + gap + real "+(total-k)" chip fit.
 */
function computeVisibleCount(
  itemWidths: readonly number[],
  containerWidth: number,
  moreWidthForOverflow: (overflowCount: number) => number,
  hardCap?: number
): number {
  const total = itemWidths.length
  if (total === 0) {
    return 0
  }

  const cappedTotal =
    typeof hardCap === "number" ? Math.min(hardCap, total) : total

  // Hard cap below total always needs a more chip for the rest.
  if (cappedTotal >= total && fitsWithinRows(itemWidths, containerWidth)) {
    return total
  }

  const maxShow = Math.min(cappedTotal, total - 1)
  let best = 0

  for (let count = 1; count <= maxShow; count++) {
    const overflow = total - count
    const widths = [
      ...itemWidths.slice(0, count),
      ITEM_GAP_PX + moreWidthForOverflow(overflow),
    ]
    if (fitsWithinRows(widths, containerWidth)) {
      best = count
    }
  }

  if (best === 0 && total > 0) {
    return 1
  }

  return best
}

function moreWidthByDigits(
  measureLabel: HTMLElement,
  measureButton: HTMLElement,
  overflowCount: number,
  cache: Map<number, number>
): number {
  const digits = String(overflowCount).length
  const cached = cache.get(digits)
  if (cached !== undefined) {
    return cached
  }

  measureLabel.textContent = `+${"9".repeat(digits)}`
  const width = measureButton.offsetWidth
  cache.set(digits, width)
  return width
}

export function CompactTagOverflow({
  items,
  maxVisible,
  className,
}: CompactTagOverflowProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const moreMeasureRef = useRef<HTMLButtonElement>(null)
  const moreLabelRef = useRef<HTMLSpanElement>(null)
  const [visibleCount, setVisibleCount] = useState(items.length)

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    const moreButton = moreMeasureRef.current
    const moreLabel = moreLabelRef.current
    if (!container || !measure || !moreButton || !moreLabel) {
      return
    }

    const update = () => {
      const containerWidth = container.clientWidth
      if (containerWidth === 0) {
        return
      }

      const widths = [...measure.children].map(
        (child) => (child as HTMLElement).offsetWidth
      )
      const digitWidthCache = new Map<number, number>()
      const fitCount = computeVisibleCount(
        widths,
        containerWidth,
        (overflow) =>
          moreWidthByDigits(moreLabel, moreButton, overflow, digitWidthCache),
        maxVisible
      )

      setVisibleCount(Math.min(fitCount, items.length))
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(container)

    return () => observer.disconnect()
  }, [items, maxVisible])

  if (items.length === 0) {
    return null
  }

  const cappedVisible = Math.min(visibleCount, items.length)
  const visibleItems = items.slice(0, cappedVisible)
  const overflowItems = items.slice(cappedVisible)

  return (
    <div className={cn("pointer-events-none relative min-w-0", className)}>
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex items-center gap-2 whitespace-nowrap"
      >
        {items.map((item) => (
          <span key={item.href} className={TAG_CLASS_NAME}>
            {item.label}
          </span>
        ))}
      </div>

      <button
        ref={moreMeasureRef}
        type="button"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none invisible absolute inline-flex h-6 items-center gap-0.5 rounded-md border border-border/60 bg-muted px-2 text-xs font-medium"
      >
        <span ref={moreLabelRef}>+99</span>
        <ChevronDownIcon className="size-3" />
      </button>

      <div
        ref={containerRef}
        className="flex min-w-0 max-h-14 flex-wrap items-center gap-x-1.5 gap-y-0.5 overflow-hidden"
      >
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-cuelume-press=""
            data-cuelume-release=""
            className={cn(
              "t-tactile pointer-events-auto shrink-0 truncate transition-[color,transform] hover:text-foreground",
              TAG_CLASS_NAME
            )}
            title={item.label}
          >
            {item.label}
          </Link>
        ))}

        {overflowItems.length > 0 ? (
          <DropdownMenu>
            <DropdownTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="pointer-events-auto h-6 shrink-0 gap-0.5 px-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={(event) => event.stopPropagation()}
                />
              }
            >
              +{overflowItems.length}
              <ChevronDownIcon className="size-3" />
            </DropdownTrigger>
            <DropdownContent align="start" className="max-h-64 min-w-40">
              {overflowItems.map((item, index) => (
                <MenuItem
                  key={item.href}
                  label={item.label}
                  index={index}
                  onSelect={() => router.push(item.href)}
                />
              ))}
            </DropdownContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  )
}
