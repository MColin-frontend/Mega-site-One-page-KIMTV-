import { Suspense } from "react"

import { getTranslation } from "@/i18n/get-locale"
import { getRoutes } from "@/config/routes"

import { fetchFeaturedNewsAction, fetchLatestNewsListAction } from "@/features/home/home.api"
import { fetchPopularNewsListAction } from "@/features/news/news.api"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import { NewsHeroCarousel } from "./hero"
import { NewsCard } from "./new-card"
import { NEWS_PANEL_STYLE, NewsMetaRow, NewsPanelHeader, POPULAR_PANEL_STYLE } from "./shared"
import { NewsHeroSkeleton, NewsPanelsSkeleton } from "./skeleton"

async function HeroSection() {
  const items = await fetchFeaturedNewsAction()
  if (!items.length) return null
  return <NewsHeroCarousel items={items.slice(0, 5)} />
}

async function PanelsSection() {
  const { t, locale } = await getTranslation()
  const routes = getRoutes(locale)

  const [latestResult, popularResult] = await Promise.allSettled([
    fetchLatestNewsListAction(5),
    fetchPopularNewsListAction(),
  ])

  const latestNews = latestResult.status === "fulfilled" ? latestResult.value : []
  const popularNews = popularResult.status === "fulfilled" ? popularResult.value : []

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_0.43fr]">
      {latestNews.length > 0 && (
        <div className="card-glow rounded-12 flex flex-col gap-5 p-5" style={NEWS_PANEL_STYLE}>
          <NewsPanelHeader
            title={t("news.latest")}
            viewAllHref={routes.news.index}
            viewAllLabel={t("news.viewAll")}
          />
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
            <a
              href={routes.news.article(String(latestNews[0].newsId))}
              className="card-glow group rounded-10 relative block h-full min-h-[280px] overflow-hidden bg-[#0a1128] transition-all hover:ring-1 hover:ring-white/20"
            >
              <Img
                src={latestNews[0].coverUrl}
                alt={latestNews[0].title}
                fill
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                wrapperClassName="absolute inset-0"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(36,43,53,0.1) 0%, rgba(36,43,53,0.5) 55%, rgba(36,43,53,0.88) 100%)",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-4">
                <Typography variant="overline" className="text-gold">
                  {t("news.category")}
                </Typography>
                <Typography
                  variant="body"
                  weight="600"
                  className="group-hover:text-gold line-clamp-3 text-white transition-colors"
                >
                  {latestNews[0].title}
                </Typography>
                <NewsMetaRow item={latestNews[0]} />
              </div>
            </a>
            {latestNews.slice(1).length > 0 && (
              <div className="flex h-full flex-col gap-1">
                {latestNews.slice(1).map((item) => (
                  <NewsCard
                    key={String(item.newsId)}
                    item={item}
                    href={routes.news.article(String(item.newsId))}
                    categoryLabel={t("news.category")}
                    className="min-h-0 flex-1"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {popularNews.length > 0 && (
        <div className="card-glow rounded-12 flex flex-col gap-4 p-5" style={POPULAR_PANEL_STYLE}>
          <NewsPanelHeader
            title={t("news.popular")}
            viewAllHref={routes.news.index}
            viewAllLabel={t("news.viewAll")}
          />
          <div className="flex flex-col gap-1">
            {popularNews.slice(0, 4).map((item) => (
              <NewsCard
                key={String(item.newsId)}
                item={item}
                href={routes.news.article(String(item.newsId))}
                categoryLabel={t("news.category")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export async function NewsIndexPage() {
  const { t } = await getTranslation()

  return (
    <div className="container flex flex-col gap-8 py-8 max-lg:gap-6 max-lg:py-6 max-md:gap-4 max-md:py-4">
      <div className="flex flex-col gap-1">
        <Typography variant="h1" className="text-gold uppercase">
          {t("news.pageTitle")}
        </Typography>
        <Typography variant="body" weight="600" className="text-white">
          {t("news.subtitle")}
        </Typography>
      </div>

      <Suspense fallback={<NewsHeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<NewsPanelsSkeleton />}>
        <PanelsSection />
      </Suspense>
    </div>
  )
}
