import type { NewsItem } from "@/models/home.models"

/** Client-side Next.js API routes cho news feature. */
export const NEWS_ROUTES = {
  COMMENTS: "/api/news/comments",
  LIKE: "/api/news/like",
} as const

export interface HotNewsResult {
  news: NewsItem[]
  videos: NewsItem[]
}
