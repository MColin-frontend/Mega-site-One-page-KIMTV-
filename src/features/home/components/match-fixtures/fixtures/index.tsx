"use client"

import dynamic from "next/dynamic"

import { useLeagues } from "@/hooks/tanstack/use-leagues"
import { useFixturesFilter } from "@/hooks/use-fixtures-filter"

import { FixtureListSkeleton } from "@/components/ui/match/fixture-list"
import { buildLeagueGroupsFromApi } from "@/components/ui/select/league-select"

import HeroFixtures from "./hero-banner"

const FixturesList = dynamic(() => import("./fixtures"), {
  loading: () => <FixtureListSkeleton />,
})

function Fixtures() {
  const filter = useFixturesFilter()
  const { data: leaguesData } = useLeagues()

  const hotLeagues = (leaguesData?.hotLeagus ?? []).map((l) => ({
    id: l.leagueId,
    name: l.name,
    count: l.gameCount,
  }))
  const groups = buildLeagueGroupsFromApi(leaguesData?.moreLeagus ?? [])

  return (
    <section
      className="rounded-12 card-glow flex flex-col gap-4 p-5"
      style={{
        background: [
          "radial-gradient(ellipse at 20% 0%, rgba(74,140,255,0.14) 0%, transparent 55%)",
          "radial-gradient(ellipse at 80% 100%, rgba(30,80,180,0.12) 0%, transparent 50%)",
          "radial-gradient(ellipse at 50% 50%, rgba(20,50,120,0.10) 0%, transparent 70%)",
          "#080f1e",
        ].join(", "),
        backdropFilter: "blur(40px)",
      }}
    >
      <HeroFixtures
        groups={groups}
        hotLeagues={hotLeagues}
        pickedDate={filter.pickedDate}
        statusFilter={filter.status}
        selectedLeagues={filter.leagueIds}
        onPickedDateChange={filter.setPickedDate}
        onStatusChange={(val) => filter.setStatus(val as Parameters<typeof filter.setStatus>[0])}
        onLeagueChange={filter.setLeagueIds}
      />
      <FixturesList />
    </section>
  )
}

export default Fixtures
