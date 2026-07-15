"use client"

import { useTranslation } from "@/i18n"
import type { MatchInterface } from "@/models/match.models"

import { getEndpointByDate } from "@/features/home/home.api"
import CarouselInfinityApi from "@/components/ui/carousel/carousel-infinity-api"
import { Img } from "@/components/ui/image"
import { MatchCard } from "@/components/ui/match/match-card"
import { Typography } from "@/components/ui/typography"

import imgEmpty from "@assets/images/common/img-empty.png"

export function MatchSchedule() {
  const { t } = useTranslation()

  return (
    <section className="rounded-12 card-glow flex flex-col gap-4 p-5">
      <Typography variant="h2">Đang diễn ra</Typography>

      <CarouselInfinityApi<MatchInterface>
        endpoint={getEndpointByDate(null)}
        method="POST"
        params={{ gameId: [] }}
        renderItem={(match, _, isLoading) => <MatchCard match={match} isLoading={isLoading} />}
        renderEmpty={() => (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Img src={imgEmpty.src} alt="" width={140} height={140} objectFit="contain" />
            <Typography variant="body-sm" className="text-primary">
              {t("common.empty")}
            </Typography>
          </div>
        )}
        slideClassName="basis-[350px] max-sm:basis-full"
      />
    </section>
  )
}
