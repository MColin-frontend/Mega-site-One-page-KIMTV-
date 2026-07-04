import { useQuery } from "@tanstack/react-query"

import { fetchPlacementsAction } from "@/server/actions/ad.action"

import { QUERY_KEYS } from "@/constants/query-keys.constants"

export function useAdPlacements() {
  return useQuery({
    queryKey: QUERY_KEYS.adPlacements,
    queryFn: fetchPlacementsAction,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
