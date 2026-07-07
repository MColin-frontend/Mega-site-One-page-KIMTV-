import "server-only"

import { getRequest } from "@/server/services/request"
import { getServerLoginUserId } from "@/lib/auth-server"

import { FOOTBALL_GAME_ID } from "@/constants/component/home.constants"
import type { NewsArticleDetail, NewsItem, PopularNewsResult } from "@/models/home.models"

import type { HotNewsResult } from "./news.api"

const NEWS_API = {
  ARTICLE: "/news/news-article",
  HOT_BY_GAME: "/news/get-hot-news-by-game",
  POPULAR: "/news/get-popular-news-by-game",
} as const

/** Tin tức phổ biến theo game (30 ngày) — field `news`. */
async function fetchPopularNewsListAction(gameIds = FOOTBALL_GAME_ID): Promise<NewsItem[]> {
  const res = await getRequest<PopularNewsResult>(`${NEWS_API.POPULAR}?gameIds=${gameIds}`)
  return res.success ? (res.data?.news ?? []) : []
}

/** Chi tiết bài viết theo newsId. */
async function fetchNewsArticleAction(newsId: string): Promise<NewsArticleDetail | null> {
  const loginUserId = await getServerLoginUserId()
  const res = await getRequest<NewsArticleDetail>(NEWS_API.ARTICLE, {
    params: { newsId, loginUserId },
  })
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
