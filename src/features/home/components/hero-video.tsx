"use client"

import { useEffect, useRef, useState } from "react"
import { Share2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useRouter } from "@/hooks/useRouter"

import { HERO_VIDEO_PARAMS } from "@/constants/component/home.constants"

import { AvatarWithTooltip } from "@/components/ui/avatar"
import { Chat, type UserRole } from "@/components/ui/chat"
import { Img } from "@/components/ui/image"
import { MatchLiveBadge } from "@/components/ui/match/match-live-badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import { VideoPlayer, type VideoSource } from "@/components/ui/video"

import icCornerKick from "@assets/icons/match/ic-goc.svg"
import icRedCard from "@assets/icons/match/ic-red-card.svg"
import icYellowCard from "@assets/icons/match/ic-yellow-card.svg"

/* ── Types ───────────────────────────────────────────────── */

export interface LiveMatch {
  id: string | number
  chatroomId: string | number
  gameId: number
  leagueName?: string
  leagueLogo?: string
  homeTeam: { name: string; logo: string }
  awayTeam: { name: string; logo: string }
  homeScore?: number
  awayScore?: number
  period?: string | number
  state?: number | null
  homeCornerKick?: number
  awayCornerKick?: number
  homeYellowCard?: number
  awayYellowCard?: number
  homeRedCard?: number
  awayRedCard?: number
  anchors?: { userAvatar: string; userName: string }[]
  startTime?: number | null
  sources: VideoSource[]
  poster?: string
}

export interface HeroVideoProps {
  matches: LiveMatch[]
  defaultMatchId?: string | number
  isLoggedIn?: boolean
  userRole?: UserRole
  onLogin?: () => void
  className?: string
}

function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleCopy() {
    const url = window.location.href
    const input = document.createElement("input")
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand("Copy")
    document.body.removeChild(input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group text-muted flex h-[30px] items-center gap-1.5 rounded-full border border-transparent px-3 transition-all duration-200 hover:border-[rgba(255,187,0,0.35)] hover:bg-gradient-to-b hover:from-[#111] hover:via-[#222] hover:to-[#111]"
        style={{ whiteSpace: "nowrap" }}
      >
        <Share2 className="size-[14px] shrink-0 transition-colors group-hover:text-[rgba(234,195,103,0.8)]" />
        <Typography
          variant="caption"
          className="transition-colors group-hover:text-[rgba(234,195,103,0.8)]"
        >
          Chia sẻ
        </Typography>
      </button>

      {open && (
        <div className="rounded-8 absolute top-full right-0 z-50 mt-1.5 w-[280px] border border-white/10 bg-[#0c1526] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="rounded-6 text-12 text-muted min-w-0 flex-1 border border-white/10 bg-white/5 px-2 py-1.5 outline-none"
            />
            <button
              onClick={handleCopy}
              className="rounded-6 text-12 font-500 shrink-0 bg-white/10 px-3 py-1.5 text-white transition-colors hover:bg-white/20"
            >
              {copied ? "Đã sao chép!" : "Sao chép"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Component ──────────────────────────────────────── */

export function HeroVideo({
  matches,
  defaultMatchId,
  isLoggedIn = false,
  userRole = "NOT_LOGIN",
  onLogin,
  className,
}: HeroVideoProps) {
  const { getParam, setParams } = useRouter()

  const activeIdFromUrl =
    getParam(HERO_VIDEO_PARAMS.MATCH_ID) ?? String(defaultMatchId ?? matches[0]?.id ?? "")
  const activeMatch = matches.find((m) => String(m.id) === activeIdFromUrl) ?? matches[0]

  // Sync URL params so Chat component can read chatroomId + gameId
  useEffect(() => {
    if (!activeMatch) return
    const currentId = getParam(HERO_VIDEO_PARAMS.MATCH_ID)
    if (!currentId) {
      setParams(
        {
          [HERO_VIDEO_PARAMS.MATCH_ID]: String(activeMatch.id),
          [HERO_VIDEO_PARAMS.GAME_ID]: String(activeMatch.gameId),
        },
        { scroll: false }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMatch?.id])

  if (!activeMatch) return null

  return (
    <div
      className={cn(
        "flex h-[min(76vh,820px)] w-full gap-4 max-lg:h-auto max-lg:flex-col",
        className
      )}
    >
      {/* Left: video + match info bar */}
      <div className="card-glow rounded-12 flex min-w-0 flex-1 flex-col overflow-hidden max-lg:h-auto">
        {/* Video */}
        <div className="rounded-8 relative min-h-0 flex-1 overflow-hidden bg-black max-lg:aspect-video max-lg:flex-none">
          <VideoPlayer
            key={activeMatch.id.toString()}
            sources={activeMatch.sources}
            poster={activeMatch.poster}
            isLive
            autoplay
            className="absolute inset-0 rounded-none"
          />
        </div>

        {/* Match info bar */}
        <div
          className="rounded-b-12 flex shrink-0 flex-col gap-4 border-t border-white/8 p-4 backdrop-blur-xl max-lg:gap-2 max-lg:p-3"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(30,80,140,0.25) 0%, rgba(9,19,32,0.85) 70%)",
          }}
        >
          {/* Row 1: league + period badge + live dot */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center max-lg:flex max-lg:justify-between">
            {/* League */}
            <div className="flex min-w-0 items-center gap-1.5">
              {activeMatch.leagueLogo && (
                <Img
                  src={activeMatch.leagueLogo}
                  alt=""
                  width={26}
                  height={26}
                  objectFit="contain"
                  className="shrink-0"
                />
              )}
              {activeMatch.leagueName && (
                <Tooltip>
                  <TooltipTrigger className="max-w-full min-w-0 overflow-hidden">
                    <Typography
                      variant="body"
                      color="foreground/55"
                      className="block truncate text-left"
                    >
                      {activeMatch.leagueName}
                    </Typography>
                  </TooltipTrigger>
                  <TooltipContent>{activeMatch.leagueName}</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Period badge — desktop only */}
            <div className="flex justify-center max-lg:hidden">
              {activeMatch.period != null && (
                <MatchLiveBadge
                  halfLabel={
                    activeMatch.state != null ? (activeMatch.state <= 1 ? "H1" : "H2") : "LIVE"
                  }
                  displayMinute={String(activeMatch.period)}
                />
              )}
            </div>

            {/* Share button */}
            <div className="flex justify-end">
              <ShareButton />
            </div>
          </div>

          {/* Row 2: teams + score */}
          <div className="flex items-center justify-between gap-8 max-lg:gap-2">
            {/* Home */}
            <div className="flex min-w-0 flex-1 flex-row justify-end gap-2.5 max-lg:flex-col-reverse max-lg:items-center max-lg:gap-2">
              <Typography
                as="span"
                variant="body"
                weight="600"
                className="w-full truncate text-right text-white max-lg:text-center"
              >
                {activeMatch.homeTeam.name}
              </Typography>
              {activeMatch.homeTeam.logo && (
                <div className="flex size-[52px] shrink-0 items-center justify-center max-lg:size-[28px]">
                  <Img
                    src={activeMatch.homeTeam.logo}
                    alt={activeMatch.homeTeam.name}
                    width={52}
                    height={52}
                    objectFit="contain"
                  />
                </div>
              )}
            </div>

            {/* Score */}
            <div className="flex shrink-0 items-center gap-1">
              <Typography variant="h4" weight="700" className="text-white tabular-nums">
                {activeMatch.homeScore ?? 0}
              </Typography>
              <Typography variant="h5" className="text-muted">
                :
              </Typography>
              <Typography variant="h4" weight="700" className="text-white tabular-nums">
                {activeMatch.awayScore ?? 0}
              </Typography>
            </div>

            {/* Away */}
            <div className="flex min-w-0 flex-1 flex-row gap-2.5 max-lg:flex-col max-lg:items-center max-lg:gap-2">
              {activeMatch.awayTeam.logo && (
                <div className="flex size-[52px] shrink-0 items-center justify-center max-lg:size-[28px]">
                  <Img
                    src={activeMatch.awayTeam.logo}
                    alt={activeMatch.awayTeam.name}
                    width={52}
                    height={52}
                    objectFit="contain"
                  />
                </div>
              )}
              <Typography
                variant="body"
                weight="600"
                className="w-full truncate text-left text-white max-lg:text-center"
              >
                {activeMatch.awayTeam.name}
              </Typography>
            </div>
          </div>

          {/* Period badge — mobile only, centered below teams */}
          {activeMatch.period != null && (
            <div className="hidden max-lg:flex max-lg:justify-center">
              <MatchLiveBadge
                halfLabel={
                  activeMatch.state != null ? (activeMatch.state <= 1 ? "H1" : "H2") : "LIVE"
                }
                displayMinute={String(activeMatch.period)}
              />
            </div>
          )}

          {/* Row 3: stats + commentators */}
          <div
            className={cn(
              "flex items-center",
              activeMatch.anchors?.length ? "justify-between" : "justify-center"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Img src={icCornerKick} alt="corner" width={14} height={14} objectFit="contain" />
                <Typography
                  as="span"
                  variant="caption"
                  weight="500"
                  className="text-white/80 tabular-nums"
                >
                  {activeMatch.homeCornerKick ?? 0}
                </Typography>
                <Typography as="span" variant="caption" className="text-muted">
                  -
                </Typography>
                <Typography
                  as="span"
                  variant="caption"
                  weight="500"
                  className="text-white/80 tabular-nums"
                >
                  {activeMatch.awayCornerKick ?? 0}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <Img src={icYellowCard} alt="yellow" width={14} height={14} objectFit="contain" />
                <Typography
                  as="span"
                  variant="caption"
                  weight="500"
                  className="text-white/80 tabular-nums"
                >
                  {activeMatch.homeYellowCard ?? 0}
                </Typography>
                <Typography as="span" variant="caption" className="text-muted">
                  -
                </Typography>
                <Typography
                  as="span"
                  variant="caption"
                  weight="500"
                  className="text-white/80 tabular-nums"
                >
                  {activeMatch.awayYellowCard ?? 0}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <Img src={icRedCard} alt="red" width={14} height={14} objectFit="contain" />
                <Typography
                  as="span"
                  variant="caption"
                  weight="500"
                  className="text-white/80 tabular-nums"
                >
                  {activeMatch.homeRedCard ?? 0}
                </Typography>
                <Typography as="span" variant="caption" className="text-muted">
                  -
                </Typography>
                <Typography
                  as="span"
                  variant="caption"
                  weight="500"
                  className="text-white/80 tabular-nums"
                >
                  {activeMatch.awayRedCard ?? 0}
                </Typography>
              </div>
            </div>

            {activeMatch.anchors && activeMatch.anchors.length > 0 && (
              <div className="flex items-center">
                {activeMatch.anchors.slice(0, 3).map((anchor, i) => (
                  <AvatarWithTooltip
                    key={i}
                    src={anchor?.userAvatar || ""}
                    name={anchor?.userName || ""}
                    size={38}
                    index={i}
                    overlap={6}
                  />
                ))}
                {activeMatch.anchors.length > 3 && (
                  <Typography
                    as="div"
                    size="10"
                    weight="600"
                    className="text-muted relative -ml-1.5 flex size-[26px] items-center justify-center rounded-full bg-white/10 ring-2 ring-[#0c1526]"
                  >
                    +{activeMatch.anchors.length - 3}
                  </Typography>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: chat */}
      <div className="card-glow rounded-12 flex w-[420px] shrink-0 flex-col overflow-hidden max-lg:hidden">
        <div className="min-h-0 flex-1">
          <Chat isLoggedIn={isLoggedIn} userRole={userRole} onLogin={onLogin} className="h-full" />
        </div>
      </div>
    </div>
  )
}
