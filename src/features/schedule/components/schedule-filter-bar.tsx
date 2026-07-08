"use client"

import { useLeagues } from "@/hooks/tanstack/use-leagues"
import { useFixturesFilter } from "@/hooks/use-fixtures-filter"

import { buildLeagueGroupsFromApi } from "@/components/ui/select/league-select"

import { ScheduleFilter } from "./schedule-filter"

export function ScheduleFilterBar() {
  const filter = useFixturesFilter()
  const { data: leaguesData } = useLeagues()

  const hotLeagues = (leaguesData?.hotLeagus ?? []).map((l) => ({
    id: l.leagueId,
    name: l.name,
    count: l.gameCount,
  }))
  const groups = buildLeagueGroupsFromApi(leaguesData?.moreLeagus ?? [])

  return (
    <div className="rounded-12 bg-background/90 sticky top-[60px] z-20 border border-white/10 px-5 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <ScheduleFilter
        groups={groups}
        hotLeagues={hotLeagues}
        pickedDate={filter.pickedDate}
        status={filter.status}
        selectedLeagues={filter.leagueIds}
        onPickedDateChange={filter.setPickedDate}
        onStatusChange={filter.setStatus}
        onLeagueChange={filter.setLeagueIds}
      />
    </div>
  )
}
