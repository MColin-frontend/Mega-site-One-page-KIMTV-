"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { useRouter } from "@/hooks/useRouter"

import { useTranslation } from "@/i18n"

import { liveMatchesGridQueryOptions } from "@/features/live-schedule/live-schedule.api"
import {
  LIVE_SCHEDULE_DEFAULT_TAB,
  LIVE_SCHEDULE_FILTER_OPTIONS,
  LIVE_SCHEDULE_TAB_PARAM,
  type LiveScheduleTab,
} from "@/features/live-schedule/live-schedule.constants"
import CarouselInfinity from "@/components/ui/carousel/carousel-infinity"
import { Empty } from "@/components/ui/empty"
import { MatchCardLive } from "@/components/ui/match/match-card-live"
import { MatchCardLiveSkeleton } from "@/components/ui/match/skeleton"
import { Select } from "@/components/ui/select/select"
import { Typography } from "@/components/ui/typography"

function getTypeScreen(tab: LiveScheduleTab): number {
  return LIVE_SCHEDULE_FILTER_OPTIONS.find((o) => o.value === tab)?.typeScreen ?? 0
}

/* ── Main component ───────────────────────────────────────── */

export function LiveMatchFilterSection() {
  const { t } = useTranslation()
  const { setParams } = useRouter()
  const searchParams = useSearchParams()
  const tab = (searchParams.get(LIVE_SCHEDULE_TAB_PARAM) ??
    LIVE_SCHEDULE_DEFAULT_TAB) as LiveScheduleTab

  const typeScreen = getTypeScreen(tab)

  const filterOptions = LIVE_SCHEDULE_FILTER_OPTIONS.map((o) => ({
    value: o.value,
    label: t(o.labelKey as Parameters<typeof t>[0]),
  }))

  const { data: matches = [], isLoading } = useQuery(liveMatchesGridQueryOptions(typeScreen))

  const skeletonCount = 10

  return (
    <section className="card-glow rounded-12 flex flex-col gap-4 p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <Typography variant="h2">Trực tiếp</Typography>

        <Select
          options={filterOptions}
          value={tab}
          variant="glass"
          size="sm"
          triggerClassName="w-44 min-w-0"
          onValueChange={(val) => setParams({ [LIVE_SCHEDULE_TAB_PARAM]: val }, { scroll: false })}
        />
      </div>

      {/* Mobile: carousel | Desktop: grid */}
      {isLoading ? (
        <>
          {/* Mobile skeleton carousel */}
          <div className="hidden max-sm:block">
            <div className="-ml-4 flex overflow-x-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="shrink-0 basis-[85vw] pl-4">
                  <MatchCardLiveSkeleton />
                </div>
              ))}
            </div>
          </div>
          {/* Desktop skeleton grid */}
          <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:hidden">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <MatchCardLiveSkeleton key={i} />
            ))}
          </div>
        </>
      ) : matches.length > 0 ? (
        <>
          {/* Mobile carousel */}
          <div className="hidden max-sm:block">
            <CarouselInfinity
              items={matches}
              renderItem={(match, i) => (
                <MatchCardLive key={`${match.matchId}-${i}`} match={match} />
              )}
              slideClassName="basis-[85vw]"
              keyExtractor={(m, i) => `${m.matchId}-${i}`}
            />
          </div>
          {/* Desktop grid */}
          <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:hidden">
            {matches.map((match, i) => (
              <MatchCardLive key={`${match.matchId}-${i}`} match={match} />
            ))}
          </div>
        </>
      ) : (
        <Empty tip={t("common.empty")} />
      )}
    </section>
  )
}
