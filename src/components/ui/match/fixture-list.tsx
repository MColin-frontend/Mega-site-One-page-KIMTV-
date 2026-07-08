"use client"

import { isEmpty } from "lodash"

import { formatKickOff } from "@/lib/date"
import { cn } from "@/lib/utils"

import { useTranslation } from "@/i18n/use-translation"
import { SKELETON_BG } from "@/constants/common.constants"
import { MatchStatusEnum } from "@/enums/match.enum"
import type { MatchInterface } from "@/models/match.models"

import { Img } from "@/components/ui/image"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"

import icCornerKick from "@assets/icons/match/ic-goc.svg"
import icRedCard from "@assets/icons/match/ic-red-card.svg"
import icYellowCard from "@assets/icons/match/ic-yellow-card.svg"
import imgEmpty from "@assets/images/common/img-empty.png"

import { FixtureStatus, ScoreBadge, StatCell } from "./match-fixture-cells"

/* ── Constants ──────────────────────────────────────────────────── */

export const FIXTURE_ROW_CLASS =
  "grid items-center gap-x-3 px-3 xl:gap-x-8 xl:px-4 " +
  "grid-cols-[8rem_1fr_4.5rem_5rem_3rem_3rem_3rem] xl:grid-cols-[11rem_1fr_5rem_5.5rem_3.5rem_3.5rem_3.5rem]"

/* ── Types ──────────────────────────────────────────────────────── */

export interface MatchGroupInterface {
  key: string
  leagueName: string | null
  leagueLogo: string | null
  matches: MatchInterface[]
}

export function groupMatches(matches: MatchInterface[]): MatchGroupInterface[] {
  if (!Array.isArray(matches)) return []
  const map = new Map<string, MatchGroupInterface>()
  for (const match of matches) {
    const key = match.seriesId && match.seriesId > 0 ? `s:${match.seriesId}` : `l:${match.leagueId}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        leagueName: match.leagueName,
        leagueLogo: match.leagueLogo,
        matches: [],
      })
    }
    map.get(key)!.matches.push(match)
  }
  return Array.from(map.values())
}

/* ── Skeleton ───────────────────────────────────────────────────── */

function FixtureRowSkeleton() {
  return (
    <div
      className={cn(
        FIXTURE_ROW_CLASS,
        "rounded-10 mb-1.5 border border-white/8 bg-white/[0.04] py-3"
      )}
    >
      <div className="flex items-center gap-2">
        <Skeleton className={cn("rounded-6 size-9 shrink-0", SKELETON_BG)} />
        <Skeleton className={cn("h-3.5 w-20", SKELETON_BG)} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className={cn("size-[30px] shrink-0 rounded-full", SKELETON_BG)} />
          <Skeleton className={cn("h-3.5 w-32", SKELETON_BG)} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className={cn("size-[30px] shrink-0 rounded-full", SKELETON_BG)} />
          <Skeleton className={cn("h-3.5 w-28", SKELETON_BG)} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Skeleton className={cn("h-3.5 w-10", SKELETON_BG)} />
        <Skeleton className={cn("h-3.5 w-12", SKELETON_BG)} />
      </div>
      <div className="flex justify-center">
        <Skeleton className={cn("h-3.5 w-10", SKELETON_BG)} />
      </div>
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
      <Skeleton className={cn("mx-auto h-3 w-8", SKELETON_BG)} />
    </div>
  )
}

export function FixtureListSkeleton() {
  return (
    <div className="rounded-12 overflow-hidden">
      <div className={cn(FIXTURE_ROW_CLASS, "py-2.5 max-md:hidden")}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className={cn("mx-auto h-3 w-14", SKELETON_BG)} />
        ))}
      </div>
      {Array.from({ length: 15 }).map((_, i) => (
        <FixtureRowSkeleton key={i} />
      ))}
    </div>
  )
}

/* ── FixtureRow ─────────────────────────────────────────────────── */

export function FixtureRow({ match }: { match: MatchInterface }) {
  const isStarted =
    match.status === MatchStatusEnum.LIVE || match.status === MatchStatusEnum.FINISHED

  return (
    <>
      {/* Desktop */}
      <div
        className={cn(
          FIXTURE_ROW_CLASS,
          "rounded-10 fixture-row-bg mb-1.5 border border-white/8 py-3 last:mb-0",
          "cursor-pointer transition-colors hover:bg-white/[0.06]",
          "max-sm:hidden"
        )}
      >
        <Tooltip>
          <TooltipTrigger className="flex min-w-0 items-center gap-2 text-left">
            {match.leagueLogo && (
              <Img src={match.leagueLogo} alt="" width={36} height={36} objectFit="contain" />
            )}
            <Typography variant="body-sm" color="foreground/55" className="line-clamp-2">
              {match.leagueName}
            </Typography>
          </TooltipTrigger>
          <TooltipContent>{match.leagueName}</TooltipContent>
        </Tooltip>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2">
            {match.homeLogo && (
              <Img
                src={match.homeLogo}
                alt=""
                width={30}
                height={30}
                objectFit="contain"
                className="shrink-0"
              />
            )}
            <Typography
              as="span"
              variant="label"
              weight="600"
              color="foreground"
              className="truncate"
            >
              {match.homeName}
            </Typography>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            {match.awayLogo && (
              <Img
                src={match.awayLogo}
                alt=""
                width={30}
                height={30}
                objectFit="contain"
                className="shrink-0"
              />
            )}
            <Typography
              as="span"
              variant="label"
              weight="600"
              color="foreground"
              className="truncate"
            >
              {match.awayName}
            </Typography>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          {match.status !== MatchStatusEnum.FINISHED &&
            match.status !== MatchStatusEnum.POSTPONED &&
            match.status !== MatchStatusEnum.CANCELLED && (
              <Typography
                as="span"
                variant="label"
                weight="600"
                color="foreground/80"
                className="tabular-nums"
              >
                {match.startTime ? formatKickOff(match.startTime) : "—"}
              </Typography>
            )}
          <FixtureStatus match={match} />
        </div>

        <ScoreBadge match={match} />

        <StatCell
          home={isStarted ? match.homeCornerKick : null}
          away={isStarted ? match.awayCornerKick : null}
        />
        <StatCell
          home={isStarted ? match.homeYellowCard : null}
          away={isStarted ? match.awayYellowCard : null}
        />
        <StatCell
          home={isStarted ? match.homeRedCard : null}
          away={isStarted ? match.awayRedCard : null}
        />
      </div>

      {/* Mobile */}
      <div
        className={cn(
          "rounded-10 fixture-row-bg mb-1.5 border border-white/8 px-3 py-2.5",
          "cursor-pointer transition-colors hover:bg-white/[0.06]",
          "flex flex-col gap-1.5 sm:hidden"
        )}
      >
        <div className="flex items-center gap-2">
          {match.leagueLogo && (
            <Img
              src={match.leagueLogo}
              alt=""
              width={14}
              height={14}
              objectFit="contain"
              className="shrink-0"
            />
          )}
          <Typography variant="caption" color="foreground/45" className="flex-1 truncate">
            {match.leagueName}
          </Typography>
          <Typography variant="caption" color="foreground/50" className="tabular-nums">
            {match.startTime ? formatKickOff(match.startTime) : "—"}
          </Typography>
          <FixtureStatus match={match} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">
            <Typography
              as="span"
              variant="label"
              weight="600"
              color="foreground"
              className="truncate text-right"
            >
              {match.homeName}
            </Typography>
            {match.homeLogo && (
              <Img
                src={match.homeLogo}
                alt=""
                width={20}
                height={20}
                objectFit="contain"
                className="shrink-0"
              />
            )}
          </div>
          <div className="w-20 shrink-0">
            <ScoreBadge match={match} />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {match.awayLogo && (
              <Img
                src={match.awayLogo}
                alt=""
                width={20}
                height={20}
                objectFit="contain"
                className="shrink-0"
              />
            )}
            <Typography
              as="span"
              variant="label"
              weight="600"
              color="foreground"
              className="truncate"
            >
              {match.awayName}
            </Typography>
          </div>
        </div>

        {isStarted && (
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1">
              <Img src={icCornerKick} alt="" width={12} height={12} objectFit="contain" />
              <Typography
                as="span"
                variant="caption"
                color="foreground/50"
                className="tabular-nums"
              >
                {match.homeCornerKick ?? 0}-{match.awayCornerKick ?? 0}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <Img src={icYellowCard} alt="" width={12} height={12} objectFit="contain" />
              <Typography
                as="span"
                variant="caption"
                color="foreground/50"
                className="tabular-nums"
              >
                {match.homeYellowCard ?? 0}-{match.awayYellowCard ?? 0}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              <Img src={icRedCard} alt="" width={12} height={12} objectFit="contain" />
              <Typography
                as="span"
                variant="caption"
                color="foreground/50"
                className="tabular-nums"
              >
                {match.homeRedCard ?? 0}-{match.awayRedCard ?? 0}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/* ── TableHeader ────────────────────────────────────────────────── */

export function FixtureTableHeader() {
  const { t } = useTranslation()
  return (
    <div className={cn(FIXTURE_ROW_CLASS, "py-3 max-sm:hidden")}>
      <Typography as="span" variant="body-sm" weight="500" color="foreground/60">
        {t("home.fixtures.league")}
      </Typography>
      <Typography as="span" variant="body-sm" weight="500" color="foreground/60">
        {t("home.fixtures.match")}
      </Typography>
      <Typography
        as="span"
        variant="body-sm"
        weight="500"
        color="foreground/60"
        className="text-center"
      >
        {t("home.fixtures.time")}
      </Typography>
      <Typography
        as="span"
        variant="body-sm"
        weight="500"
        color="foreground/60"
        className="text-center"
      >
        {t("home.fixtures.score")}
      </Typography>
      <span className="flex justify-center">
        <Img
          src={icCornerKick}
          alt={t("home.fixtures.cornerKick")}
          width={14}
          height={14}
          objectFit="contain"
        />
      </span>
      <span className="flex justify-center">
        <Img
          src={icYellowCard}
          alt={t("home.fixtures.yellowCard")}
          width={14}
          height={14}
          objectFit="contain"
        />
      </span>
      <span className="flex justify-center">
        <Img
          src={icRedCard}
          alt={t("home.fixtures.redCard")}
          width={14}
          height={14}
          objectFit="contain"
        />
      </span>
    </div>
  )
}

/* ── FixtureList ────────────────────────────────────────────────── */

interface FixtureListProps {
  groups: MatchGroupInterface[]
  loading: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

export function FixtureList({
  groups,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
}: FixtureListProps) {
  const { t } = useTranslation()

  if (loading) return <FixtureListSkeleton />

  return (
    <div className="flex flex-col gap-3">
      {isEmpty(groups) ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Img
            src={imgEmpty.src}
            alt={t("home.fixtures.empty")}
            width={120}
            height={120}
            objectFit="contain"
          />
          <Typography variant="body-sm" color="foreground/40">
            {t("home.fixtures.empty")}
          </Typography>
        </div>
      ) : (
        <div className="rounded-12 overflow-hidden">
          <FixtureTableHeader />
          {groups.map((group) => (
            <div key={group.key}>
              {group.matches.map((match) => (
                <FixtureRow key={match.matchId} match={match} />
              ))}
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        className="py-3"
      />
    </div>
  )
}
