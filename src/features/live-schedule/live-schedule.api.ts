import { queryOptions } from "@tanstack/react-query"

import { javaGet } from "@/server/services/client-request"
import { postRequest } from "@/server/services/request"
import { MATCH_API } from "@/lib/match.utils"

import { FOOTBALL_GAME_MONGO_ID } from "@/constants/component/home.constants"
import type { MatchInterface } from "@/models/match.models"

import type { LiveSearchMatchInterface } from "@/components/ui/match/match-card-live"

export async function fetchLiveScheduleMatches(): Promise<MatchInterface[]> {
  const data = await postRequest<MatchInterface[]>(MATCH_API.LIVE, { gameId: [] }).catch(() => null)
  return Array.isArray(data) ? data : []
}

export function liveMatchesGridQueryOptions(typeScreen: number) {
  return queryOptions({
    queryKey: ["live-matches-grid", typeScreen],
    queryFn: () =>
      javaGet<LiveSearchMatchInterface[]>(MATCH_API.LIVE_SEARCH, {
        params: { id: FOOTBALL_GAME_MONGO_ID, typeScreen },
      }).then((d) => d ?? []),
    staleTime: 30_000,
  })
}
