import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSidebarSkeleton() {
  return (
    <div className="rounded-16 panel-dark">
      <div className="flex flex-col items-center gap-3 px-6 py-8">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="mx-4 h-px bg-white/8" />
      <div className="flex flex-col gap-1 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="rounded-8 h-10 w-full" />
        ))}
      </div>
    </div>
  )
}

export function ProfileContentSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-16 panel-dark p-6">
        <div className="mb-5 flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="rounded-8 h-16 w-full" />
          <Skeleton className="rounded-8 h-16 w-full" />
        </div>
        <Skeleton className="rounded-8 mt-4 h-16 w-full" />
      </div>
      <div className="rounded-16 panel-dark p-6">
        <Skeleton className="mb-4 h-5 w-44" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <div className="rounded-16 panel-dark p-6">
        <Skeleton className="mb-4 h-5 w-36" />
        <div className="flex flex-col gap-3">
          <Skeleton className="rounded-8 h-14 w-full" />
          <Skeleton className="rounded-8 h-14 w-full" />
        </div>
      </div>
    </div>
  )
}
