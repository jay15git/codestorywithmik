import type { Metadata } from "next"

import { MyListsOverview } from "@/components/my-lists-overview"

export const metadata: Metadata = {
  title: "My lists — LeetSeek",
  description:
    "Your saved LeetCode problems by tag. Starred, Revisit, and custom lists stay in this browser.",
}

export default function ListsPage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">My lists</h1>
        <p className="max-w-2xl text-muted-foreground">
          Problems you saved with tags on solution pages. Default lists include
          Starred and Revisit; create more when you save a problem.
        </p>
      </section>

      <MyListsOverview />
    </div>
  )
}
