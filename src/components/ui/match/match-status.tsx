"use client"

import type { ReactNode } from "react"

import { formatFootballGameTime, formatKickOff } from "@/lib/date"
import { useFakeGameMinute } from "@/hooks/useFakeGameMinute"

import { MATCH_HALF_LABEL } from "@/constants/common.constants"
import { MatchFootballStateEnum, MatchStatusEnum, MatchStatusLabelEnum } from "@/enums/match.enum"
import type { MatchInterface } from "@/models/match.models"

import { Typography } from "../typography"

interface MatchStatusProps {
  match: Pick<MatchInterface, "isLive" | "status" | "state" | "gameTime" | "startTime">
}

const STATUS_TEXT_CLASS =
  "text-gold drop-shadow-[0_0_6px_rgba(245,197,24,0.7)] [text-shadow:0_0_8px_rgba(245,197,24,0.6),0_0_20px_rgba(245,197,24,0.25)]"

function renderStatusContent(
  match: MatchStatusProps["match"],
  halfLabel: string,
  displayMinute: number
): ReactNode {
  const isLive = !!match.isLive || match.status === MatchStatusEnum.LIVE

  if (isLive) {
    return (
      <>
        {halfLabel}: {formatFootballGameTime(displayMinute)}
        <span className="animate-blink">&apos;</span>
      </>
    )
  }

  switch (match.status) {
    case MatchStatusEnum.FINISHED:
      return MatchStatusLabelEnum.FINISHED
    case MatchStatusEnum.CANCELLED:
      return MatchStatusLabelEnum.CANCELLED
    case MatchStatusEnum.POSTPONED:
      return MatchStatusLabelEnum.POSTPONED
    default:
      return match.startTime ? formatKickOff(match.startTime) : "—"
  }
}

export function MatchStatus({ match }: MatchStatusProps) {
  const halfLabel = MATCH_HALF_LABEL[match.state as MatchFootballStateEnum] ?? "LIVE"
  const isLive = !!match.isLive || match.status === MatchStatusEnum.LIVE
  const displayMinute = useFakeGameMinute(match.gameTime, isLive)

  return (
    <div className="flex shrink-0 items-center gap-1">
      {isLive && (
        <span className="relative flex size-4 shrink-0 items-center justify-center">
          <span className="absolute size-full animate-ping rounded-full bg-red-500 opacity-40" />
          <span className="absolute size-2.5 rounded-full bg-red-500/30 blur-[2px]" />
          <span className="relative size-2 rounded-full bg-linear-to-br from-red-400 to-rose-600 shadow-[0_0_10px_4px_rgba(239,68,68,0.9),inset_0_1px_1px_rgba(255,255,255,0.3)]" />
        </span>
      )}

      <Typography variant="label" weight="600" className={STATUS_TEXT_CLASS}>
        {renderStatusContent(match, halfLabel, displayMinute)}
      </Typography>
    </div>
  )
}
