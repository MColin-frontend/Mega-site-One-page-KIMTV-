"use client"

import type { MatchInterface } from "@/models/match.models"

import { LiveMatchFilterSection } from "@/features/live-schedule/components/live-match-filter-section"
import { MatchCard } from "@/components/ui/match/match-card"
import type { LiveSearchMatchInterface } from "@/components/ui/match/match-card-live"

export function MatchSchedule() {
  return (
    <LiveMatchFilterSection
      hideFilter
      renderCard={(match: LiveSearchMatchInterface) => (
        <MatchCard match={match as unknown as MatchInterface} />
      )}
    />
  )
}
