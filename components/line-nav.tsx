/**
 * This component is inspired by Devouring Details and Skiper UI.
 */

"use client"

import Link from "next/link"
import { memo, useEffect, useRef } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

const MotionLink = motion.create(Link)

const lineVariants = {
  normal: { width: 24 },
  active: { width: 40 },
  hover: { width: 40 },
}

export type LineNavItem = {
  title: string
  href: string
  prefix?: string
}

export type LineNavProps = {
  className?: string
  items: LineNavItem[]
  activeHref?: string
  scrollActiveIntoView?: boolean
  onItemClick?: (
    item: LineNavItem,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void
}

export function LineNav({
  className,
  items,
  activeHref,
  scrollActiveIntoView = true,
  onItemClick,
}: LineNavProps) {
  const activeItemRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (scrollActiveIntoView) {
      activeItemRef.current?.scrollIntoView({ block: "center" })
    }
  }, [scrollActiveIntoView])

  return (
    <nav
      className={cn("flex flex-col gap-2 py-5.25", className)}
      style={
        {
          "--line-nav-width": `${lineVariants.normal.width}px`,
        } as React.CSSProperties
      }
    >
      {items.map((item, index) => {
        const isActive = item.href === activeHref

        return (
          <LineNavItem
            key={item.href}
            ref={isActive ? activeItemRef : undefined}
            title={item.title}
            href={item.href}
            prefix={item.prefix}
            active={isActive}
            isLast={index === items.length - 1}
            onClick={
              onItemClick ? (event) => onItemClick(item, event) : undefined
            }
          />
        )
      })}
    </nav>
  )
}

const LineNavItem = memo(function LineNavItem({
  ref,
  title,
  href,
  prefix,
  active = false,
  isLast = false,
  onClick,
}: {
  ref?: React.Ref<HTMLAnchorElement>
  title: string
  href: string
  prefix?: string
  active?: boolean
  isLast?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <>
      <MotionLink
        ref={ref}
        aria-current={active ? "page" : undefined}
        className="group/line-nav relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5"
        href={href}
        initial={false}
        animate={active ? "active" : "normal"}
        whileHover="hover"
        onClick={onClick}
      >
        <motion.span
          className="block h-px shrink-0 bg-foreground/20 transition-[background-color] ease-out group-hover/line-nav:bg-foreground group-aria-[current=page]/line-nav:bg-foreground"
          variants={lineVariants}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <span
          className="flex items-center whitespace-nowrap text-sm text-muted-foreground transition-[color] ease-out group-hover/line-nav:text-foreground group-aria-[current=page]/line-nav:text-foreground"
        >
          {prefix && (
            <span
              className="mr-4 min-w-[1.25rem] text-xs tabular-nums text-muted-foreground/40 group-hover/line-nav:text-muted-foreground/60 group-aria-[current=page]/line-nav:text-muted-foreground/70"
            >
              {prefix}
            </span>
          )}
          <span>{title}</span>
        </span>
      </MotionLink>

      {!isLast && (
        <>
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
        </>
      )}
    </>
  )
})
