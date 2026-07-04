"use client"

import { useTranslation } from "@/i18n"
import type { BannerItem } from "@/models/home.models"

import { Banner } from "@/components/ui/banner"

import heroBanner1 from "@assets/images/home/img-mockup-banner-1.png"

const MOCK_BANNERS: BannerItem[] = [
  { imageUrl: heroBanner1.src, url: "/", width: heroBanner1.width, height: heroBanner1.height },
  { imageUrl: heroBanner1.src, url: "/", width: heroBanner1.width, height: heroBanner1.height },
  { imageUrl: heroBanner1.src, url: "/", width: heroBanner1.width, height: heroBanner1.height },
]

interface HeroBannerProps {
  data?: BannerItem[]
}

export function HeroBanner({ data = MOCK_BANNERS }: HeroBannerProps) {
  const { t } = useTranslation()

  return <Banner alt={t("home.hero.alt")} data={data} />
}
