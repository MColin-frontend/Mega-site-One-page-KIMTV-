import "server-only"

import { getRequest } from "@/server/services/request"
import { getServerLoginUserId } from "@/lib/auth-server"

import type {
  InitialHighlightsDataInterface,
  VideoResultRawInterface,
} from "@/features/highlights/highlight.models"

import { FeedMenu, LATEST_VIDEO_PAGE_SIZE } from "./highlights.constants"

const VIDEO_API = {
  FEATURED: "/news/featured-by-game",
  POPULAR: "/news/get-popular-news-by-game",
  LATEST: (tabType: number, pageIndex: number) => `/v4/${tabType}/video/${pageIndex}`,
} as const

const EMPTY: InitialHighlightsDataInterface = { videos: [], hasMore: false }

async function fetchInitialHighlights(
  menu: FeedMenu = FeedMenu.Featured
): Promise<InitialHighlightsDataInterface> {
  const loginUserId = await getServerLoginUserId()

  switch (menu) {
    case FeedMenu.Featured: {
      const res = await getRequest<VideoResultRawInterface>(VIDEO_API.POPULAR, {
        params: { gameIds: "", loginUserId },
      })
      return res.success ? { videos: res.data?.videos ?? [], hasMore: false } : EMPTY
    }

    case FeedMenu.Trending: {
      const res = await getRequest<VideoResultRawInterface>(VIDEO_API.FEATURED, {
        params: { gameIds: "", loginUserId },
      })
      return res.success ? { videos: res.data?.videos ?? [], hasMore: false } : EMPTY
    }

    case FeedMenu.Latest: {
      const res = await getRequest<VideoResultRawInterface>(VIDEO_API.LATEST(0, 1), {
        params: { tabType: 0, type: "video", pageIndex: 1, loginUserId },
      })
      if (!res.success) return EMPTY
      const records = res.data?.records ?? []
      return { videos: records, hasMore: records.length >= LATEST_VIDEO_PAGE_SIZE }
    }
  }
}

export { fetchInitialHighlights }
