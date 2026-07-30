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

/** Matches Tailwind `gap-1.5` (6px) — tight space between tags */
const ITEM_GAP_PX = 6

function computeVisibleCount(
  itemWidths: readonly number[],
  containerWidth: number,
  moreButtonWidth: number,
): number {
  const total = itemWidths.length
  if (total === 0) {
    return 0
  }

  let used = 0
  let count = 0

  for (let index = 0; index < total; index++) {
    const gap = count > 0 ? ITEM_GAP_PX : 0
    const itemWidth = itemWidths[index]
    const remaining = total - index - 1
    const moreReserve = remaining > 0 ? ITEM_GAP_PX + moreButtonWidth : 0
    const nextUsed = used + gap + itemWidth + moreReserve

    if (nextUsed <= containerWidth) {
      used += gap + itemWidth
      count = index + 1
      continue
    }

    const fitsWithoutMore = used + gap + itemWidth <= containerWidth
    if (remaining === 0 && fitsWithoutMore) {
      count = index + 1
    }

    break
  }

  if (count === 0 && total > 0) {
    return 1
  }

  return count
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
  const [visibleCount, setVisibleCount] = useState(items.length)

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    const moreButton = moreMeasureRef.current
    if (!container || !measure || !moreButton) {
      return
    }

    const update = () => {
      const containerWidth = container.clientWidth
      if (containerWidth === 0) {
        return
      }

      const widths = [...measure.children].map(
        (child) => (child as HTMLElement).offsetWidth,
      )
      const moreWidth = moreButton.offsetWidth
      const fitCount = computeVisibleCount(widths, containerWidth, moreWidth)
      const capped =
        typeof maxVisible === "number"
          ? Math.min(fitCount, maxVisible, items.length)
          : Math.min(fitCount, items.length)

      setVisibleCount(capped)
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
        className="pointer-events-none invisible absolute flex items-center gap-1.5 whitespace-nowrap"
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
        +99
        <ChevronDownIcon className="size-3" />
      </button>

      <div
        ref={containerRef}
        className="flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap"
      >
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
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
