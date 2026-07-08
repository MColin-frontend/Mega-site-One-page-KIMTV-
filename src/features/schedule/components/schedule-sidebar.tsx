import { Suspense } from "react"
import { isEmpty } from "lodash"

import { getTranslation } from "@/i18n/get-locale"
import { getRoutes } from "@/config/routes"

import { HighlightsCarousel } from "@/features/home/components/match-fixtures/news/highlights"
import { NewsCard } from "@/features/home/components/match-fixtures/news/news-card"
import { NewsCarouselMobile } from "@/features/home/components/match-fixtures/news/news-carousel-mobile"
import {
  HighlightsSkeleton,
  NewsSectionSkeleton,
} from "@/features/home/components/match-fixtures/news/skeleton"
import {
  fetchFeaturedNewsAction,
  fetchLatestNewsListAction,
  fetchPopularNewsAction,
} from "@/features/home/home.api"
import type { NewsItem } from "@/features/home/home.api"

// ─── Highlights ──────────────────────────────────────────────────────────────

async function HighlightsSection() {
  const items = await fetchPopularNewsAction()
  if (!items.length) return null
  return <HighlightsCarousel items={items} />
}

// ─── News section card (shared layout) ───────────────────────────────────────

interface NewsSectionCardProps {
  title: string
  viewAllHref: string
  viewAllLabel: string
  items: NewsItem[]
  categoryLabel: string
  getHref: (id: string) => string
}

function NewsSectionCard({
  title,
  viewAllHref,
  viewAllLabel,
  items,
  categoryLabel,
  getHref,
}: NewsSectionCardProps) {
  if (isEmpty(items)) return null
  return (
    <div className="panel-news rounded-12 flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-primary text-18 font-700 tracking-0 leading-163">{title}</h2>
        <a
          href={viewAllHref}
          className="group/btn text-13 font-500 text-muted flex items-center gap-1 overflow-hidden pr-1 transition-colors hover:text-white"
        >
          <span className="transition-all duration-200 group-hover/btn:italic">{viewAllLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-translate-x-4 opacity-0 transition-all duration-200 group-hover/btn:translate-x-0 group-hover/btn:opacity-100"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="hidden flex-col lg:flex">
        {items.slice(0, 5).map((item) => (
          <div key={String(item.newsId)} className="mb-2">
            <NewsCard
              item={item}
              categoryLabel={categoryLabel}
              href={getHref(String(item.newsId))}
            />
          </div>
        ))}
      </div>

      <div className="lg:hidden">
        <NewsCarouselMobile items={items.slice(0, 5)} categoryLabel={categoryLabel} />
      </div>
    </div>
  )
}

// ─── Tin tức xu hướng ────────────────────────────────────────────────────────

interface SectionProps {
  title: string
  viewAllHref: string
  viewAllLabel: string
  categoryLabel: string
  getHref: (id: string) => string
}

async function TrendingNewsSection(props: SectionProps) {
  const items = await fetchFeaturedNewsAction()
  return <NewsSectionCard {...props} items={items} />
}

// ─── Tin tức mới nhất ────────────────────────────────────────────────────────

async function LatestNewsSection(props: SectionProps) {
  const items = await fetchLatestNewsListAction(5)
  return <NewsSectionCard {...props} items={items} />
}

// ─── Export ──────────────────────────────────────────────────────────────────

export async function ScheduleSidebar() {
  const { t, locale } = await getTranslation()
  const routes = getRoutes(locale)

  const commonProps: Omit<SectionProps, "title"> = {
    categoryLabel: t("news.category"),
    viewAllHref: routes.news.index,
    viewAllLabel: t("news.viewAll"),
    getHref: (id) => routes.news.article(id),
  }

  return (
    <section className="flex flex-col gap-4">
      <Suspense fallback={<HighlightsSkeleton />}>
        <HighlightsSection />
      </Suspense>

      <Suspense fallback={<NewsSectionSkeleton />}>
        <TrendingNewsSection {...commonProps} title={t("news.title")} />
      </Suspense>

      <Suspense fallback={<NewsSectionSkeleton />}>
        <LatestNewsSection {...commonProps} title={t("schedule.latestNews")} />
      </Suspense>
    </section>
  )
}
