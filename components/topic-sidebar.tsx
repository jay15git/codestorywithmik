"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={isActive}
                  className="justify-between"
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
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
