import { GithubRepoButton } from "@/components/github-repo-button"
import { ProgressSidebarSummary } from "@/components/progress-sidebar-summary"
import { SearchLazy } from "@/components/search-lazy"
import { SidebarBrand } from "@/components/sidebar-brand"
import { SiteNav } from "@/components/site-nav"
import { SiteProviders } from "@/components/site-providers"
import { SoundToggle } from "@/components/sound-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { TopicSidebar } from "@/components/topic-sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getContentIndex, getTopics } from "@/lib/content/get-content"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const topics = getTopics()
  const { solutionCount } = getContentIndex()

  return (
    <SiteProviders>
      <SidebarProvider>
        <a
          href="#main-content"
          className="fixed start-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-surface-3 transition-transform focus-visible:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
        >
          Skip to content
        </a>
        <Sidebar className="[&_[data-slot=sidebar-inner]]:bg-transparent [&_[data-slot=sidebar][data-mobile=true]]:bg-transparent">
          <SidebarHeader className="gap-3 p-4">
            <SidebarBrand />
          </SidebarHeader>
          <SidebarContent className="px-2 pb-4">
            <TopicSidebar topics={topics} />
          </SidebarContent>
          <SidebarFooter className="pb-4">
            <ProgressSidebarSummary totalSolutions={solutionCount} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="app-safe-inline sticky top-0 z-20 flex min-h-14 items-center gap-1 bg-background/90 py-1 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:gap-2">
            <SidebarTrigger />
            <SiteNav className="min-w-0 flex-1" />
            <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
              <SearchLazy />
              <div className="hidden lg:block">
                <GithubRepoButton />
              </div>
              <div className="hidden md:block">
                <SoundToggle />
              </div>
              <ThemeToggle />
            </div>
          </header>

          <main
            id="main-content"
            tabIndex={-1}
            className="page-shell mx-auto w-full max-w-6xl min-w-0 flex-1 py-6 outline-none sm:py-8"
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SiteProviders>
  )
}
