import { GithubRepoButton } from "@/components/github-repo-button"
import { ProgressSidebarSummary } from "@/components/progress-sidebar-summary"
import { SearchLazy } from "@/components/search-lazy"
import { SidebarBrand } from "@/components/sidebar-brand"
import { SiteNav } from "@/components/site-nav"
import { SolutionProgressProvider } from "@/components/solution-progress-provider"
import { StudyStorageProvider } from "@/components/study-storage-provider"
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
    <StudyStorageProvider>
      <SolutionProgressProvider>
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
            <SidebarFooter className="pb-4">
              <ProgressSidebarSummary totalSolutions={solutionCount} />
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>

          <SidebarInset>
            <header className="sticky top-0 z-20 flex h-14 items-center gap-2 bg-background/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:gap-3 sm:px-4">
              <SidebarTrigger />
              <SiteNav className="min-w-0 flex-1" />
              <div className="flex shrink-0 items-center gap-2">
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
      </SolutionProgressProvider>
    </StudyStorageProvider>
  )
}
