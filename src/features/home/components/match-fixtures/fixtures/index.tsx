"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

import { formatDateParam, parseDateParam } from "@/lib/date"
import { useRouter } from "@/hooks/useRouter"

import {
  MATCH_FIXTURES_PARAMS,
  MATCH_STATUS_TAB,
  type MatchStatusTabValue,
} from "@/constants/component/home.constants"

import { fetchLeaguesAction } from "@/features/home/home.api"
import {
  buildLeagueGroupsFromApi,
  type LeagueGroup,
  type LeagueItem,
} from "@/components/ui/select/league-select"

import HeroFixtures from "./hero-banner"
import { FixturesListSkeleton } from "./skeleton"

const FixturesList = dynamic(() => import("./fixtures"), {
  loading: () => <FixturesListSkeleton />,
})

function Fixtures() {
  const { getParam, setParams, removeParams } = useRouter()

  const date: string | null = getParam(MATCH_FIXTURES_PARAMS.DATE)
  const pickedDateParam: string | null = getParam(MATCH_FIXTURES_PARAMS.PICKED_DATE)
  const pickedDate: Date = parseDateParam(pickedDateParam) ?? new Date()
  const selectedLeagues: number[] = (getParam(MATCH_FIXTURES_PARAMS.LEAGUES) ?? "")
    .split(",")
    .filter(Boolean)
    .map(Number)
  const statusFilter: MatchStatusTabValue = (getParam(MATCH_FIXTURES_PARAMS.STATUS) ??
    MATCH_STATUS_TAB.ALL) as MatchStatusTabValue

  const [hotLeagues, setHotLeagues] = useState<LeagueItem[]>([])
  const [groups, setGroups] = useState<LeagueGroup[]>([])
  const isInitialMount = useRef<boolean>(true)

  useEffect(() => {
    if (!isInitialMount.current) {
      removeParams(MATCH_FIXTURES_PARAMS.LEAGUES, { replace: true })
    }
    isInitialMount.current = false
    fetchLeaguesAction().then(({ hotLeagus, moreLeagus }) => {
      setHotLeagues(hotLeagus.map((l) => ({ id: l.leagueId, name: l.name, count: l.gameCount })))
      setGroups(buildLeagueGroupsFromApi(moreLeagus))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

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
          const today = new Date()
          const isLive = val === MATCH_STATUS_TAB.LIVE
          const isFinished = val === MATCH_STATUS_TAB.FINISHED
          const pickedIsAfterToday = pickedDate > today
          setParams(
            {
              [MATCH_FIXTURES_PARAMS.STATUS]: val === MATCH_STATUS_TAB.ALL ? null : val,
              ...(isLive || (isFinished && pickedIsAfterToday)
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
