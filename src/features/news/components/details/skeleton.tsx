"use client"

import { cn } from "@/lib/utils"

import { SKELETON_BG } from "@/constants/common.constants"

import { Skeleton } from "@/components/ui/skeleton"

export function ArticleSkeleton() {
  return (
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="flex flex-1 flex-col gap-4">
        <Skeleton className={cn("h-10 w-full", SKELETON_BG)} />
        <Skeleton className={cn("h-10 w-3/4", SKELETON_BG)} />
        <div className="flex items-center gap-4">
          <Skeleton className={cn("size-10 rounded-full", SKELETON_BG)} />
          <div className="flex flex-col gap-1">
            <Skeleton className={cn("h-4 w-32", SKELETON_BG)} />
            <Skeleton className={cn("h-3 w-24", SKELETON_BG)} />
          </div>
        </div>
        <Skeleton className={cn("h-20 w-full rounded-lg", SKELETON_BG)} />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-4", i % 3 === 2 ? "w-2/3" : "w-full", SKELETON_BG)}
            />
          ))}
        </div>
      </div>
      <div className="w-full xl:w-[305px]">
        <div className="flex flex-col gap-3 rounded-lg bg-white/[0.02] p-4">
          <Skeleton className={cn("h-7 w-36", SKELETON_BG)} />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className={cn("h-[56px] w-[80px] shrink-0 rounded-lg", SKELETON_BG)} />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className={cn("h-4 w-full", SKELETON_BG)} />
                <Skeleton className={cn("h-4 w-2/3", SKELETON_BG)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
