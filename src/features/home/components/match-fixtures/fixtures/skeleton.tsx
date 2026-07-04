"use client"

import { cn } from "@/lib/utils"

import { SKELETON_BG } from "@/constants/common.constants"

import { Skeleton } from "@/components/ui/skeleton"

export const ROW_CLASS =
  "grid items-center gap-x-3 px-3 xl:gap-x-8 xl:px-4 " +
  "grid-cols-[8rem_1fr_4.5rem_5rem_3rem_3rem_3rem] xl:grid-cols-[11rem_1fr_5rem_5.5rem_3.5rem_3.5rem_3.5rem]"

function FixtureRowSkeleton() {
  return (
    <div className={cn(ROW_CLASS, "rounded-10 mb-1.5 border border-white/8 bg-white/[0.04] py-3")}>
      {/* Col 1: League — 36px logo + text (khớp actual) */}
      <div className="flex items-center gap-2">
        <Skeleton className={cn("rounded-6 size-9 shrink-0", SKELETON_BG)} />
        <Skeleton className={cn("h-3.5 w-20", SKELETON_BG)} />
      </div>

      {/* Col 2: Teams stacked — 30px logo + text, gap-2 (khớp actual) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className={cn("size-[30px] shrink-0 rounded-full", SKELETON_BG)} />
          <Skeleton className={cn("h-3.5 w-32", SKELETON_BG)} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className={cn("size-[30px] shrink-0 rounded-full", SKELETON_BG)} />
          <Skeleton className={cn("h-3.5 w-28", SKELETON_BG)} />
        </div>
      </div>

      {/* Col 3: Time + Status — gap-1 (khớp actual) */}
      <div className="flex flex-col items-center gap-1">
        <Skeleton className={cn("h-3.5 w-10", SKELETON_BG)} />
        <Skeleton className={cn("h-3.5 w-12", SKELETON_BG)} />
      </div>

      {/* Col 4: Score */}
      <div className="flex justify-center">
        <Skeleton className={cn("h-3.5 w-10", SKELETON_BG)} />
      </div>

      {/* Col 5-7: Stats */}
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />

      {/* Col 8: HT */}
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
    </div>
  )
}

export function FixturesListSkeleton() {
  return (
    <div className="rounded-12 overflow-hidden">
      {/* Header — khớp alignment actual: col1,2 trái / còn lại center */}
      <div className={cn(ROW_CLASS, "py-2.5 max-md:hidden")}>
        <Skeleton className={cn("h-3 w-16", SKELETON_BG)} />
        <Skeleton className={cn("h-3 w-16", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-14", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-10", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-4", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-4", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-4", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-6", SKELETON_BG)} />
      </div>
      {Array.from({ length: 20 }).map((_, i) => (
        <FixtureRowSkeleton key={i} />
      ))}
    </div>
  )
}
