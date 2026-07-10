import { postRequest } from "@/server/services/request"
import { MATCH_API } from "@/lib/match.utils"

import type { MatchInterface } from "@/models/match.models"

export async function fetchLiveScheduleMatches(): Promise<MatchInterface[]> {
  const data = await postRequest<MatchInterface[]>(MATCH_API.LIVE, { gameId: [] }).catch(() => null)
  return Array.isArray(data) ? data : []
}
