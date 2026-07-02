"use client"

import { useEffect, useMemo, useState } from "react"
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"
import { isEmpty } from "lodash"
import { ChevronUp } from "lucide-react"

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
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { Img } from "@/components/ui/image"
import {
  FixtureStatus,
  HTCell,
  ScoreBadge,
  StatCell,
} from "@/components/ui/match/match-fixture-cells"
import { Pagination } from "@/components/ui/pagination"
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
  stageName: string | null
  matches: MatchInterface[]
}

/* ── Helpers ────────────────────────────────────────────────── */
function groupMatches(matches: MatchInterface[]): MatchGroup[] {
  if (!Array.isArray(matches)) return []
  const map = new Map<string, MatchGroup>()
  for (const match of matches) {
    const key = match.seriesId && match.seriesId > 0 ? `s:${match.seriesId}` : `l:${match.leagueId}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        leagueName: match.leagueName,
        leagueLogo: match.leagueLogo,
        stageName: null,
        matches: [],
      })
    }
    map.get(key)!.matches.push(match)
  }
  return Array.from(map.values())
}

/* ── Single match row ───────────────────────────────────────── */
function FixtureRow({ match }: { match: MatchInterface }) {
  const isStarted =
    match.status === MatchStatusEnum.LIVE || match.status === MatchStatusEnum.FINISHED

  return (
    <div
      className={cn(
        ROW_CLASS,
        "border-foreground/6 border-b py-2! last:border-0",
        "odd:bg-foreground/[0.018] hover:bg-blue/[0.05] cursor-pointer transition-colors"
      )}
    >
      {/* Time */}
      <Typography as="span" size="14" color="foreground/50" className="tabular-nums">
        {match.startTime ? formatKickOff(match.startTime) : "—"}
      </Typography>

      {/* Status */}
      <FixtureStatus match={match} />

      {/* Home team */}
      <div className="flex min-w-0 items-center justify-end gap-2.5">
        <Typography as="span" size="16" weight="600" color="foreground" className="truncate">
          {match.homeName}
        </Typography>
        {match.homeLogo && (
          <Img
            src={match.homeLogo}
            alt=""
            width={26}
            height={26}
            objectFit="contain"
            className="shrink-0"
          />
        )}
      </div>

      {/* Score / VS badge */}
      <ScoreBadge match={match} />

      {/* Away team */}
      <div className="flex min-w-0 items-center gap-2.5">
        {match.awayLogo && (
          <Img
            src={match.awayLogo}
            alt=""
            width={26}
            height={26}
            objectFit="contain"
            className="shrink-0"
          />
        )}
        <Typography as="span" size="16" weight="600" color="foreground" className="truncate">
          {match.awayName}
        </Typography>
      </div>

      {/* Corner kicks */}
      <StatCell
        home={isStarted ? match.homeCornerKick : null}
        away={isStarted ? match.awayCornerKick : null}
      />

      {/* Yellow cards */}
      <StatCell
        home={isStarted ? match.homeYellowCard : null}
        away={isStarted ? match.awayYellowCard : null}
      />

      {/* Red cards */}
      <StatCell
        home={isStarted ? match.homeRedCard : null}
        away={isStarted ? match.awayRedCard : null}
      />

      {/* HT score */}
      <HTCell match={match} />
    </div>
  )
}

type TFn = (key: TranslationKey) => string

/* ── League group ───────────────────────────────────────────── */
function FixtureGroup({ group, t }: { group: MatchGroup; t: TFn }) {
  return (
    <Accordion
      defaultValue={["open"]}
      className="rounded-12 border-foreground/10 overflow-hidden border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_4px_0_0_var(--color-blue)]"
    >
      <AccordionItem value="open" className="border-none">
        {/* League header */}
        <AccordionPrimitive.Header className="flex">
          <AccordionPrimitive.Trigger className="group/fixture border-foreground/8 hover:bg-blue/[0.05] from-blue/[0.07] flex w-full items-center justify-between gap-3 border-b bg-gradient-to-r to-transparent px-5 py-3.5 transition-colors outline-none">
            <div className="flex min-w-0 items-center gap-3">
              {group.leagueLogo && (
                <Img
                  src={group.leagueLogo}
                  alt={group.leagueName ?? ""}
                  width={28}
                  height={28}
                  objectFit="contain"
                  className="shrink-0"
                />
              )}
              <div className="flex min-w-0 flex-col text-left">
                <Typography as="span" size="16" weight="700" color="foreground">
                  {group.leagueName}
                </Typography>
              </div>
            </div>
            <ChevronUp className="text-foreground/35 size-4.5 shrink-0 rotate-180 transition-transform duration-200 group-aria-expanded/fixture:rotate-0" />
          </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>

        <AccordionContent className="[&>div]:pt-0 [&>div]:pb-0">
          <div className="overflow-x-auto">
            {/* Column headers — 11 cols matching ROW_CLASS */}
            <div
              className={cn(ROW_CLASS, "bg-foreground/[0.025] border-foreground/6 border-b py-2!")}
            >
              <Typography as="span" variant="body-sm" weight="500" color="foreground/60">
                {t("home.fixtures.time")}
              </Typography>
              <span />
              <Typography
                as="span"
                variant="body-sm"
                weight="500"
                color="foreground/60"
                className="text-right"
              >
                {t("home.fixtures.homeTeam")}
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
              <Typography as="span" variant="body-sm" weight="500" color="foreground/60">
                {t("home.fixtures.awayTeam")}
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
              <Typography
                as="span"
                variant="body-sm"
                weight="500"
                color="foreground/60"
                className="text-center"
              >
                {t("home.fixtures.ht")}
              </Typography>
            </div>

            {/* Rows */}
            {group.matches.map((match) => (
              <FixtureRow key={match.matchId} match={match} />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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

  const page: number = Number(getParam(MATCH_FIXTURES_PARAMS.PAGE) ?? String(DEFAULT_PAGE))
  const pageSize: number = Number(
    getParam(MATCH_FIXTURES_PARAMS.PAGE_SIZE) ?? String(DEFAULT_PAGE_SIZE)
  )

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

  return (
    <div className="flex flex-col gap-3">
      {!loading ? (
        <>
          {isEmpty(groupMatches(filteredMatches)) ? (
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
            (groupMatches(filteredMatches) || [])?.map((group) => (
              <FixtureGroup key={group.key} group={group} t={t} />
            ))
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
