"use client"

import { useEffect, useState } from "react"
import { isEmpty } from "lodash"

import { formatFootballGameTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import { useFakeGameMinute } from "@/hooks/useFakeGameMinute"

import { useTranslation } from "@/i18n"
import { MATCH_HALF_LABEL } from "@/constants/common.constants"
import { MATCH_STAT_CONFIG } from "@/constants/ui/ui-match.constants"
import { MatchFootballStateEnum, MatchStatusEnum } from "@/enums/match.enum"
import type { AnchorRoomVo, MatchInterface } from "@/models/match.models"

import imgVs from "@assets/images/common/img-vs.png"

import { AvatarWithTooltip } from "../avatar"
import { GlowCard } from "../glow-card"
import { Img } from "../image"
import { Skeleton } from "../skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip"
import { Typography } from "../typography"
import { MatchLiveBadge } from "./match-live-badge"

type MatchCardType = "upcoming" | "live" | "finished"

interface MatchCardProps {
  match?: MatchInterface
  isLoading?: boolean
  matchType?: MatchCardType
  className?: string
}

function MatchCardSkeleton({
  className,
  matchType = "live",
}: {
  className?: string
  matchType?: MatchCardType
}) {
  return (
    <div
      className={cn("card-glow rounded-12 relative h-[280px] w-full overflow-hidden", className)}
      style={{
        background: [
          "radial-gradient(ellipse at 20% 0%, rgba(74,140,255,0.13) 0%, transparent 55%)",
          "radial-gradient(ellipse at 80% 100%, rgba(30,80,180,0.11) 0%, transparent 50%)",
          "#0b1422",
        ].join(", "),
      }}
    >
      <div className="flex h-full flex-col justify-between p-4">
        {/* League row */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-4 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Teams row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex basis-2/5 flex-col items-center gap-2">
            <Skeleton className="size-[52px] rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="rounded-4 h-8 w-8" />
          <div className="flex basis-2/5 flex-col items-center gap-2">
            <Skeleton className="size-[52px] rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Date + badge */}
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-3 w-28" />
          {matchType === "upcoming" && (
            <div className="flex items-center gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Skeleton className="h-6 w-8" />
                  <Skeleton className="h-2 w-6" />
                </div>
              ))}
            </div>
          )}
          {matchType === "live" && <Skeleton className="h-3 w-24" />}
          {matchType === "finished" && <Skeleton className="h-3 w-20" />}
        </div>

        {/* Footer: upcoming = button, live/finished = stats */}
        {matchType === "upcoming" ? (
          <Skeleton className="rounded-8 h-9 w-full" />
        ) : (
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-1">
                <Skeleton className="rounded-2 size-3.5" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function useCountdown(startTime: number | null | undefined) {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!startTime) return
    const update = () => {
      const diff = startTime * 1000 - Date.now()
      if (diff <= 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const total = Math.floor(diff / 1000)
      setCountdown({
        hours: Math.floor(total / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [startTime])

  return countdown
}

function formatMatchDate(ts: number) {
  const d = new Date(ts * 1000)
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`
}

function formatMatchTime(ts: number) {
  return new Date(ts * 1000).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
}

export function MatchCard({ match, isLoading, matchType = "live", className }: MatchCardProps) {
  const { t } = useTranslation()
  const countdown = useCountdown(match?.startTime)

  if (isLoading || !match) return <MatchCardSkeleton className={className} matchType={matchType} />

  const isUpcoming =
    match.status === MatchStatusEnum.UPCOMING || match.status === MatchStatusEnum.UNKNOWN
  const isFinished = match.status === MatchStatusEnum.FINISHED
  const isLive = !isFinished && (!!match.isLive || match.status === MatchStatusEnum.LIVE)
  const halfLabel = MATCH_HALF_LABEL[match.state as MatchFootballStateEnum] ?? "LIVE"
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const displayMinute = useFakeGameMinute(match.gameTime, isLive)
  const anchors: AnchorRoomVo[] = match.anchorRoomVos ?? []
  const menuCols = match.menu.slice(0, 3)
  const hasFooter = !isUpcoming && (menuCols.some(Boolean) || !isEmpty(anchors))

  const statsData = [
    { home: match.homeCornerKick, away: match.awayCornerKick },
    { home: match.homeRedCard, away: match.awayRedCard },
    { home: match.homeYellowCard, away: match.awayYellowCard },
  ]

  return (
    <GlowCard
      className={cn(
        "card-glow rounded-12 h-[280px] w-full cursor-pointer transition-all",
        className
      )}
      style={{
        background: [
          "radial-gradient(ellipse at 20% 0%, rgba(74,140,255,0.13) 0%, transparent 55%)",
          "radial-gradient(ellipse at 80% 100%, rgba(30,80,180,0.11) 0%, transparent 50%)",
          "#0b1422",
        ].join(", "),
      }}
    >
      {/* Home team glow — lấy màu từ logo đội nhà */}
      {match.homeLogo && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${match.homeLogo})`,
            backgroundSize: "180px",
            backgroundPosition: "-20px center",
            backgroundRepeat: "no-repeat",
            filter: "blur(60px) saturate(1.8)",
            opacity: 0.12,
            transform: "scale(1.6)",
          }}
        />
      )}
      {/* Away team glow — lấy màu từ logo đội khách */}
      {match.awayLogo && (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${match.awayLogo})`,
            backgroundSize: "180px",
            backgroundPosition: "calc(100% + 20px) center",
            backgroundRepeat: "no-repeat",
            filter: "blur(60px) saturate(1.8)",
            opacity: 0.09,
            transform: "scale(1.6)",
          }}
        />
      )}
      {/* Overlay để tránh quá chói */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(180deg, rgba(12,21,38,0.1) 0%, rgba(12,21,38,0.65) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-4">
        {/* League */}
        <div className="flex items-center gap-1.5">
          <Img
            src={match.leagueLogo}
            alt={match.leagueName ?? ""}
            width={20}
            height={20}
            objectFit="contain"
          />
          <Tooltip>
            <TooltipTrigger className="max-w-[250px] min-w-0 overflow-hidden">
              <Typography variant="body-sm" className="text-muted block truncate text-left">
                {match.leagueName}
              </Typography>
            </TooltipTrigger>
            <TooltipContent>{match.leagueName}</TooltipContent>
          </Tooltip>
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex basis-2/5 flex-col items-center gap-1.5">
            <div className="flex size-[52px] shrink-0 items-center justify-center">
              <Img
                src={match.homeLogo}
                alt={match.homeName ?? ""}
                width={52}
                height={52}
                objectFit="contain"
              />
            </div>
            <Tooltip>
              <TooltipTrigger className="block w-full">
                <Typography variant="body-sm" className="line-clamp-1 text-center text-white">
                  {match.homeName}
                </Typography>
              </TooltipTrigger>
              <TooltipContent>{match.homeName}</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex basis-1/5 items-center justify-center">
            {isUpcoming ? (
              <Img src={imgVs} alt="VS" width={60} height={60} objectFit="contain" />
            ) : (
              <div className="flex items-center gap-1">
                <Typography variant="h4" weight="700" className="text-white tabular-nums">
                  {match.homeScore ?? 0}
                </Typography>
                <Typography variant="h5" className="text-muted">
                  :
                </Typography>
                <Typography variant="h4" weight="700" className="text-white tabular-nums">
                  {match.awayScore ?? 0}
                </Typography>
              </div>
            )}
          </div>

          <div className="flex basis-2/5 flex-col items-center gap-1.5">
            <div className="flex size-[52px] shrink-0 items-center justify-center">
              <Img
                src={match.awayLogo}
                alt={match.awayName ?? ""}
                width={52}
                height={52}
                objectFit="contain"
              />
            </div>
            <Tooltip>
              <TooltipTrigger className="block w-full">
                <Typography variant="body-sm" className="line-clamp-1 text-center text-white">
                  {match.awayName}
                </Typography>
              </TooltipTrigger>
              <TooltipContent>{match.awayName}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Date/time */}
        {!isUpcoming && match.startTime && (
          <>
            <Typography variant="body" className="text-muted text-center">
              {formatMatchDate(match.startTime)} • {formatMatchTime(match.startTime)}
            </Typography>
            {isLive && (
              <MatchLiveBadge
                halfLabel={halfLabel}
                displayMinute={formatFootballGameTime(displayMinute)}
              />
            )}
            {isFinished && (
              <div className="flex justify-center">
                <Typography
                  variant="label"
                  weight="600"
                  className="text-gold drop-shadow-[0_0_6px_rgba(245,197,24,0.7)] [text-shadow:0_0_8px_rgba(245,197,24,0.6),0_0_20px_rgba(245,197,24,0.25)]"
                >
                  {t("common.match-card.finished")}
                </Typography>
              </div>
            )}
          </>
        )}

        {/* Upcoming: date + countdown + button */}
        {isUpcoming && match.startTime && (
          <>
            <Typography variant="body" className="text-center text-white/80">
              {formatMatchDate(match.startTime)} • {formatMatchTime(match.startTime)}
            </Typography>

            <div className="flex items-center justify-center gap-2">
              {[
                { value: countdown.hours, label: t("common.match-card.hours") },
                { value: countdown.minutes, label: t("common.match-card.minutes") },
                { value: countdown.seconds, label: t("common.match-card.seconds") },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-start gap-2">
                  <div className="flex flex-col items-center">
                    <Typography
                      variant="h5"
                      weight="700"
                      className="leading-100 text-white tabular-nums"
                    >
                      {String(value).padStart(2, "0")}
                    </Typography>
                    <Typography as="span" size="10" className="text-muted mt-0.5">
                      {label}
                    </Typography>
                  </div>
                  {i < 2 && (
                    <Typography variant="h5" weight="700" className="text-muted leading-100">
                      :
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Live/Finished footer stats */}
        {hasFooter && (
          <div
            className={cn(
              "flex items-center gap-2",
              isEmpty(anchors) ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center gap-2">
              {MATCH_STAT_CONFIG?.map((stat, i) => (
                <div key={i} className="flex items-center gap-1">
                  <Img src={stat.icon} alt={stat.alt} width={14} height={14} objectFit="contain" />
                  <Typography variant="body" weight="500" className="text-white/80">
                    {statsData[i].home ?? 0}
                  </Typography>
                  <Typography variant="body" className="text-muted">
                    -
                  </Typography>
                  <Typography variant="body" weight="500" className="text-white/80">
                    {statsData[i].away ?? 0}
                  </Typography>
                </div>
              ))}
            </div>

            {!isEmpty(anchors) && (
              <div className="ml-auto flex items-center">
                {anchors.slice(0, 3).map((anchor, i) => (
                  <AvatarWithTooltip
                    key={i}
                    src={anchor.userAvatar}
                    name={anchor.userName}
                    size={26}
                    index={i}
                    overlap={6}
                  />
                ))}
                {anchors.length > 3 && (
                  <div className="relative -ml-1.5 flex size-[26px] items-center justify-center rounded-full bg-white/10 ring-2 ring-[#0c1526]">
                    <Typography as="span" size="10" weight="600" className="text-muted">
                      +{anchors.length - 3}
                    </Typography>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </GlowCard>
  )
}
