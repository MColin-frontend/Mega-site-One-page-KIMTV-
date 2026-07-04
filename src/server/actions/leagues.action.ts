"use server"

import type { LeagueApiResult } from "@/models"

import { fetchLeaguesAction } from "@/features/home/home.api"

export async function fetchLeaguesServerAction(): Promise<LeagueApiResult> {
  return fetchLeaguesAction()
}
