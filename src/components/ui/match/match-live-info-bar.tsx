"use client"

import { useEffect, useState } from "react"
import { Calendar, Share2, Trophy } from "lucide-react"

import { formatFootballGameTime, formatMatchDate, formatMatchTime } from "@/lib/date"
import { cn } from "@/lib/utils"
import { useLiveNavigate } from "@/hooks/use-live-navigate"
import { useFakeGameMinute } from "@/hooks/useFakeGameMinute"

import { useTranslation } from "@/i18n"
import { MATCH_HALF_LABEL } from "@/constants/common.constants"
import {
  MATCH_CARD_I18N_KEYS,
  MATCH_HALF_LABEL_I18N_KEY,
  MATCH_STAT_CONFIG,
} from "@/constants/component/match-card.constants"
import { MatchFootballStateEnum, MatchStatusEnum } from "@/enums/match.enum"
import type { MatchInterface } from "@/models/match.models"

import { AvatarWithTooltip } from "@/components/ui/avatar"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import imgStadiumBg from "@assets/images/common/img-no-source.png"
import imgVs from "@assets/images/common/img-vs.png"

import { MatchLiveIndicator } from "./parts/match-live-indicator"
import { MatchPeriodBadge } from "./parts/match-period-badge"

/* ── Types ───────────────────────────────────────────────── */

export interface MatchLiveInfoBarProps {
  match: MatchInterface
  className?: string
}

/* ── Share button ────────────────────────────────────────── */

function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const el = document.getElementById("match-share-btn")
      if (el && !el.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleCopy() {
    const url = window.location.href
    navigator.clipboard?.writeText(url).catch(() => {
      const input = document.createElement("input")
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand("Copy")
      document.body.removeChild(input)
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div id="match-share-btn" className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="group text-muted flex h-[30px] items-center gap-1.5 rounded-full border border-transparent px-3 transition-all hover:border-[rgba(255,187,0,0.35)] hover:bg-gradient-to-b hover:from-[#111] hover:via-[#222] hover:to-[#111]"
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

/* ── Main component ──────────────────────────────────────── */

export function MatchLiveInfoBar({ match, className }: MatchLiveInfoBarProps) {
  const { t } = useTranslation()
  const navigateToLive = useLiveNavigate()

  function handleClick() {
    if (!match.matchId || !match.gameId) return
    navigateToLive(match.matchId, match.gameId)
  }

  const {
    leagueName,
    leagueLogo,
    homeName,
    homeLogo,
    awayName,
    awayLogo,
    homeScore,
    awayScore,
    gameId,
    anchorRoomVos,
  } = match

  const isUpcoming =
    match.status === MatchStatusEnum.UPCOMING || match.status === MatchStatusEnum.UNKNOWN
  const isFinished = match.status === MatchStatusEnum.FINISHED
  const isLive = !isFinished && (!!match.isLive || match.status === MatchStatusEnum.LIVE)

  const halfLabel = MATCH_HALF_LABEL[match.state as MatchFootballStateEnum] ?? "LIVE"
  const periodI18nKey = MATCH_HALF_LABEL_I18N_KEY[halfLabel]
  const periodLabel = periodI18nKey ? t(periodI18nKey as Parameters<typeof t>[0]) : halfLabel

  const displayMinute = useFakeGameMinute(match.gameTime, isLive)

  const anchors =
    anchorRoomVos?.map((a) => ({ userAvatar: a.userAvatar ?? "", userName: a.userName ?? "" })) ??
    []

  const firstAnchor = anchorRoomVos?.[0] ?? null
  const thumbnail = firstAnchor?.cover ?? match.animationUrl ?? null
  const isSoccer = gameId === 202
  const showStats = isSoccer || (gameId != null && gameId > 200)

  const statValues = [
    0,
    (match.homeYellowCard ?? 0) + (match.awayYellowCard ?? 0),
    (match.homeRedCard ?? 0) + (match.awayRedCard ?? 0),
    (match.homeCornerKick ?? 0) + (match.awayCornerKick ?? 0),
  ]
  const stats = MATCH_STAT_CONFIG.map((cfg, i) => ({
    ...cfg,
    label: t(cfg.labelKey as Parameters<typeof t>[0]),
    value: statValues[i],
  }))

  return (
    <div
      onClick={handleClick}
      className={cn(
        "rounded-b-12 relative flex w-full shrink-0 cursor-pointer flex-col gap-3 overflow-hidden p-2 transition-opacity hover:opacity-95 max-lg:gap-2 max-sm:gap-1.5 max-sm:p-1.5",
        className
      )}
    >
      {thumbnail ? (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          <div className="card-thumbnail-overlay pointer-events-none absolute inset-0 z-[1]" />
          <div className="pointer-events-none absolute inset-0 z-[1]" />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-50"
            style={{
              backgroundImage: `url(${imgStadiumBg.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {match.homeLogo && (
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${match.homeLogo})`,
                backgroundSize: "160px",
                backgroundPosition: "-10px center",
                backgroundRepeat: "no-repeat",
                filter: "blur(55px) saturate(2)",
                opacity: 0.13,
                transform: "scale(1.6)",
              }}
            />
          )}
          {match.awayLogo && (
            <div
              className="pointer-events-none absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${match.awayLogo})`,
                backgroundSize: "160px",
                backgroundPosition: "calc(100% + 10px) center",
                backgroundRepeat: "no-repeat",
                filter: "blur(55px) saturate(2)",
                opacity: 0.1,
                transform: "scale(1.6)",
              }}
            />
          )}
          <div className="card-stadium-overlay pointer-events-none absolute inset-0 z-[1]" />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-black/20" />
        </>
      )}

      {/* Content above bg */}
      <div className="relative z-[2] flex flex-col gap-1 max-lg:gap-2">
        {/* Row 1: live + time + share — ẩn trên mobile */}
        <div className="flex w-full items-center justify-between max-sm:-my-1 max-sm:origin-left">
          <div className="flex items-center gap-2 max-sm:scale-75">
            <MatchLiveIndicator />
          </div>
          <div className="flex items-center gap-1.5 max-sm:scale-75">
            <div className="flex items-center gap-1.5">
              <MatchPeriodBadge label={periodLabel} className="sm:hidden" />
              {displayMinute != null && displayMinute !== 0 && (
                <div className="rounded-4 border-gold/30 bg-gold/10 border px-1.5 py-0.5">
                  <Typography
                    as="span"
                    variant="label"
                    weight="700"
                    className="text-gold drop-shadow-gold"
                  >
                    {formatFootballGameTime(displayMinute)}
                    <span className="animate-blink">&apos;</span>
                  </Typography>
                </div>
              )}
            </div>
            <ShareButton />
          </div>
        </div>

        {/* Row 2: teams + score */}
        <div className="flex items-center justify-between gap-4 max-sm:gap-2">
          {/* Home */}
          <div className="flex min-w-0 flex-1 items-center justify-end gap-3 max-sm:gap-1.5">
            <Typography
              as="span"
              variant="body"
              weight="700"
              className="min-w-0 truncate text-right text-white"
            >
              {homeName}
            </Typography>
            <div className="flex size-[64px] shrink-0 items-center justify-center max-lg:size-12 max-sm:size-9">
              <Img src={homeLogo} alt={homeName ?? ""} width={64} height={64} objectFit="contain" />
            </div>
          </div>

          {/* Score */}
          <div className="flex shrink-0 flex-col items-center gap-1">
            {isUpcoming ? (
              <Img src={imgVs} alt="VS" width={48} height={48} objectFit="contain" />
            ) : (
              <>
                <div className="flex items-center gap-0.5">
                  <Typography
                    as="span"
                    size="48"
                    weight="700"
                    className="text-gold drop-shadow-gold-score max-sm:!text-30 leading-none tabular-nums"
                  >
                    {homeScore ?? 0}
                  </Typography>
                  <Typography
                    as="span"
                    size="24"
                    weight="500"
                    className="text-gold/60 px-0.5 leading-100"
                  >
                    :
                  </Typography>
                  <Typography
                    as="span"
                    size="48"
                    weight="700"
                    className="text-gold drop-shadow-gold-score max-sm:!text-30 leading-none tabular-nums"
                  >
                    {awayScore ?? 0}
                  </Typography>
                </div>
                <MatchPeriodBadge label={periodLabel} className="max-sm:hidden" />
                {isFinished && (
                  <div className="rounded-4 border-gold/30 bg-gold/10 shadow-gold-glow border px-1.5 py-px">
                    <Typography
                      as="span"
                      variant="caption"
                      weight="600"
                      className="text-gold drop-shadow-gold-sm"
                    >
                      {t(MATCH_CARD_I18N_KEYS.finished)}
                    </Typography>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Away */}
          <div className="flex min-w-0 flex-1 items-center gap-3 max-sm:gap-1.5">
            <div className="flex size-[64px] shrink-0 items-center justify-center max-lg:size-12 max-sm:size-9">
              <Img src={awayLogo} alt={awayName ?? ""} width={64} height={64} objectFit="contain" />
            </div>
            <Typography
              as="span"
              variant="body"
              weight="700"
              className="min-w-0 truncate text-white"
            >
              {awayName}
            </Typography>
          </div>
        </div>

        {/* Row 3: stats + anchors */}
        {showStats && (
          <div className="flex items-center justify-center gap-3 max-sm:origin-center max-sm:scale-75">
            <div className="rounded-8 flex items-center gap-1 bg-white/10 px-2 py-1 backdrop-blur-2xl">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && <div className="mr-1 h-3 w-px shrink-0 bg-white/30" />}
                  <div className="flex w-[70px] flex-col items-center gap-0.5">
                    <div className="flex items-center gap-0.5">
                      <Img src={s.icon} alt={s.alt} width={12} height={12} objectFit="contain" />
                      <Typography
                        as="span"
                        variant="caption"
                        weight="700"
                        className="text-white tabular-nums"
                      >
                        {s.value}
                      </Typography>
                    </div>
                    <Typography as="span" size="10" className="text-white/80">
                      {s.label}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {anchors && anchors.length > 0 && (
              <div className="flex items-center">
                {anchors.slice(0, 3).map((anchor, i) => (
                  <AvatarWithTooltip
                    key={i}
                    src={anchor.userAvatar}
                    name={anchor.userName}
                    size={38}
                    index={i}
                    overlap={6}
                  />
                ))}
                {anchors.length > 3 && (
                  <Typography
                    as="div"
                    size="10"
                    weight="600"
                    className="text-muted relative -ml-1.5 flex size-[26px] items-center justify-center rounded-full bg-white/10 ring-2 ring-[#0c1526]"
                  >
                    +{anchors.length - 3}
                  </Typography>
                )}
              </div>
            )}
          </div>
        )}

        {/* Row 4: league + time */}
        <div className="flex items-center justify-between px-0.5 py-1">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
            {leagueLogo ? (
              <Img
                src={leagueLogo}
                alt=""
                width={20}
                height={20}
                objectFit="contain"
                className="shrink-0"
              />
            ) : (
              <Trophy className="text-gold size-3.5 shrink-0" />
            )}
            <Typography
              as="span"
              variant="caption"
              weight="500"
              className="max-w-[195px] min-w-0 truncate text-white/90"
            >
              {leagueName}
            </Typography>
          </div>
          {match.startTime && (
            <div className="flex shrink-0 items-center gap-1 max-sm:origin-right max-sm:scale-75">
              <Calendar className="size-3 shrink-0 text-white/50" />
              <Typography
                as="span"
                variant="caption"
                weight="500"
                className="text-white/70 tabular-nums"
              >
                {formatMatchTime(match.startTime)}
                <span className="mx-1 inline-block h-2.5 w-px bg-white/30 align-middle" />
                {formatMatchDate(match.startTime)}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
