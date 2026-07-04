"use client"

import { cn } from "@/lib/utils"

import { SKELETON_BG } from "@/constants/common.constants"

import { Skeleton } from "@/components/ui/skeleton"

export function HighlightsSkeleton() {
  return (
    <div className="card-glow rounded-12 flex flex-col gap-3 bg-white/[0.02] p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className={cn("h-7 w-28", SKELETON_BG)} />
        <Skeleton className={cn("h-4 w-16", SKELETON_BG)} />
      </div>
      {/* Image */}
      <Skeleton className={cn("rounded-10 w-full", SKELETON_BG)} style={{ aspectRatio: "16/10" }} />
      {/* Dots */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(i === 0 ? "h-1.5 w-4" : "size-1.5", "rounded-full", SKELETON_BG)}
          />
        ))}
      </div>
    </div>
  )
}

export function NewsSectionSkeleton() {
  return (
    <div className="card-glow rounded-12 flex flex-col gap-2 bg-white/[0.02] p-4">
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
              <Skeleton className={cn("rounded-8 h-[110px] w-[160px] shrink-0", SKELETON_BG)} />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className={cn("h-[22px] w-full", SKELETON_BG)} />
                <Skeleton className={cn("h-[22px] w-3/4", SKELETON_BG)} />
                <div className="mt-auto flex items-center gap-2">
                  <Skeleton className={cn("h-3.5 w-20", SKELETON_BG)} />
                  <div className="ml-auto flex items-center gap-2">
                    <Skeleton className={cn("h-3.5 w-10", SKELETON_BG)} />
                    <Skeleton className={cn("h-3.5 w-10", SKELETON_BG)} />
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
