"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  sidebarMenuButtonVariants,
} from "@/components/ui/sidebar"
import type { Topic } from "@/lib/content/types"
import { cn } from "@/lib/utils"

interface TopicSidebarProps {
  topics: Topic[]
}

export function TopicSidebar({ topics }: TopicSidebarProps) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Topics</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {topics.map((topic) => {
            const href = `/topics/${topic.slug}`
            const isActive = pathname === href || pathname.startsWith(`${href}/`)

            return (
              <SidebarMenuItem key={topic.slug}>
                <Link
                  href={href}
                  data-active={isActive}
                  className={cn(
                    sidebarMenuButtonVariants(),
                    "justify-between",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <span className="truncate">{topic.name}</span>
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 text-xs tabular-nums",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {topic.solutionCount}
                  </span>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
