import { MenuIcon } from "lucide-react"

import { GithubRepoButton } from "@/components/github-repo-button"
import { SearchLazy } from "@/components/search-lazy"
import { SidebarBrand } from "@/components/sidebar-brand"
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
          <SidebarBrand />
        </SidebarHeader>
        <SidebarContent className="px-2 pb-4">
          <TopicSidebar topics={topics} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <SidebarTrigger className="md:hidden">
            <MenuIcon />
          </SidebarTrigger>

          <div className="flex min-w-0 flex-1" />

          <div className="flex items-center gap-2">
            <SearchLazy />
            <GithubRepoButton />
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
