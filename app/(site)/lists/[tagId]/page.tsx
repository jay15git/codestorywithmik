import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { TagListActions, TagListCount } from "@/components/tag-list-header"
import { TagListHeading } from "@/components/tag-list-heading"
import { TagSolutionList } from "@/components/tag-solution-list"
import { SolutionViewProvider } from "@/components/solution-view"
import { getSolutions } from "@/lib/content/get-content"
import { DEFAULT_TAGS } from "@/lib/tags/constants"
import {
  ALL_SAVED_LIST_ID,
  getListDescription,
  getListTitle,
} from "@/lib/tags/lists"

interface ListTagPageProps {
  params: Promise<{ tagId: string }>
}

export function generateStaticParams() {
  return [
    { tagId: ALL_SAVED_LIST_ID },
    ...DEFAULT_TAGS.map((tag) => ({ tagId: tag.id })),
  ]
}

export async function generateMetadata({
  params,
}: ListTagPageProps): Promise<Metadata> {
  const { tagId } = await params
  const decodedId = decodeURIComponent(tagId).trim()
  const tag = DEFAULT_TAGS.find((item) => item.id === decodedId)

  return {
    title: `${getListTitle(decodedId, tag ?? null)} — My lists`,
    description: getListDescription(decodedId, tag ?? null),
  }
}

export default async function ListTagPage({ params }: ListTagPageProps) {
  const { tagId } = await params
  const decodedId = decodeURIComponent(tagId).trim()

  if (!decodedId) {
    notFound()
  }

  const solutions = getSolutions()

  return (
    <SolutionViewProvider>
      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">
              <Link
                href="/lists"
                className="underline-offset-2 hover:underline"
              >
                My lists
              </Link>
            </p>
            <TagListHeading tagId={decodedId} />
            <TagListCount solutions={solutions} tagId={decodedId} />
          </div>
          <TagListActions solutions={solutions} tagId={decodedId} />
        </div>

        <TagSolutionList solutions={solutions} tagId={decodedId} />
      </div>
    </SolutionViewProvider>
  )
}
