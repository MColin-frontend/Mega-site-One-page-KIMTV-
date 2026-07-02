"use server"

import type { MatchInterface } from "@/models/match.models"

import type { LeagueGroup, LeagueItem } from "@/components/ui/select/league-select"

import { fetchSlideAction } from "./slide.action"

function getFirstLetter(name: string): string {
  const normalized = name.trim().toUpperCase()
  const char = normalized[0]
  return /[A-Z]/.test(char) ? char : "#"
}

export async function fetchLeaguesAction(endpoint: string): Promise<LeagueGroup[]> {
  const matches = await fetchSlideAction<MatchInterface>(endpoint, "POST", { gameId: [] }, 1, 500)

  const leagueMap = new Map<number, LeagueItem>()

  for (const match of matches) {
    if (!match.leagueId || !match.leagueName) continue
    const existing = leagueMap.get(match.leagueId)
    if (existing) {
      existing.count = (existing.count ?? 0) + 1
    } else {
      leagueMap.set(match.leagueId, {
        id: match.leagueId,
        name: match.leagueName,
        count: 1,
      })
    }
  }

  const sorted = [...leagueMap.values()].sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "vi")
  )

  const groupMap = new Map<string, LeagueItem[]>()
  for (const league of sorted) {
    const letter = getFirstLetter(String(league.name))
    if (!groupMap.has(letter)) groupMap.set(letter, [])
    groupMap.get(letter)!.push(league)
  }

  return [...groupMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({ letter, items }))
}
