import { Suspense } from "react"

import { fetchLiveMatchesAction } from "@/features/home/home.api"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

import { HeroBanner } from "./hero-banner"
import { HeroVideo } from "./hero-video"
import MatchFixtures from "./match-fixtures/index"
import { MatchSchedule } from "./match-schedule"

export async function HomePage() {
  const liveMatches = await fetchLiveMatchesAction()

  return (
    <div className="relative container flex flex-col gap-10 max-lg:gap-6 max-md:gap-4">
      {liveMatches.length > 0 && (
        <ScrollReveal variant="scale" duration={700} threshold={0.04}>
          <Suspense>
            <HeroVideo matches={liveMatches} />
          </Suspense>
        </ScrollReveal>
      )}

      <ScrollReveal variant="fade-up" duration={600} distance={32} threshold={0.06}>
        <Suspense>
          <MatchSchedule />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal variant="blur" duration={700} distance={16} threshold={0.1}>
        <HeroBanner />
      </ScrollReveal>

      <ScrollReveal variant="fade-up" duration={600} distance={28} threshold={0.04}>
        <Suspense>
          <MatchFixtures />
        </Suspense>
      </ScrollReveal>
    </div>
  )
}
