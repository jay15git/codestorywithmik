import { Skeleton } from "@/components/ui/skeleton"

export default function SiteLoading() {
  return (
    <div className="space-y-10" aria-hidden="true">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="space-y-3">
          <Skeleton className="h-9 w-3/5 max-w-sm rounded-lg" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-4/5 max-w-md" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg sm:w-32" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border/70 bg-card p-5"
          >
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-4/5" />
            <Skeleton className="mt-6 h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  )
}
