"use client"

import { HTTP_METHOD, LIVE_MATCH_TYPE, MATCH_QUERY_PARAMS } from "@/lib/match.utils"

import { useTranslation } from "@/i18n"
import type { MatchInterface } from "@/models/match.models"

import CarouselInfinityApi from "@/components/ui/carousel/carousel-infinity-api"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import imgEmpty from "@assets/images/common/img-empty.png"

import { MatchCard } from "./match-card"

interface MatchCarouselSectionProps {
  title: string
  endpoint: string
  method?: (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD]
  params?: Record<string, unknown>
  matchType?: (typeof LIVE_MATCH_TYPE)[keyof typeof LIVE_MATCH_TYPE]
}

export function MatchCarouselSection({
  title,
  endpoint,
  method = HTTP_METHOD.POST,
  params = MATCH_QUERY_PARAMS.ALL_GAMES,
  matchType = LIVE_MATCH_TYPE.LIVE,
}: MatchCarouselSectionProps) {
  const { t } = useTranslation()

  return (
    <section className="card-glow rounded-12 flex flex-col gap-4 p-5">
      <Typography variant="h2">{title}</Typography>

      <CarouselInfinityApi<MatchInterface>
        endpoint={endpoint}
        method={method}
        params={params}
        renderItem={(match, _, isLoading) => (
          <MatchCard match={match} isLoading={isLoading} matchType={matchType} />
        )}
        renderEmpty={() => (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <Img src={imgEmpty.src} alt="" width={120} height={120} objectFit="contain" />
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
