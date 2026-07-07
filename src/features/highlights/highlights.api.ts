import type { Dispatch, SetStateAction } from "react"

import { clientGet } from "@/server/services/client-request"
import { getRequest } from "@/server/services/request"

import type {
  FetchVideoFeedParamsInterface,
  HighlightVideoInterface,
  InitialHighlightsDataInterface,
  VideoFeedResultInterface,
  VideoResultRawInterface,
} from "@/features/highlights/highlight.models"

import { FeedMenu, LATEST_VIDEO_PAGE_SIZE, VALID_MENUS } from "./highlights.constants"

// ─── Client-side social actions ──────────────────────────────────────────────

const SOCIAL_API = {
  FOLLOW: "/api/highlights/follow",
  LIKE: "/api/highlights/like",
} as const

async function toggleFollowAction(params: {
  userId: string | number
  setFollowMap: Dispatch<SetStateAction<Record<string, boolean>>>
  setVideos: Dispatch<SetStateAction<HighlightVideoInterface[]>>
  setFollowLoading: Dispatch<SetStateAction<boolean>>
  messageSuccess?: string
}): Promise<void> {
  const { userId, setFollowMap, setVideos, setFollowLoading, messageSuccess } = params
  const aid = String(userId)

  // Optimistic update
  setFollowMap((prev) => ({ ...prev, [aid]: true }))
  setFollowLoading(true)

  try {
    const url = `${SOCIAL_API.FOLLOW}?userId=${aid}&isFollow=true`
    const res = await clientGet<{ success: boolean }>(url)
    const ok = res.success && Boolean(res.data?.success)

    if (ok) {
      if (messageSuccess) {
        const { toast } = await import("@/components/ui/toast")
        toast.success(messageSuccess)
      }
      setVideos((prev) =>
        prev.map((v) => (String(v.authorId) === aid ? { ...v, hasFollow: true } : v))
      )
    } else {
      // Rollback
      setFollowMap((prev) => ({ ...prev, [aid]: false }))
    }
  } catch {
    // Rollback
    setFollowMap((prev) => ({ ...prev, [aid]: false }))
  } finally {
    setFollowLoading(false)
  }
}

async function toggleLikeAction(params: {
  newsId: string
  isLike: boolean
  wasLiked: boolean
  /** likeCount trước khi toggle — dùng để rollback chính xác */
  originalCount: number
  loginUserId?: string
  setLikedMap: Dispatch<SetStateAction<Record<string, boolean>>>
  setVideos: Dispatch<SetStateAction<HighlightVideoInterface[]>>
  setLikeLoading: Dispatch<SetStateAction<boolean>>
}): Promise<void> {
  const {
    newsId,
    isLike,
    wasLiked,
    originalCount,
    loginUserId,
    setLikedMap,
    setVideos,
    setLikeLoading,
  } = params

  setLikeLoading(true)

  // Optimistic: cập nhật cả liked state lẫn count cùng lúc để UI nhất quán
  setLikedMap((prev) => ({ ...prev, [newsId]: isLike }))
  setVideos((prev) =>
    prev.map((v) =>
      String(v.newsId ?? "") === newsId
        ? { ...v, isLike, likeCount: Math.max(0, originalCount + (isLike ? 1 : -1)) }
        : v
    )
  )

  const rollback = () => {
    setLikedMap((prev) => ({ ...prev, [newsId]: wasLiked }))
    setVideos((prev) =>
      prev.map((v) =>
        String(v.newsId ?? "") === newsId ? { ...v, isLike: wasLiked, likeCount: originalCount } : v
      )
    )
  }

  try {
    const url = `${SOCIAL_API.LIKE}?flag=1&typeId=${encodeURIComponent(newsId)}&isLike=${isLike}&loginUserId=${encodeURIComponent(loginUserId ?? "")}`
    const res = await clientGet<{ success: boolean }>(url)
    const ok = res.success && Boolean(res.data?.success)
    if (!ok) rollback()
  } catch {
    rollback()
  } finally {
    setLikeLoading(false)
  }
}

const VIDEO_API = {
  FEATURED: "/news/featured-by-game",
  POPULAR: "/news/get-popular-news-by-game",
  LATEST: (tabType: number, pageIndex: number) => `/v4/${tabType}/video/${pageIndex}`,
  GET_VIDEOS: "/api/highlights/videos",
} as const

async function fetchVideoFeed(
  params: FetchVideoFeedParamsInterface
): Promise<VideoFeedResultInterface> {
  const { status, page = 1, loginUserId = "" } = params
  const url = `${VIDEO_API.GET_VIDEOS}?menu=${status}&page=${page}&loginUserId=${encodeURIComponent(loginUserId)}`
  const res = await clientGet<VideoFeedResultInterface>(url)
  return { videos: res.data?.videos ?? [], hasMore: res.data?.hasMore ?? false }
}

function resolveInitialMenu(param: string | string[] | undefined): FeedMenu {
  const v = Array.isArray(param) ? param[0] : param
  return VALID_MENUS.includes(v ?? "") ? (v as FeedMenu) : FeedMenu.Featured
}

const EMPTY: InitialHighlightsDataInterface = { videos: [], hasMore: false }

async function fetchInitialHighlights(
  menu: FeedMenu = FeedMenu.Featured
): Promise<InitialHighlightsDataInterface> {
  switch (menu) {
    case FeedMenu.Featured: {
      const res = await getRequest<VideoResultRawInterface>(VIDEO_API.POPULAR, {
        params: { gameIds: "", loginUserId: "" },
      })
      return res.success ? { videos: res.data?.videos ?? [], hasMore: false } : EMPTY
    }

    case FeedMenu.Trending: {
      const res = await getRequest<VideoResultRawInterface>(VIDEO_API.FEATURED, {
        params: { gameIds: "", loginUserId: "" },
      })
      return res.success ? { videos: res.data?.videos ?? [], hasMore: false } : EMPTY
    }

    case FeedMenu.Latest: {
      const res = await getRequest<VideoResultRawInterface>(VIDEO_API.LATEST(0, 1), {
        params: { tabType: 0, type: "video", pageIndex: 1, loginUserId: "" },
      })
      if (!res.success) return EMPTY
      const records = res.data?.records ?? []
      return { videos: records, hasMore: records.length >= LATEST_VIDEO_PAGE_SIZE }
    }
  }
}

export type {
  FetchVideoFeedParamsInterface,
  HighlightVideoInterface,
  InitialHighlightsDataInterface,
  VideoFeedResultInterface,
} from "@/features/highlights/highlight.models"
export { FeedMenu } from "./highlights.constants"
export {
  fetchVideoFeed,
  fetchInitialHighlights,
  resolveInitialMenu,
  toggleFollowAction,
  toggleLikeAction,
}
