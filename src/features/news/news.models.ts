import type { NewsItem } from "@/models/home.models"

interface NewsCardPropsInterface {
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

interface NewsPanelHeaderPropsInterface {
  title: string
  viewAllHref: string
  viewAllLabel: string
}

interface NewsMetaRowPropsInterface {
  item: Pick<NewsItem, "userName" | "likeCount" | "commentCount">
  className?: string
}

interface FollowButtonPropsInterface {
  authorId: number | null | undefined
  initialFollow: boolean | null | undefined
}

interface CommentComposeInputPropsInterface {
  placeholder?: string
  submitLabel?: string
  loading?: boolean
  onSubmit: (text: string) => void
}

interface CommentSectionPropsInterface {
  newsId: string | number
  newsType?: number
  initialCount?: number
}

interface HotNewsResultInterface {
  news: NewsItem[]
  videos: NewsItem[]
}

export type {
  NewsItem,
  NewsCardPropsInterface,
  NewsPanelPropsInterface,
  NewsHeroPropsInterface,
  NewsPanelHeaderPropsInterface,
  NewsMetaRowPropsInterface,
  FollowButtonPropsInterface,
  CommentComposeInputPropsInterface,
  CommentSectionPropsInterface,
  HotNewsResultInterface,
}
