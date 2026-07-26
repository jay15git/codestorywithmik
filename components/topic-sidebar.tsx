"use client"

import { usePathname } from "next/navigation"

import { LineNav } from "@/components/line-nav"
import type { Topic } from "@/lib/content/types"

interface TopicSidebarProps {
  topics: Topic[]
}

export function TopicSidebar({ topics }: TopicSidebarProps) {
  const pathname = usePathname()

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

  return (
    <LineNav
      className="w-full"
      items={items}
      activeHref={activeTopic ? `/topics/${activeTopic.slug}` : undefined}
    />
  )
}
