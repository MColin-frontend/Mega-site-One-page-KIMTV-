import type { NewsItem } from "@/models/home.models"

interface NewsItemRowPropsInterface {
  item: NewsItem
  href: string
  categoryLabel: string
  className?: string
}

interface NewsPanelPropsInterface {
  items: NewsItem[]
  title: string
  viewAllHref: string
  viewAllLabel: string
  categoryLabel: string
  getHref: (id: string) => string
}

interface NewsHeroPropsInterface {
  items: NewsItem[]
}

export type { NewsItem, NewsItemRowPropsInterface, NewsPanelPropsInterface, NewsHeroPropsInterface }
