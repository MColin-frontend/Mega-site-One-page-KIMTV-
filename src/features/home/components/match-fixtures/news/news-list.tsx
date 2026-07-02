import { Suspense } from "react"
import Link from "next/link"
import { isEmpty } from "lodash"
import { ArrowRight, Heart, MessageCircle } from "lucide-react"

import { cn } from "@/lib/utils"

import { getTranslation } from "@/i18n/get-locale"
import { getRoutes } from "@/config/routes"

import type { NewsItem } from "@/features/home/home.api"
import { fetchFeaturedNewsAction, fetchLatestNewsListAction } from "@/features/home/home.api"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import { NewsSectionSkeleton } from "./skeleton"

interface NewsCardProps {
  item: NewsItem
  categoryLabel: string
  href: string
}

function NewsCard({ item, href }: NewsCardProps) {
  return (
    <Link
      href={href}
      className="group hover:bg-blue/[0.05] -mx-2 flex cursor-pointer gap-3 rounded-lg px-2 py-1 transition-colors"
    >
      <div className="shrink-0 overflow-hidden rounded-lg">
        <Img
          src={item.coverUrl}
          alt={item.title}
          width={190}
          height={100}
          rounded="8"
          className="max-h-[100px] max-w-[190px] transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography variant="body" className="group-hover:text-blue line-clamp-2 transition-colors">
          {item.title}
        </Typography>
        <div className="mt-auto flex items-center gap-3">
          {item.userName && (
            <Typography variant="caption" className="truncate">
              {item.userName}
            </Typography>
          )}
          <div className="flex items-center gap-2">
            {item.likeCount != null && (
              <span className="flex items-center gap-0.5">
                <Heart className="text-foreground/30 size-4" />
                <Typography variant="caption" color="foreground/40">
                  {item.likeCount}
                </Typography>
              </span>
            )}
            {item.commentCount != null && (
              <span className="flex items-center gap-0.5">
                <MessageCircle className="text-foreground/30 size-4" />
                <Typography variant="caption" color="foreground/40">
                  {item.commentCount}
                </Typography>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

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
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div key={String(item.newsId)} className={cn("mb-2")}>
          <NewsCard item={item} categoryLabel={categoryLabel} href={getHref(String(item.newsId))} />
        </div>
      ))}
    </div>
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
        className="group/btn text-blue text-13 font-500 flex items-center gap-1 overflow-hidden pr-1 transition-colors"
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
    <div className="flex flex-col gap-2">
      <SectionHeader title={title} href={viewAllHref} viewAllLabel={viewAllLabel} />
      <NewsListContent items={items.slice(0, 5)} categoryLabel={categoryLabel} getHref={getHref} />
    </div>
  )
}

async function LatestSection({
  title,
  categoryLabel,
  viewAllHref,
  viewAllLabel,
  getHref,
}: SectionProps) {
  const items = await fetchLatestNewsListAction()
  if (isEmpty(items)) return null
  return (
    <div className="flex flex-col gap-2">
      <SectionHeader title={title} href={viewAllHref} viewAllLabel={viewAllLabel} />
      <NewsListContent items={items} categoryLabel={categoryLabel} getHref={getHref} />
    </div>
  )
}

export default async function NewsList() {
  const { t, locale } = await getTranslation()
  const routes = getRoutes(locale)
  const commonProps = {
    categoryLabel: t("home.news.category"),
    viewAllHref: routes.news.index,
    viewAllLabel: t("home.news.viewAll"),
    getHref: (id: string) => routes.news.article(id),
  }

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<NewsSectionSkeleton />}>
        <FeaturedSection {...commonProps} title={t("home.news.title")} />
      </Suspense>

      <Suspense fallback={<NewsSectionSkeleton />}>
        <LatestSection {...commonProps} title={t("home.news.latest")} />
      </Suspense>
    </div>
  )
}
