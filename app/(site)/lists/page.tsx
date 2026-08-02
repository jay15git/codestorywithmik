import type { Metadata } from "next"

import { MyListsOverview } from "@/components/my-lists-overview"

export const metadata: Metadata = {
  title: "My lists",
  description:
    "Saved LeetCode problems by tag. Starred, Revisit, and custom lists stay in this browser.",
}

export default function ListsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">My lists</h1>
        <p className="max-w-2xl text-muted-foreground">
          Problems you tagged on solution pages. Includes Starred, Revisit, and
          lists you create.
        </p>
      </section>

      <MyListsOverview />
    </div>
  )
}
