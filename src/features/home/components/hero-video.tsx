"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"
import { useRouter } from "@/hooks/useRouter"

import { HERO_VIDEO_PARAMS } from "@/constants/component/home.constants"
import type { AnchorRoomVo, MatchInterface } from "@/models/match.models"

import { Chat, type UserRole } from "@/components/ui/chat"
import { MatchLiveInfoBar } from "@/components/ui/match/match-live-info-bar"
import type { VideoSource } from "@/components/ui/video"

const VideoPlayer = dynamic(() => import("@/components/ui/video").then((m) => m.VideoPlayer), {
  ssr: false,
})

/* ── Types ───────────────────────────────────────────────── */

export interface LiveMatch {
  id: string | number
  chatroomId: string | number
  gameId: number
  leagueName?: string
  leagueLogo?: string
  homeName: string
  homeLogo?: string
  awayName: string
  awayLogo?: string
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

/* ── Main Component ──────────────────────────────────────── */

export function HeroVideo({ matches, defaultMatchId, className }: HeroVideoProps) {
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
        "flex h-[min(76vh,880px)] w-full gap-4 max-lg:h-auto max-lg:flex-col",
        className
      )}
    >
      {/* Left: video + match info bar */}
      <div className="card-glow rounded-12 flex min-w-0 flex-1 flex-col overflow-hidden max-lg:h-auto">
        <VideoPlayer
          key={activeMatch.id.toString()}
          sources={activeMatch.sources}
          poster={activeMatch.poster}
          isLive
          autoplay
        />
        <MatchLiveInfoBar
          match={{
            ...(activeMatch as unknown as MatchInterface),
            matchId: Number(activeMatch.id),
            gameTime: typeof activeMatch.period === "number" ? activeMatch.period : null,
            anchorRoomVos: (activeMatch.anchors as unknown as AnchorRoomVo[]) ?? null,
          }}
        />
      </div>

      {/* Right: chat */}
      <div className="flex w-[420px] shrink-0 flex-col overflow-hidden max-lg:hidden">
        <Chat />
      </div>
    </div>
  )
}
