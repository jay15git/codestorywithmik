import { ExternalLinkIcon, CodeIcon, MenuIcon, VideoIcon } from "lucide-react"
import Link from "next/link"

import { ButtonLink } from "@/components/button-link"
import { SearchCommand } from "@/components/search-command"
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
import {
  CONTENT_REPO_SLUG,
  ORIGINAL_REPO_SLUG,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/content/constants"
import { getContentIndex, getSearchDocuments, getTopics } from "@/lib/content/get-content"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const topics = getTopics()
  const documents = getSearchDocuments()
  const index = getContentIndex()

  const syncedDate = new Date(index.syncedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="gap-3 border-b border-sidebar-border p-4">
          <Link href="/" className="flex flex-col gap-1">
            <span className="text-sm font-semibold tracking-tight">
              codestorywithMIK
            </span>
            <span className="text-xs text-muted-foreground">
              Interview DS & Algo
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <TopicSidebar topics={topics} />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          <p>{index.solutionCount} solutions</p>
          <p className="mt-1">Synced {syncedDate}</p>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <SidebarTrigger className="md:hidden">
            <MenuIcon />
          </SidebarTrigger>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <SearchCommand documents={documents} />
          </div>

          <div className="flex items-center gap-1">
            <ButtonLink
              variant="ghost"
              size="icon"
              href={YOUTUBE_CHANNEL_URL}
              external
            >
              <VideoIcon />
            </ButtonLink>
            <ButtonLink
              variant="ghost"
              size="icon"
              href={`https://github.com/${CONTENT_REPO_SLUG}`}
              external
            >
              <CodeIcon />
            </ButtonLink>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-8 md:px-8">
          {children}
        </main>

        <footer className="border-t px-4 py-6 text-sm text-muted-foreground md:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>
              Content from{" "}
              <a
                className="underline-offset-4 hover:underline"
                href={`https://github.com/${ORIGINAL_REPO_SLUG}`}
                target="_blank"
                rel="noreferrer"
              >
                {ORIGINAL_REPO_SLUG}
              </a>{" "}
              (MIT). Maintained via{" "}
              <a
                className="underline-offset-4 hover:underline"
                href={`https://github.com/${CONTENT_REPO_SLUG}`}
                target="_blank"
                rel="noreferrer"
              >
                fork
              </a>
              .
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              Watch on YouTube
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
