import { Suspense } from "react"
import Link from "next/link"
import { isEmpty } from "lodash"
import { ArrowRight } from "lucide-react"

import { getTranslation } from "@/i18n/get-locale"
import { getRoutes } from "@/config/routes"

import type { NewsItem } from "@/features/home/home.api"
import { fetchFeaturedNewsAction } from "@/features/home/home.api"
import { Typography } from "@/components/ui/typography"

import { NewsCard } from "./news-card"
import { NewsCarouselMobile } from "./news-carousel-mobile"
import { NewsSectionSkeleton } from "./skeleton"

function NewsListContent({
  items,
  categoryLabel,
  getHref,
}: {
  items: NewsItem[]
  categoryLabel: string
  getHref: (id: string) => string
}) {
  return (
    <>
      <div className="hidden flex-col lg:flex">
        {items.map((item) => (
          <div key={String(item.newsId)} className="mb-2">
            <NewsCard
              item={item}
              categoryLabel={categoryLabel}
              href={getHref(String(item.newsId))}
            />
          </div>
        ))}
      </div>

      {/* Mobile: slide full width */}
      <div className="lg:hidden">
        <NewsCarouselMobile items={items} categoryLabel={categoryLabel} />
      </div>
    </>
  )
}

function SectionHeader({
  title,
  href,
  viewAllLabel,
}: {
  title: string
  href: string
  viewAllLabel: string
}) {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="h2">{title}</Typography>
      <Link
        href={href}
        className="group/btn text-13 font-500 text-muted flex items-center gap-1 overflow-hidden pr-1 transition-colors hover:text-white"
      >
        <span className="transition-all duration-200 group-hover/btn:italic">{viewAllLabel}</span>
        <ArrowRight className="size-4 -translate-x-4 opacity-0 transition-all duration-200 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
      </Link>
    </div>
  )
}

interface SectionProps {
  title: string
  categoryLabel: string
  viewAllHref: string
  viewAllLabel: string
  getHref: (id: string) => string
}

async function FeaturedSection({
  title,
  categoryLabel,
  viewAllHref,
  viewAllLabel,
  getHref,
}: SectionProps) {
  const items = await fetchFeaturedNewsAction()
  if (isEmpty(items)) return null
  return (
    <div
      className="card-glow rounded-12 flex flex-col gap-2 p-4"
      style={{
        background: [
          "radial-gradient(ellipse at 10% 0%, rgba(74,140,255,0.16) 0%, transparent 55%)",
          "radial-gradient(ellipse at 90% 100%, rgba(30,80,180,0.13) 0%, transparent 50%)",
          "radial-gradient(ellipse at 50% 50%, rgba(20,50,120,0.08) 0%, transparent 70%)",
          "rgba(8,15,30,0.85)",
        ].join(", "),
        backdropFilter: "blur(32px)",
      }}
    >
      <SectionHeader title={title} href={viewAllHref} viewAllLabel={viewAllLabel} />
      <NewsListContent items={items.slice(0, 5)} categoryLabel={categoryLabel} getHref={getHref} />
    </div>
  )
}

export default async function NewsList() {
  const { t, locale } = await getTranslation()
  const routes = getRoutes(locale)
  const commonProps = {
    categoryLabel: t("news.category"),
    viewAllHref: routes.news.index,
    viewAllLabel: t("news.viewAll"),
    getHref: (id: string) => routes.news.article(id),
  }

  return (
    <Suspense fallback={<NewsSectionSkeleton />}>
      <FeaturedSection {...commonProps} title={t("news.title")} />
    </Suspense>
  )
}
