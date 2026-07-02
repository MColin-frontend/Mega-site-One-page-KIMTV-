"use client"

import { useRef } from "react"
import { isEmpty } from "lodash"

import { cn } from "@/lib/utils"

import { MATCH_STAT_CONFIG } from "@/constants/ui/ui-match.constants"
import { MatchStatusEnum } from "@/enums/match.enum"
import type { AnchorRoomVo, MatchInterface } from "@/models/match.models"

import bgCardMatch from "@assets/images/components/img-bg-card-match.png"

import { Img } from "../image"
import { Skeleton } from "../skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"
import { Typography } from "../typography"
import { MatchStatus } from "./match-status"

interface MatchCardProps {
  match?: MatchInterface
  isLoading?: boolean
  className?: string
}

function MatchCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-8 relative h-[165px] w-[390px] overflow-hidden bg-gray-400",
        className
      )}
    >
      <div className="relative flex h-full flex-col justify-between gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-1.5">
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-1 flex-col items-start gap-2">
            <Skeleton className="size-[30px] rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-3" />
            <Skeleton className="h-5 w-5" />
          </div>

          <div className="flex flex-1 flex-col items-end gap-2">
            <Skeleton className="size-[30px] rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <Skeleton className="size-3.5" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

const SPARKLE_COLORS = ["#f5c518", "#ffffff", "#ffd700", "#fffacd", "#e0b0ff"]

export function MatchCard({ match, isLoading, className }: MatchCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const sparkleContainerRef = useRef<HTMLDivElement>(null)
  const lastSparkleTime = useRef(0)
  const spawnSparkles = (x: number, y: number) => {
    const container = sparkleContainerRef.current
    if (!container) return
    const count = 2
    for (let i = 0; i < count; i++) {
      const el = document.createElement("span")
      const size = Math.random() * 4 + 2
      const angle = Math.random() * 360
      const dist = Math.random() * 28 + 8
      const dx = Math.cos((angle * Math.PI) / 180) * dist
      const dy = Math.sin((angle * Math.PI) / 180) * dist + 12
      const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]
      el.style.cssText = `
        position:absolute;left:${x}px;top:${y}px;
        width:${size}px;height:${size}px;
        background:${color};border-radius:50%;
        pointer-events:none;z-index:20;
        --dx:${dx}px;--dy:${dy}px;
        opacity:0.45;
        animation:sparkle-fall 0.65s ease-out forwards;
        box-shadow:0 0 ${size + 2}px ${color};
      `
      container.appendChild(el)
      setTimeout(() => el.remove(), 650)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const now = Date.now()
    if (now - lastSparkleTime.current < 40) return
    lastSparkleTime.current = now
    spawnSparkles(x, y)
  }

  const handleMouseLeave = () => {}

  if (isLoading || !match) return <MatchCardSkeleton className={className} />

  const menuCols = match.menu.slice(0, 3)
  const anchors: AnchorRoomVo[] = match.anchorRoomVos ?? []
  const isUpcoming =
    match.status === MatchStatusEnum.UPCOMING || match.status === MatchStatusEnum.UNKNOWN
  const hasFooter = !isUpcoming && (menuCols.some(Boolean) || !isEmpty(anchors))

  const statsData = [
    { home: match.homeCornerKick, away: match.awayCornerKick },
    { home: match.homeRedCard, away: match.awayRedCard },
    { home: match.homeYellowCard, away: match.awayYellowCard },
  ]

  return (
    <div
      style={{
        background: `
          radial-gradient(ellipse at 0% 0%, rgba(255, 255, 255, 0.22) 0%, transparent 80%),
          linear-gradient(90deg, rgba(29, 52, 100, 0.25) 0%, rgba(6, 14, 32, 0.65) 89%),
          url(${bgCardMatch.src}) center / cover
        `,
      }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "rounded-8 relative h-[165px] w-[390px] cursor-pointer overflow-hidden transition-all",
        className
      )}
    >
      {/* sparkle container */}
      <div
        ref={sparkleContainerRef}
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      />
      <div
        className={cn(
          "relative flex h-full flex-col gap-2 p-4",
          isUpcoming ? "justify-start" : "justify-between"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <Img
              src={match.leagueLogo}
              alt={match.leagueName ?? ""}
              width={24}
              height={24}
              objectFit="contain"
            />
            <div className="max-w-[220px] min-w-0 overflow-hidden">
              <Tooltip>
                <TooltipTrigger className="block w-full">
                  <Typography variant="label" className="block truncate text-white">
                    {match.leagueName}
                  </Typography>
                </TooltipTrigger>
                <TooltipContent>{match.leagueName}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <MatchStatus match={match} />
        </div>

        <div className={cn("flex items-center gap-2", isUpcoming && "my-auto")}>
          <div className="flex min-w-0 basis-1/3 flex-col items-start gap-2">
            <Img
              src={match.homeLogo}
              alt={match.homeName ?? ""}
              width={30}
              height={30}
              objectFit="contain"
            />
            <Tooltip>
              <TooltipTrigger className="block w-full min-w-0">
                <Typography variant="label" className="block truncate text-left! text-white">
                  {match.homeName}
                </Typography>
              </TooltipTrigger>
              <TooltipContent>{match.homeName}</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex basis-1/3 items-center justify-center gap-2">
            <Typography
              variant="h5"
              className="font-700 min-w-[1.5ch] text-center leading-100 text-white tabular-nums"
            >
              {match.homeScore ?? 0}
            </Typography>
            <Typography variant="h6" className="leading-100 text-white">
              :
            </Typography>
            <Typography
              variant="h5"
              className="font-700 min-w-[1.5ch] text-center leading-100 text-white tabular-nums"
            >
              {match.awayScore ?? 0}
            </Typography>
          </div>

          <div className="flex min-w-0 basis-1/3 flex-col items-end gap-1">
            <Img
              src={match.awayLogo}
              alt={match.awayName ?? ""}
              width={30}
              height={30}
              objectFit="contain"
            />
            <Tooltip>
              <TooltipTrigger className="block max-w-full min-w-0">
                <Typography variant="label" className="block truncate !text-right text-white">
                  {match.awayName}
                </Typography>
              </TooltipTrigger>
              <TooltipContent>{match.awayName}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {hasFooter && (
          <div className="flex items-center justify-center gap-2 border-t border-white/10 pt-2">
            <div className="flex items-center gap-2">
              {MATCH_STAT_CONFIG?.map((stat, i) => {
                return (
                  <div key={i} className="flex items-center gap-1">
                    <Img
                      src={stat.icon}
                      alt={stat.alt}
                      width={14}
                      height={14}
                      objectFit="contain"
                    />
                    <Typography variant="body-sm" weight="500" className="text-white tabular-nums">
                      {statsData[i].home ?? 0}
                    </Typography>
                    <Typography variant="body-sm" className="text-white/40">
                      -
                    </Typography>
                    <Typography variant="body-sm" weight="500" className="text-white tabular-nums">
                      {statsData[i].away ?? 0}
                    </Typography>
                  </div>
                )
              })}
            </div>

            {!isEmpty(anchors) && (
              <div className="ml-auto flex items-center gap-1.5">
                <Img
                  src={anchors[0].userAvatar}
                  alt={anchors[0].userName ?? ""}
                  width={24}
                  height={24}
                  rounded="full"
                  objectFit="contain"
                />
                <Tooltip>
                  <TooltipTrigger className="block max-w-[80px]">
                    <Typography variant="label" className="block truncate text-white">
                      {anchors[0].userName}
                    </Typography>
                  </TooltipTrigger>
                  <TooltipContent>{anchors[0].userName}</TooltipContent>
                </Tooltip>
                {anchors.length > 1 && (
                  <Typography variant="label" className="text-white">
                    +{anchors.length - 1}
                  </Typography>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
