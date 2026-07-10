"use client"

import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { javaGet } from "@/server/services/client-request"
import { MATCH_API } from "@/lib/match.utils"
import { useRouter } from "@/hooks/useRouter"

import { useTranslation } from "@/i18n"
import { FOOTBALL_GAME_MONGO_ID } from "@/constants/component/home.constants"

import {
  LIVE_SCHEDULE_DEFAULT_TAB,
  LIVE_SCHEDULE_FILTER_OPTIONS,
  LIVE_SCHEDULE_TAB_PARAM,
  type LiveScheduleTab,
} from "@/features/live-schedule/live-schedule.constants"
import CarouselInfinity from "@/components/ui/carousel/carousel-infinity"
import { EmptyState } from "@/components/ui/empty-state"
import {
  LiveSearchMatchInterface,
  MatchCardThumbnail,
  MatchCardThumbnailSkeleton,
} from "@/components/ui/match/match-card-thumbnail"
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

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["live-matches-grid", typeScreen],
    queryFn: () =>
      javaGet<LiveSearchMatchInterface[]>(MATCH_API.LIVE_SEARCH, {
        params: { id: FOOTBALL_GAME_MONGO_ID, typeScreen },
      }).then((d) => d ?? []),
    staleTime: 30_000,
  })

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
          <div className="sm:hidden">
            <div className="-ml-4 flex overflow-x-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="shrink-0 basis-[85vw] pl-4">
                  <MatchCardThumbnailSkeleton />
                </div>
              ))}
            </div>
          </div>
          {/* Desktop skeleton grid */}
          <div className="hidden grid-cols-2 gap-4 sm:grid lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <MatchCardThumbnailSkeleton key={i} />
            ))}
          </div>
        </>
      ) : matches.length > 0 ? (
        <>
          {/* Mobile carousel */}
          <div className="sm:hidden">
            <CarouselInfinity
              items={matches}
              renderItem={(match, i) => (
                <MatchCardThumbnail key={`${match.matchId}-${i}`} match={match} />
              )}
              slideClassName="basis-[85vw]"
              keyExtractor={(m, i) => `${m.matchId}-${i}`}
            />
          </div>
          {/* Desktop grid */}
          <div className="hidden grid-cols-2 gap-4 sm:grid lg:grid-cols-3 xl:grid-cols-4">
            {matches.map((match, i) => (
              <MatchCardThumbnail key={`${match.matchId}-${i}`} match={match} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState label={t("common.empty")} />
      )}
    </section>
  )
}
