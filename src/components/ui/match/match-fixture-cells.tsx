"use client"

import { useFakeGameMinute } from "@/hooks/useFakeGameMinute"

import { MATCH_HALF_LABEL } from "@/constants/common.constants"
import { MatchFootballStateEnum, MatchStatusEnum, MatchStatusLabelEnum } from "@/enums/match.enum"
import type { MatchInterface } from "@/models/match.models"

import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import icHomeVs from "@assets/icons/home/ic-home-vs.svg"

/* ── Score badge ────────────────────────────────────────────── */
export function ScoreBadge({ match }: { match: MatchInterface }) {
  const isUpcoming =
    match.status === MatchStatusEnum.UPCOMING || match.status === MatchStatusEnum.UNKNOWN

  if (isUpcoming) {
    return (
      <div className="flex h-9 w-full items-center justify-center">
        <Img src={icHomeVs} alt="VS" width={30} height={30} objectFit="contain" />
      </div>
    )
  }

  return (
    <div className="flex h-9 w-full items-center justify-center">
      <Typography
        as="span"
        variant="label"
        weight="600"
        color="foreground"
        className="tabular-nums"
      >
        {match.homeScore ?? 0}&nbsp;-&nbsp;{match.awayScore ?? 0}
      </Typography>
    </div>
  )
}

/* ── Status cell ────────────────────────────────────────────── */
export function FixtureStatus({ match }: { match: MatchInterface }) {
  const isLive = !!match.isLive || match.status === MatchStatusEnum.LIVE
  const halfLabel = MATCH_HALF_LABEL[match.state as MatchFootballStateEnum] ?? ""
  const displayMinute = useFakeGameMinute(match.gameTime, isLive)

  if (isLive) {
    return (
      <div className="flex shrink-0 items-center gap-1">
        <span className="relative flex size-4 shrink-0 items-center justify-center">
          <span className="absolute size-full animate-ping rounded-full bg-red-500 opacity-40" />
          <span className="absolute size-2.5 rounded-full bg-red-500/30 blur-[2px]" />
          <span className="relative size-2 rounded-full bg-linear-to-br from-red-400 to-rose-600 shadow-[0_0_10px_4px_rgba(239,68,68,0.9),inset_0_1px_1px_rgba(255,255,255,0.3)]" />
        </span>
        <Typography as="span" variant="label" weight="600" color="gold">
          {halfLabel && `${halfLabel}: `}
          {displayMinute}
          <span className="animate-blink">&apos;</span>
        </Typography>
      </div>
    )
  }

  switch (match.status) {
    case MatchStatusEnum.FINISHED:
    case MatchStatusEnum.CANCELLED:
    case MatchStatusEnum.POSTPONED: {
      const STATUS_LABEL: Partial<Record<MatchStatusEnum, string>> = {
        [MatchStatusEnum.FINISHED]: MatchStatusLabelEnum.FINISHED,
        [MatchStatusEnum.CANCELLED]: MatchStatusLabelEnum.CANCELLED,
        [MatchStatusEnum.POSTPONED]: MatchStatusLabelEnum.POSTPONED,
      }
      return (
        <Typography
          as="span"
          variant="caption"
          weight="600"
          className="text-gold drop-shadow-[0_0_6px_rgba(245,197,24,0.7)] [text-shadow:0_0_8px_rgba(245,197,24,0.6),0_0_20px_rgba(245,197,24,0.25)]"
        >
          {STATUS_LABEL[match.status]}
        </Typography>
      )
    }
    default:
      return <span />
  }
}

/* ── Stat cell ──────────────────────────────────────────────── */
export function StatCell({
  home,
  away,
}: {
  home: number | null | undefined
  away: number | null | undefined
}) {
  return (
    <Typography
      as="span"
      variant="body-sm"
      color="foreground/50"
      className="text-center tabular-nums"
    >
      {`${home ?? 0}-${away ?? 0}`}
    </Typography>
  )
}

/* ── HT cell ────────────────────────────────────────────────── */
export function HTCell({ match }: { match: MatchInterface }) {
  const { homeFirstHalfScore: h, awayFirstHalfScore: a } = match
  if (h == null || a == null)
    return (
      <Typography as="span" variant="body-sm" color="foreground/25" className="text-center">
        —
      </Typography>
    )
  return (
    <Typography
      as="span"
      variant="body-sm"
      weight="500"
      color="foreground/55"
      className="text-center tabular-nums"
    >
      {h}-{a}
    </Typography>
  )
}
