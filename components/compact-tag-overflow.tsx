"use client"

import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface CompactTagItem {
  label: string
  href: string
}

interface CompactTagOverflowProps {
  items: CompactTagItem[]
  /** Hard cap on visible tags even when space allows more */
  maxVisible?: number
  className?: string
}

const ITEM_GAP_PX = 10
const SEPARATOR_WIDTH_PX = 10

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
    const separator = count > 0 ? SEPARATOR_WIDTH_PX : 0
    const itemWidth = itemWidths[index]
    const remaining = total - index - 1
    const moreReserve = remaining > 0 ? ITEM_GAP_PX + moreButtonWidth : 0
    const nextUsed = used + separator + itemWidth + moreReserve

    if (nextUsed <= containerWidth) {
      used += separator + itemWidth
      count = index + 1
      continue
    }

    const fitsWithoutMore = used + separator + itemWidth <= containerWidth
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
  maxVisible = 4,
  className,
}: CompactTagOverflowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const moreMeasureRef = useRef<HTMLButtonElement>(null)
  const [visibleCount, setVisibleCount] = useState(
    Math.min(items.length, maxVisible),
  )

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

      setVisibleCount(Math.min(fitCount, maxVisible, items.length))
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(container)

    return () => observer.disconnect()
  }, [items, maxVisible])

  if (items.length === 0) {
    return null
  }

  const cappedVisible = Math.min(visibleCount, maxVisible, items.length)
  const visibleItems = items.slice(0, cappedVisible)
  const overflowItems = items.slice(cappedVisible)

  return (
    <div className={cn("relative min-w-0", className)}>
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute flex items-center gap-2.5 whitespace-nowrap"
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
        +99 more
        <ChevronDownIcon className="size-3" />
      </button>

      <div
        ref={containerRef}
        className="flex min-w-0 items-center gap-2.5 overflow-hidden whitespace-nowrap"
      >
        {visibleItems.map((item, index) => (
          <span key={item.href} className="inline-flex shrink-0 items-center">
            {index > 0 ? (
              <span className="mr-2.5 text-xs text-muted-foreground">·</span>
            ) : null}
            <Link
              href={item.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </span>
        ))}

        {overflowItems.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 shrink-0 gap-0.5 px-1.5 text-xs text-muted-foreground hover:text-foreground"
                  onClick={(event) => event.stopPropagation()}
                />
              }
            >
              +{overflowItems.length} more
              <ChevronDownIcon className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-64 w-56">
              {overflowItems.map((item) => (
                <DropdownMenuItem
                  key={item.href}
                  render={<Link href={item.href} />}
                >
                  <span className="truncate">{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  )
}
