import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-base bg-secondary-background",
        className
      )}
      {...props} />)
  );
}

export { Skeleton }
