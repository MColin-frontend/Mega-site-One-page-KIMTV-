"use client"

import { cn } from "@/lib/utils"

import { SKELETON_BG } from "@/constants/common.constants"

import { Skeleton } from "@/components/ui/skeleton"

export function NewsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className={cn("h-7 w-44", SKELETON_BG)} />
        <Skeleton className={cn("h-4 w-16", SKELETON_BG)} />
      </div>

      {/* Items */}
      <div className="flex flex-col">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mb-2">
            <div className="-mx-2 flex gap-3 px-2 py-1">
              <Skeleton className={cn("rounded-8 h-[100px] w-[190px] shrink-0", SKELETON_BG)} />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className={cn("h-[26px] w-full", SKELETON_BG)} />
                <Skeleton className={cn("h-[26px] w-3/4", SKELETON_BG)} />
                <div className="mt-auto flex items-center gap-2">
                  <Skeleton className={cn("h-4 w-20", SKELETON_BG)} />
                  <div className="ml-auto flex items-center gap-2">
                    <Skeleton className={cn("h-4 w-10", SKELETON_BG)} />
                    <Skeleton className={cn("h-4 w-10", SKELETON_BG)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
