"use client"

import { useEffect, useMemo, useState } from "react"
import { isEmpty } from "lodash"

import { fetchAllAction, fetchPageAction } from "@/server/actions/slide.action"
import { formatKickOff, parseDateParam } from "@/lib/date"
import { cn } from "@/lib/utils"
import { useRouter } from "@/hooks/useRouter"

import { useTranslation } from "@/i18n/use-translation"
import type { TranslationKey } from "@/i18n/use-translation"
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/common.constants"
import {
  MATCH_FIXTURES_PARAMS,
  MATCH_STATUS_TAB,
  type MatchStatusTabValue,
} from "@/constants/component/home.constants"
import { MatchStatusEnum } from "@/enums/match.enum"
import type { MatchInterface } from "@/models/match.models"

import { getApiConfig } from "@/features/home/home.api"
import { Img } from "@/components/ui/image"
import { FixtureStatus, ScoreBadge, StatCell } from "@/components/ui/match/match-fixture-cells"
import { Pagination } from "@/components/ui/pagination"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"

import icCornerKick from "@assets/icons/match/ic-goc.svg"
import icRedCard from "@assets/icons/match/ic-red-card.svg"
import icYellowCard from "@assets/icons/match/ic-yellow-card.svg"
import imgEmpty from "@assets/images/common/img-empty.png"

import { FixturesListSkeleton, ROW_CLASS } from "./skeleton"

interface MatchGroup {
  key: string
  leagueName: string | null
  leagueLogo: string | null
  matches: MatchInterface[]
}

function groupMatches(matches: MatchInterface[]): MatchGroup[] {
  if (!Array.isArray(matches)) return []
  const map = new Map<string, MatchGroup>()
  for (const match of matches) {
    const key = match.seriesId && match.seriesId > 0 ? `s:${match.seriesId}` : `l:${match.leagueId}`
    if (!map.has(key)) {
      map.set(key, { key, leagueName: match.leagueName, leagueLogo: match.leagueLogo, matches: [] })
    }
    map.get(key)!.matches.push(match)
  }
  return Array.from(map.values())
}

type TFn = (key: TranslationKey) => string

/* ── Single match row ───────────────────────────────────────── */
function FixtureRow({ match }: { match: MatchInterface }) {
  const isStarted =
    match.status === MatchStatusEnum.LIVE || match.status === MatchStatusEnum.FINISHED

  return (
    <>
      <div
        className={cn(
          ROW_CLASS,
          "rounded-10 fixture-row-bg mb-1.5 border border-white/8 py-3 last:mb-0",
          "cursor-pointer transition-colors hover:bg-white/[0.06]",
          "max-sm:hidden"
        )}
      >
        {/* Col 1: League */}
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

        {/* Col 2: Teams stacked */}
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

        {/* Col 3: Time + Status stacked */}
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

        {/* Col 4: Score */}
        <ScoreBadge match={match} />

        {/* Col 5-7: Stats */}
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

/* ── Column headers ─────────────────────────────────────────── */
function TableHeader({ t }: { t: TFn }) {
  return (
    <div className={cn(ROW_CLASS, "py-3 max-sm:hidden")}>
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

/* ── Main export ────────────────────────────────────────────── */
function FixturesList() {
  const { t } = useTranslation()
  const { getParam, setParams } = useRouter()
  const [allMatches, setAllMatches] = useState<MatchInterface[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  const pickedDateParam = getParam(MATCH_FIXTURES_PARAMS.PICKED_DATE)
  const pickedDate = parseDateParam(pickedDateParam) ?? new Date()
  const statusFilter = (getParam(MATCH_FIXTURES_PARAMS.STATUS) ??
    MATCH_STATUS_TAB.ALL) as MatchStatusTabValue
  const selectedLeagues: number[] = (getParam(MATCH_FIXTURES_PARAMS.LEAGUES) ?? "")
    .split(",")
    .filter(Boolean)
    .map(Number)

  const page = Number(getParam(MATCH_FIXTURES_PARAMS.PAGE) ?? String(DEFAULT_PAGE))
  const pageSize = Number(getParam(MATCH_FIXTURES_PARAMS.PAGE_SIZE) ?? String(DEFAULT_PAGE_SIZE))

  const handleChangePage = (p: number) => {
    setLoading(true)
    setParams(
      { [MATCH_FIXTURES_PARAMS.PAGE]: p === DEFAULT_PAGE ? null : String(p) },
      { scroll: false }
    )
  }

  useEffect(() => {
    const pickedDateTs = Math.floor(
      new Date(pickedDate.getFullYear(), pickedDate.getMonth(), pickedDate.getDate()).getTime() /
        1000
    )
    const apiConfig = getApiConfig(statusFilter, pickedDateTs, selectedLeagues)
    const { endpoint, method, params, paginate } = apiConfig

    if (paginate === false) {
      fetchAllAction<MatchInterface>(endpoint, method, params).then((data) => {
        setAllMatches(data)
        setTotal(data.length)
        setLoading(false)
      })
    } else {
      fetchPageAction<MatchInterface>(endpoint, method, params, page, pageSize).then(
        ({ data, total: t }) => {
          setAllMatches(data || [])
          setTotal(t)
          setLoading(false)
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pickedDateParam, page, pageSize, selectedLeagues.join(",")])

  const filteredMatches = useMemo(() => {
    let result = [...allMatches]
    if (statusFilter !== MATCH_STATUS_TAB.ALL && statusFilter !== MATCH_STATUS_TAB.LIVE) {
      const statusMap: Partial<Record<MatchStatusTabValue, number>> = {
        [MATCH_STATUS_TAB.UPCOMING]: MatchStatusEnum.UPCOMING,
        [MATCH_STATUS_TAB.FINISHED]: MatchStatusEnum.FINISHED,
      }
      const target = statusMap[statusFilter]
      if (target !== undefined) {
        result = result.filter((m) => m.status === target || m.status === MatchStatusEnum.UNKNOWN)
      }
    }
    return result
  }, [allMatches, statusFilter])

  const groups = groupMatches(filteredMatches)

  return (
    <div className="flex flex-col gap-3">
      {!loading ? (
        <>
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
              <TableHeader t={t} />
              {groups.map((group) => (
                <div key={group.key}>
                  {group.matches.map((match) => (
                    <FixtureRow key={match.matchId} match={match} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <FixturesListSkeleton />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={handleChangePage}
        className="py-3"
      />
    </div>
  )
}

export default FixturesList
