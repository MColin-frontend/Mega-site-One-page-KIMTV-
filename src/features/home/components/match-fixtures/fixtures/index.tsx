"use client"

import dynamic from "next/dynamic"

import { formatDateParam, parseDateParam } from "@/lib/date"
import { useLeagues } from "@/hooks/use-leagues"
import { useRouter } from "@/hooks/useRouter"

import {
  MATCH_FIXTURES_PARAMS,
  MATCH_STATUS_TAB,
  type MatchStatusTabValue,
} from "@/constants/component/home.constants"

import { buildLeagueGroupsFromApi } from "@/components/ui/select/league-select"

import HeroFixtures from "./hero-banner"
import { FixturesListSkeleton } from "./skeleton"

const FixturesList = dynamic(() => import("./fixtures"), {
  loading: () => <FixturesListSkeleton />,
})

function Fixtures() {
  const { getParam, setParams } = useRouter()

  const pickedDate = parseDateParam(getParam(MATCH_FIXTURES_PARAMS.PICKED_DATE)) ?? new Date()
  const selectedLeagues = (getParam(MATCH_FIXTURES_PARAMS.LEAGUES) ?? "")
    .split(",")
    .filter(Boolean)
    .map(Number)
  const statusFilter = (getParam(MATCH_FIXTURES_PARAMS.STATUS) ??
    MATCH_STATUS_TAB.ALL) as MatchStatusTabValue

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
        pickedDate={pickedDate}
        statusFilter={statusFilter}
        selectedLeagues={selectedLeagues}
        onPickedDateChange={(d) =>
          setParams(
            { [MATCH_FIXTURES_PARAMS.PICKED_DATE]: d ? formatDateParam(d) : null },
            { scroll: false }
          )
        }
        onStatusChange={(val) => {
          const isLive = val === MATCH_STATUS_TAB.LIVE
          const isFinished = val === MATCH_STATUS_TAB.FINISHED
          setParams(
            {
              [MATCH_FIXTURES_PARAMS.STATUS]: val === MATCH_STATUS_TAB.ALL ? null : val,
              ...(isLive || (isFinished && pickedDate > new Date())
                ? { [MATCH_FIXTURES_PARAMS.PICKED_DATE]: null }
                : {}),
            },
            { scroll: false }
          )
        }}
        onLeagueChange={(value) =>
          setParams(
            { [MATCH_FIXTURES_PARAMS.LEAGUES]: value.length ? value.join(",") : null },
            { scroll: false }
          )
        }
      />
      <FixturesList />
    </section>
  )
}

export default Fixtures
