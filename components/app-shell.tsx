import { ExternalLinkIcon, CodeIcon, MenuIcon } from "lucide-react"

import { LogosYoutubeIcon } from "@/components/icons/logos/youtube-icon"
import Link from "next/link"

import { ButtonLink } from "@/components/button-link"
import { SearchCommand } from "@/components/search-command"
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
  ORIGINAL_REPO_SLUG,
  YOUTUBE_CHANNEL_URL,
} from "@/lib/content/constants"
import { getSearchDocuments, getTopics } from "@/lib/content/get-content"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const topics = getTopics()
  const documents = getSearchDocuments()

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
            <SearchCommand documents={documents} />
          </div>

          <div className="flex items-center gap-1">
            <ButtonLink
              variant="ghost"
              size="icon"
              href={YOUTUBE_CHANNEL_URL}
              external
            >
              <LogosYoutubeIcon className="size-4" aria-hidden="true" />
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

        <footer className="px-4 py-6 text-sm text-muted-foreground md:px-8">
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
              className="inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <LogosYoutubeIcon className="size-4" aria-hidden="true" />
              Watch on YouTube
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
