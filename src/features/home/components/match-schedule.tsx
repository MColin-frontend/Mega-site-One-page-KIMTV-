"use client"

import { useSearchParams } from "next/navigation"

import { useRouter } from "@/hooks/useRouter"

import { useTranslation } from "@/i18n"
import { DATE_RANGE_OPTIONS, DEFAULT_FILTER_MATCH } from "@/constants/component/home.constants"
import { DateRangeEnum } from "@/enums/common.enum"
import type { MatchInterface } from "@/models/match.models"

import { getEndpointByDate } from "@/features/home/home.api"
import CarouselInfinityApi from "@/components/ui/carousel/carousel-infinity-api"
import { Img } from "@/components/ui/image"
import { MatchCard } from "@/components/ui/match/match-card"
import { Select } from "@/components/ui/select/select"
import { Typography } from "@/components/ui/typography"

import imgEmpty from "@assets/images/common/img-empty.png"

export function MatchSchedule() {
  const { t } = useTranslation()
  const { setParams } = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get("date") as DateRangeEnum | null

  const dateOptions = DATE_RANGE_OPTIONS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }))

  return (
    <section className="rounded-12 card-glow flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <Typography variant="h2">{t("home.match-schedule.title")}</Typography>

        <Select
          options={dateOptions}
          value={date ?? DEFAULT_FILTER_MATCH}
          variant="glass"
          size="sm"
          triggerClassName="w-40 min-w-0"
          onValueChange={(val) => setParams({ date: val }, { scroll: false })}
        />
      </div>

      <CarouselInfinityApi<MatchInterface>
        key={date}
        endpoint={getEndpointByDate(date)}
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
