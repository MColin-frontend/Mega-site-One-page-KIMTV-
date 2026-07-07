import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

import type { VideoResultRawInterface } from "@/features/highlights/highlight.models"
import {
  FeedMenu,
  LATEST_VIDEO_PAGE_SIZE,
  NEWS_TAB_MAP,
  TRENDING_WINDOW_MS,
  VIDEO_NEWS_TYPE,
} from "@/features/highlights/highlights.constants"

// ─── Hot context — chỉ dùng cho FeedMenu.Latest (cần flagIndex) ───────────────

async function getLatestVideoContext(): Promise<{ flagIndex: number }> {
  try {
    const res = await getRequest<number[]>("/get-news-tab")
    if (!res.success || !Array.isArray(res.data)) return { flagIndex: 0 }

    const tabs = res.data
      .map((idx) => NEWS_TAB_MAP[idx])
      .filter(Boolean)
      .filter((t) => t.abbr !== "basketball" && t.gameId !== 201)

    const hotTab = tabs.find((t) => t.abbr === "hot") ?? tabs[0]
    return { flagIndex: hotTab?.index ?? 0 }
  } catch {
    return { flagIndex: 0 }
  }
}

// ─── Filter helpers ────────────────────────────────────────────────────────────

type RawVideo = Record<string, unknown>

function toVideoTimestamp(value: unknown): number {
  const numeric = Number(value)
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric > 1e11 ? numeric : numeric * 1000
  }
  const parsed = new Date(String(value ?? "")).getTime()
  return Number.isFinite(parsed) ? parsed : 0
}

function isVideoPinned(item: RawVideo): boolean {
  const v = item.isTop
  return v === true || v === 1 || v === "1" || v === "true"
}

function isVideoItem(item: RawVideo): boolean {
  if (!item) return false
  const ct = String((item.type ?? item.contentType ?? "") as string).toLowerCase()
  if (ct === "news" || ct === "new" || ct === "article") return false
  if (ct === "video") return true
  const newsType = Number(item.newsType)
  if (Number.isFinite(newsType) && newsType > 0) return newsType === VIDEO_NEWS_TYPE
  return Boolean(item.videoUrl || item.playUrl || item.videoKey || item.durationMillis)
}

/** Featured (Xu hướng) — get-popular-news-by-game, 30 ngày, commentCount DESC */
function filterFeaturedVideos(videos: RawVideo[]): RawVideo[] {
  const cutoff = Date.now() - TRENDING_WINDOW_MS
  return videos
    .filter(isVideoItem)
    .filter((item) => toVideoTimestamp(item.publishTime) >= cutoff)
    .sort((a, b) => (Number(b.commentCount) || 0) - (Number(a.commentCount) || 0))
}

/** Trending (Nổi bật) — featured-by-game, admin ghim, topTime DESC */
function filterTrendingVideos(videos: RawVideo[]): RawVideo[] {
  return videos.filter(isVideoItem).sort((a, b) => {
    const topDiff = (Number(b.topTime) || 0) - (Number(a.topTime) || 0)
    if (topDiff) return topDiff
    return toVideoTimestamp(b.publishTime) - toVideoTimestamp(a.publishTime)
  })
}

/** Latest (Mới nhất) — v4/0/video/{page}, publishTime DESC, loại pinned */
function filterLatestVideos(records: RawVideo[]): RawVideo[] {
  return records
    .filter(isVideoItem)
    .filter((item) => !isVideoPinned(item))
    .sort((a, b) => toVideoTimestamp(b.publishTime) - toVideoTimestamp(a.publishTime))
}

// ─── Route ────────────────────────────────────────────────────────────────────

/**
 * GET /api/highlights/videos?menu=featured|latest|trending&page=1&loginUserId=
 *
 * Menu mapping (KIMTV-PC hot.vue):
 *   featured → get-popular-news-by-game (Xu hướng: 30 ngày, commentCount DESC)
 *   trending → featured-by-game         (Nổi bật: admin ghim, topTime DESC)
 *   latest   → v4/{tabType}/video/{page} (Mới nhất: publishTime DESC)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const menuParam = searchParams.get("menu") ?? FeedMenu.Featured
  const menu = Object.values(FeedMenu).includes(menuParam as FeedMenu)
    ? (menuParam as FeedMenu)
    : FeedMenu.Featured
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const loginUserId = searchParams.get("loginUserId") ?? ""

  switch (menu) {
    case FeedMenu.Featured: {
      const res = await getRequest<VideoResultRawInterface>("/news/get-popular-news-by-game", {
        params: { gameIds: "", loginUserId: loginUserId || "" },
      })
      const rawVideos = (res.data?.videos ?? []) as unknown as RawVideo[]
      return NextResponse.json({ videos: filterFeaturedVideos(rawVideos), hasMore: false })
    }

    case FeedMenu.Trending: {
      const res = await getRequest<VideoResultRawInterface>("/news/featured-by-game", {
        params: { gameIds: "", loginUserId: loginUserId || "" },
      })
      const rawVideos = (res.data?.videos ?? []) as unknown as RawVideo[]
      return NextResponse.json({ videos: filterTrendingVideos(rawVideos), hasMore: false })
    }

    case FeedMenu.Latest: {
      const { flagIndex } = await getLatestVideoContext()
      const res = await getRequest<VideoResultRawInterface>(
        ((t, p) => `/v4/${t}/video/${p}`)(flagIndex, page),
        {
          params: {
            tabType: flagIndex,
            type: "video",
            pageIndex: page,
            loginUserId: loginUserId || "",
          },
        }
      )
      const rawRecords = (res.data?.records ?? []) as unknown as RawVideo[]
      const hasMore = rawRecords.length >= LATEST_VIDEO_PAGE_SIZE
      return NextResponse.json({ videos: filterLatestVideos(rawRecords), hasMore })
    }
  }
}
