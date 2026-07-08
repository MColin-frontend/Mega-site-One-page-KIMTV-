import type { NewsItem } from "@/models/home.models"

interface NewsPanelProps {
  items: NewsItem[]
  title: string
  viewAllHref: string
  viewAllLabel: string
  categoryLabel: string
  getHref: (id: string) => string
}

export type { NewsPanelProps }
