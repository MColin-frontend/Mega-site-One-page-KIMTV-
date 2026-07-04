import { useQuery } from "@tanstack/react-query"

import { fetchLeaguesServerAction } from "@/server/actions/leagues.action"

import { QUERY_KEYS } from "@/constants/query-keys.constants"

export function useLeagues() {
  return useQuery({
    queryKey: QUERY_KEYS.leagues,
    queryFn: fetchLeaguesServerAction,
    staleTime: 5 * 60 * 1000,
  })
}
