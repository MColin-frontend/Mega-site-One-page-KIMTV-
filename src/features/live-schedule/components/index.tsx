"use client"

import { Suspense } from "react"

import { useTranslation } from "@/i18n"

import { LIVE_SECTION_CONFIG } from "@/features/live/live.constants"
import { MatchCarouselSection } from "@/components/ui/match/match-carousel-section"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

import { LiveBanner } from "./live-banner"
import { LiveMatchFilterSection } from "./live-match-filter-section"

const SECTIONS = [LIVE_SECTION_CONFIG.UPCOMING, LIVE_SECTION_CONFIG.FINISHED] as const

export function LiveSchedulePage() {
  const { t } = useTranslation()

  return (
    <div className="container flex flex-col gap-8 py-8 max-lg:gap-6 max-lg:py-6 max-md:gap-4 max-md:py-4">
      {SECTIONS.map((cfg) => (
        <ScrollReveal
          key={cfg.i18nKey}
          variant="fade-up"
          duration={600}
          distance={32}
          threshold={0.06}
        >
          <MatchCarouselSection
            title={t(cfg.i18nKey as Parameters<typeof t>[0])}
            endpoint={cfg.endpoint}
            method={cfg.method}
            params={{ ...cfg.params }}
            matchType={cfg.matchType}
          />
        </ScrollReveal>
      ))}

      <ScrollReveal variant="blur" duration={700} distance={16} threshold={0.1}>
        <Suspense>
          <LiveBanner />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" duration={600} distance={32} threshold={0.06}>
        <LiveMatchFilterSection />
      </ScrollReveal>
    </div>
  )
}
