"use client"

import { useMemo } from "react"

import { useLeagues } from "@/hooks/tanstack/use-leagues"
import { useFixtureData } from "@/hooks/use-fixture-data"
import { useFixturesFilter } from "@/hooks/use-fixtures-filter"

import { FixtureList, groupMatches } from "@/components/ui/match/fixture-list"
import { buildLeagueGroupsFromApi } from "@/components/ui/select/league-select"

import { ScheduleFilter } from "./schedule-filter"

export default function ScheduleList() {
  const filter = useFixturesFilter()
  const { data: leaguesData } = useLeagues()
  const { filteredMatches, total, loading } = useFixtureData(filter)
  const groups = useMemo(() => groupMatches(filteredMatches), [filteredMatches])

  const hotLeagues = (leaguesData?.hotLeagus ?? []).map((l) => ({
    id: l.leagueId,
    name: l.name,
    count: l.gameCount,
  }))
  const leagueGroups = buildLeagueGroupsFromApi(leaguesData?.moreLeagus ?? [])

  return (
    <section
      className="rounded-12 card-glow flex flex-col gap-4 p-5"
      style={{
        background: [
          "radial-gradient(ellipse at 20% 0%, rgba(74,140,255,0.14) 0%, transparent 55%)",
          "radial-gradient(ellipse at 80% 100%, rgba(30,80,180,0.12) 0%, transparent 50%)",
          "#080f1e",
        ].join(", "),
        backdropFilter: "blur(40px)",
      }}
    >
      <div className="sticky top-[76px] z-20">
        <ScheduleFilter
          groups={leagueGroups}
          hotLeagues={hotLeagues}
          pickedDate={filter.pickedDate}
          status={filter.status}
          selectedLeagues={filter.leagueIds}
          disabled={loading}
          onPickedDateChange={filter.setPickedDate}
          onStatusChange={filter.setStatus}
          onLeagueChange={filter.setLeagueIds}
        />
      </div>

      <FixtureList
        groups={groups}
        loading={loading}
        page={filter.page}
        pageSize={filter.pageSize}
        total={total}
        onPageChange={filter.setPage}
      />
    </section>
  )
}
