import type { Metadata } from "next"

import { MyListsOverview } from "@/components/my-lists-overview"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "My lists",
  description:
    "Saved LeetCode problems by tag. Starred, Revisit, and custom lists stay in this browser.",
}

export default function ListsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My lists"
      />

      <MyListsOverview />
    </div>
  )
}
