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

/** Matches Tailwind `gap-2` (8px) — tag cluster gutters */
const ITEM_GAP_PX = 8

function sumItemWidths(itemWidths: readonly number[], count: number): number {
  let sum = 0
  for (let index = 0; index < count; index++) {
    sum += itemWidths[index] + (index > 0 ? ITEM_GAP_PX : 0)
  }
  return sum
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
  if (
    cappedTotal >= total &&
    sumItemWidths(itemWidths, total) <= containerWidth
  ) {
    return total
  }

  const maxShow = Math.min(cappedTotal, total - 1)
  let best = 0

  for (let count = 1; count <= maxShow; count++) {
    const overflow = total - count
    const used =
      sumItemWidths(itemWidths, count) +
      ITEM_GAP_PX +
      moreWidthForOverflow(overflow)

    if (used <= containerWidth) {
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
    <div className={cn("relative min-w-0", className)}>
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex items-center gap-2 whitespace-nowrap"
      >
        {items.map((item) => (
          <span key={item.href} className="text-xs font-medium">
            {item.label}
          </span>
        ))}
      </div>

      <button
        ref={moreMeasureRef}
        type="button"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none invisible absolute inline-flex items-center gap-0.5 px-1.5 text-xs font-medium"
      >
        <span ref={moreLabelRef}>+99</span>
        <ChevronDownIcon className="size-3" />
      </button>

      <div
        ref={containerRef}
        className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap"
      >
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            data-cuelume-press=""
            data-cuelume-release=""
            className="t-tactile shrink-0 text-xs font-medium text-muted-foreground transition-[color,transform] hover:text-foreground"
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
                  className="h-6 shrink-0 gap-0.5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
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
