"use client"

import { useTranslation } from "@/i18n"
import type { BannerItem } from "@/models/home.models"

import { Banner } from "@/components/ui/banner"

import heroBanner from "@assets/images/home/img-hero-banner.png"

const MOCK_BANNERS: BannerItem[] = [
  { imageUrl: heroBanner.src, url: "/", width: heroBanner.width, height: heroBanner.height },
  { imageUrl: heroBanner.src, url: "/", width: heroBanner.width, height: heroBanner.height },
  { imageUrl: heroBanner.src, url: "/", width: heroBanner.width, height: heroBanner.height },
]

interface HeroBannerProps {
  data?: BannerItem[]
}

export function HeroBanner({ data = MOCK_BANNERS }: HeroBannerProps) {
  const { t } = useTranslation()

  return <Banner alt={t("home.hero.alt")} data={data} />
}
