import { getRequest } from "@/server/services/request"

import { FOOTBALL_GAME_ID } from "@/constants/component/home.constants"
import type { NewsArticleDetail, NewsItem, PopularNewsResult } from "@/models/home.models"

const NEWS_API = {
  ARTICLE: "/news/news-article",
  HOT_BY_GAME: "/news/get-hot-news-by-game",
  POPULAR: "/news/get-popular-news-by-game",
} as const

/** Client-side Next.js API routes cho news feature. */
export const NEWS_ROUTES = {
  COMMENTS: "/api/news/comments",
  LIKE: "/api/news/like",
} as const

export const USER_ROUTES = {
  FOLLOW: "/api/user/follow",
} as const

export interface HotNewsResult {
  news: NewsItem[]
  videos: NewsItem[]
}

/** Tin tức phổ biến theo game (30 ngày) — field `news`. */
async function fetchPopularNewsListAction(gameIds = FOOTBALL_GAME_ID): Promise<NewsItem[]> {
  const res = await getRequest<PopularNewsResult>(`${NEWS_API.POPULAR}?gameIds=${gameIds}`)
  return res.success ? (res.data?.news ?? []) : []
}

/** Chi tiết bài viết theo newsId. */
async function fetchNewsArticleAction(newsId: string): Promise<NewsArticleDetail | null> {
  const res = await getRequest<NewsArticleDetail>(`${NEWS_API.ARTICLE}?newsId=${newsId}`)
  return res.success ? (res.data ?? null) : null
}

/** Tin + video nổi bật theo game — sidebar bài viết. */
async function fetchHotNewsByGameAction(gameId = FOOTBALL_GAME_ID): Promise<HotNewsResult> {
  const res = await getRequest<{ news?: NewsItem[]; videos?: NewsItem[] }>(
    `${NEWS_API.HOT_BY_GAME}?gameIds=${gameId}`
  )
  if (!res.success || !res.data) return { news: [], videos: [] }
  return {
    news: (res.data.news ?? []).slice(0, 5),
    videos: (res.data.videos ?? []).slice(0, 4),
  }
}

export { fetchPopularNewsListAction, fetchNewsArticleAction, fetchHotNewsByGameAction }
