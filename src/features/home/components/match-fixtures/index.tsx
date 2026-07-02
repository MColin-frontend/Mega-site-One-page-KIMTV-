import { getLocale } from "@/i18n/get-locale"

import { fetchFeaturedNewsAction, fetchLatestNewsListAction } from "@/features/home/home.api"

import Fixtures from "./fixtures"
import News from "./news"
import NewsMobileCarousel from "./news/news-carousel"

export default async function MatchFixtures() {
  const [featured, latest, locale] = await Promise.all([
    fetchFeaturedNewsAction(),
    fetchLatestNewsListAction(),
    getLocale(),
  ])
  const hasNews = featured.length > 0 || latest.length > 0

  return (
    <section className="mt-6 mb-20 grid grid-cols-10 gap-4 max-lg:flex max-lg:flex-col">
      {/* Mobile: news carousel trên cùng */}
      {hasNews && (
        <div className="hidden max-lg:block">
          <NewsMobileCarousel featured={featured} latest={latest} locale={locale} />
        </div>
      )}

      {/* Fixtures */}
      <div className={hasNews ? "col-span-7" : "col-span-10"}>
        <Fixtures />
      </div>

      {/* Desktop: news sidebar */}
      {hasNews && (
        <div className="sticky top-[60px] col-span-3 self-start max-lg:hidden">
          <News />
        </div>
      )}
    </section>
  )
}
