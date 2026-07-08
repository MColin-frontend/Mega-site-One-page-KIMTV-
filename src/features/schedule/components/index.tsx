import { Suspense } from "react"
import dynamic from "next/dynamic"

import { getTranslation } from "@/i18n/get-locale"

import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Typography } from "@/components/ui/typography"

import { ScheduleSkeleton } from "./skeleton"

const ScheduleList = dynamic(() => import("./schedule-list"), {
  loading: () => <ScheduleSkeleton />,
})

export async function SchedulePage() {
  const { t } = await getTranslation()

  return (
    <div className="container flex flex-col gap-8 py-8 max-lg:gap-6 max-lg:py-6 max-md:gap-4 max-md:py-4">
      <ScrollReveal variant="fade-up" duration={600} distance={24} threshold={0.06}>
        <div className="flex flex-col gap-1">
          <Typography variant="h1" className="text-gold uppercase">
            {t("schedule.pageTitle")}
          </Typography>
          <Typography variant="body" weight="600" className="text-white">
            {t("schedule.subtitle")}
          </Typography>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" duration={600} distance={32} threshold={0.04}>
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleList />
        </Suspense>
      </ScrollReveal>
    </div>
  )
}
