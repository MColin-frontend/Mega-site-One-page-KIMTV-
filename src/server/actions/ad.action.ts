"use server"

import type { AdPlacementsInterface } from "@/models"

import { fetchPlacements } from "@/features/ad/ad.api"

export async function fetchPlacementsAction(): Promise<AdPlacementsInterface | null> {
  return fetchPlacements()
}
