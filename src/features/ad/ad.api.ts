import type { AdPlacementsInterface } from "@/models"

import { getRequest } from "@/server/services/request"

const AD_API = {
  PLACEMENTS: "/advertise/placements",
} as const

async function fetchPlacements(): Promise<AdPlacementsInterface | null> {
  const res = await getRequest<AdPlacementsInterface>(AD_API.PLACEMENTS)
  if (!res.success || !res.data) return null
  return res.data
}

export { AD_API, fetchPlacements }
