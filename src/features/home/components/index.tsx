import { Img } from "@/components/ui/image"

import bgBanner1 from "@assets/images/components/img-bg-banner-1.png"
import bgBanner from "@assets/images/components/img-bg-banner.png"

import { HeroBanner } from "./hero-banner"
import MatchFixtures from "./match-fixtures/index"
import { MatchSchedule } from "./match-schedule"

export function HomePage() {
  return (
    <div className="relative">
      <Img src={bgBanner} alt="" fill priority wrapperClassName="absolute inset-0 -z-20" />
      <Img src={bgBanner1} alt="" fill wrapperClassName="absolute inset-0 -z-10" />

      <div className="relative container">
        <HeroBanner />
        <MatchSchedule />
        <MatchFixtures />
      </div>
    </div>
  )
}
