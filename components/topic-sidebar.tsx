"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { LineNav } from "@/components/line-nav"
import type { Topic } from "@/lib/content/types"
import { cn } from "@/lib/utils"

interface TopicSidebarProps {
  topics: Topic[]
}

const QUICK_LINKS = [
  { href: "/problems", label: "Problems", match: "/problems" },
  { href: "/plans", label: "Plans", match: "/plans" },
  { href: "/daily", label: "Daily", match: "/daily" },
  { href: "/review", label: "Review", match: "/review" },
  { href: "/settings", label: "Settings", match: "/settings" },
] as const

export function TopicSidebar({ topics }: TopicSidebarProps) {
  const pathname = usePathname()
  const activeItemRef = useRef<HTMLAnchorElement | null>(null)

  const activeTopic = topics.find(
    (topic) =>
      pathname === `/topics/${topic.slug}` ||
      pathname.startsWith(`/topics/${topic.slug}/`),
  )

  const items = topics.map((topic) => ({
    title: topic.name,
    prefix: String(topic.solutionCount),
    href: `/topics/${topic.slug}`,
  }))

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: "nearest" })
  }, [pathname])

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        {QUICK_LINKS.map((link) => {
          const active =
            pathname === link.match || pathname.startsWith(`${link.match}/`)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
      <LineNav
        className="w-full"
        items={items}
        activeHref={activeTopic ? `/topics/${activeTopic.slug}` : undefined}
        activeItemRef={activeItemRef}
      />
    </div>
  )
}
