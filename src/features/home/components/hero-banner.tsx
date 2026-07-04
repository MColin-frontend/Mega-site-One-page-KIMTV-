"use client"

import dynamic from "next/dynamic"

import { useAdPlacements } from "@/hooks/use-ad-placements"

import heroBanner1 from "@assets/images/home/img-mockup-banner-1.png"

const AdBanner = dynamic(() => import("@/components/ui/ad-banner").then((m) => m.AdBanner), {
  ssr: false,
})

export function HeroBanner() {
  const { data: ads, isLoading } = useAdPlacements()
  const homeBanner = ads?.homeBanner

  return (
    <AdBanner
      src={homeBanner?.enabled ? homeBanner.mediaPc : null}
      href={homeBanner?.jumpUrl || null}
      fallback={heroBanner1.src}
      isLoading={isLoading}
      skeletonClassName="aspect-[1660/132]"
      className="w-full"
      rounded="rounded-12"
    />
  )
}
