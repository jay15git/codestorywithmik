import { CodeIcon, MenuIcon } from "lucide-react"

import { LogosYoutubeIcon } from "@/components/icons/logos/youtube-icon"
import Link from "next/link"

import { ButtonLink } from "@/components/button-link"
import { SearchLazy } from "@/components/search-lazy"
import { ThemeToggle } from "@/components/theme-toggle"
import { TopicSidebar } from "@/components/topic-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  CONTENT_REPO_SLUG,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/content/constants"
import { getTopics } from "@/lib/content/get-content"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const topics = getTopics()

  return (
    <SidebarProvider>
      <Sidebar
        className="[&_[data-slot=sidebar-inner]]:bg-transparent [&_[data-slot=sidebar][data-mobile=true]]:bg-transparent"
      >
        <SidebarHeader className="gap-3 p-4">
          <Link href="/" className="flex flex-col gap-1">
            <span className="text-sm font-semibold tracking-tight">
              codestorywithMIK
            </span>
            <span className="text-xs text-muted-foreground">
              Interview DS & Algo
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="flex flex-1 items-center justify-center">
          <TopicSidebar topics={topics} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <SidebarTrigger className="md:hidden">
            <MenuIcon />
          </SidebarTrigger>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <SearchLazy />
          </div>

          <div className="flex items-center gap-1">
            <ButtonLink
              variant="ghost"
              size="icon"
              href={YOUTUBE_CHANNEL_URL}
              external
              aria-label="YouTube channel"
            >
              <LogosYoutubeIcon className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              variant="ghost"
              size="icon"
              href={`https://github.com/${CONTENT_REPO_SLUG}`}
              external
              aria-label="GitHub repository"
            >
              <CodeIcon />
            </ButtonLink>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8 md:px-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
