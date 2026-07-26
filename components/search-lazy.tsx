"use client"

import dynamic from "next/dynamic"

import { SearchTrigger } from "@/components/search-command"

const SearchCommand = dynamic(
  () =>
    import("@/components/search-command").then((module) => module.SearchCommand),
  {
    ssr: false,
    loading: () => <SearchTrigger disabled />,
  },
)

export function SearchLazy() {
  return <SearchCommand />
}
