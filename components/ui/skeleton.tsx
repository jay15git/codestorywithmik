import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "is-pulsing rounded-md bg-muted",
        className,
      )}
      {...props}
    />
  )
}

interface SkeletonRevealProps {
  isLoading: boolean
  skeleton: React.ReactNode
  children: React.ReactNode
  className?: string
}

function SkeletonReveal({
  isLoading,
  skeleton,
  children,
  className,
}: SkeletonRevealProps) {
  return (
    <div
      className={cn("t-skel", !isLoading && "is-revealed", className)}
    >
      <div
        className={cn(
          "t-skel-skeleton",
          isLoading && "is-pulsing",
        )}
      >
        {skeleton}
      </div>
      <div className="t-skel-content">{children}</div>
    </div>
  )
}

export { Skeleton, SkeletonReveal }
