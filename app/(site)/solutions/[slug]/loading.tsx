import { Skeleton } from "@/components/ui/skeleton"

export default function SolutionLoading() {
  return (
    <div className="space-y-8" aria-hidden="true">
      <div className="space-y-4">
        <Skeleton className="h-9 w-3/5 max-w-xl rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />

      <div className="overflow-hidden rounded-xl border border-border/70">
        <div className="flex h-12 items-center gap-2 border-b border-border/70 px-4">
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
        <div className="space-y-3 p-5">
          {Array.from({ length: 12 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-4 rounded-sm"
              style={{ width: `${55 + ((index * 17) % 42)}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
