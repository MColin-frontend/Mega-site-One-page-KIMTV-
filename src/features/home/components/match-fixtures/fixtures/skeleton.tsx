"use client"

import { cn } from "@/lib/utils"

import { SKELETON_BG } from "@/constants/common.constants"

import { Skeleton } from "@/components/ui/skeleton"

export const ROW_CLASS =
  "grid items-center gap-x-4 px-5 " +
  "grid-cols-[4rem_5.5rem_1fr_5.5rem_1fr_3.5rem_3.5rem_3.5rem_4rem]"

function FixtureRowSkeleton() {
  return (
    <div className={cn(ROW_CLASS, "border-foreground/6 border-b py-4 last:border-0")}>
      <Skeleton className={cn("h-4 w-10", SKELETON_BG)} />
      <Skeleton className={cn("h-4 w-16", SKELETON_BG)} />
      <div className="flex items-center justify-end gap-2.5">
        <Skeleton className={cn("h-4 w-28", SKELETON_BG)} />
        <Skeleton className={cn("size-[26px] shrink-0 rounded-full", SKELETON_BG)} />
      </div>
      <Skeleton className={cn("rounded-8 h-9 w-full", SKELETON_BG)} />
      <div className="flex items-center gap-2.5">
        <Skeleton className={cn("size-[26px] shrink-0 rounded-full", SKELETON_BG)} />
        <Skeleton className={cn("h-4 w-28", SKELETON_BG)} />
      </div>
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
    </div>
  )
}

function FixtureGroupSkeleton() {
  return (
    <div className="rounded-12 border-foreground/10 overflow-hidden border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="border-foreground/8 flex items-center gap-3 border-b px-5 py-3.5">
        <Skeleton className={cn("size-7 shrink-0 rounded-full", SKELETON_BG)} />
        <Skeleton className={cn("h-5 w-44", SKELETON_BG)} />
      </div>
      <div className={cn(ROW_CLASS, "bg-foreground/[0.025] border-foreground/6 border-b py-3")}>
        <Skeleton className={cn("h-3 w-8", SKELETON_BG)} />
        <span />
        <Skeleton className={cn("ml-auto h-3 w-12", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-10", SKELETON_BG)} />
        <Skeleton className={cn("h-3 w-12", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-4", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-4", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-4", SKELETON_BG)} />
        <Skeleton className={cn("mx-auto h-3 w-6", SKELETON_BG)} />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <FixtureRowSkeleton key={i} />
      ))}
    </div>
  )
}

export function FixturesListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <FixtureGroupSkeleton key={i} />
      ))}
    </div>
  )
}
