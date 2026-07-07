import type { Dispatch, SetStateAction } from "react"

import { clientGet } from "@/server/services/client-request"
import { followUser, getJavaErrorMessage, isJavaSuccess } from "@/lib/java-client"

import type {
  FetchVideoFeedParamsInterface,
  HighlightVideoInterface,
  VideoFeedResultInterface,
} from "@/features/highlights/highlight.models"

import { FeedMenu, VALID_MENUS } from "./highlights.constants"

// ─── Client-side social actions ──────────────────────────────────────────────

const SOCIAL_API = {
  LIKE: "/api/highlights/like",
} as const

function isRouteOk(res: { success: boolean; data: unknown }): boolean {
  if (!res.success || res.data == null) return false
  if (typeof res.data === "object" && res.data !== null && "success" in res.data) {
    return Boolean((res.data as { success: boolean }).success)
  }
  return true
}

async function toggleFollowAction(params: {
  userId: string | number
  setFollowMap: Dispatch<SetStateAction<Record<string, boolean>>>
  setVideos: Dispatch<SetStateAction<HighlightVideoInterface[]>>
  setFollowLoading: Dispatch<SetStateAction<boolean>>
  messageSuccess?: string
}): Promise<void> {
  const { userId, setFollowMap, setVideos, setFollowLoading, messageSuccess } = params
  const aid = String(userId)

  setFollowLoading(true)

  try {
    const res = await followUser({ isFollow: true, userId: aid })

    if (isJavaSuccess(res)) {
      if (messageSuccess) {
        const { toast } = await import("@/components/ui/toast")
        toast.success(messageSuccess)
      }
      setFollowMap((prev) => ({ ...prev, [aid]: true }))
      setVideos((prev) =>
        prev.map((v) => (String(v.authorId) === aid ? { ...v, hasFollow: true } : v))
      )
    } else {
      const errMsg = getJavaErrorMessage(res)
      if (errMsg) {
        const { toast } = await import("@/components/ui/toast")
        toast.error(errMsg)
      }
    }
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
  setLikedMap: Dispatch<SetStateAction<Record<string, boolean>>>
  setVideos: Dispatch<SetStateAction<HighlightVideoInterface[]>>
  setLikeLoading: Dispatch<SetStateAction<boolean>>
}): Promise<void> {
  const { newsId, isLike, wasLiked, originalCount, setLikedMap, setVideos, setLikeLoading } = params

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
    const url = `${SOCIAL_API.LIKE}?flag=1&typeId=${encodeURIComponent(newsId)}&isLike=${isLike}`
    const res = await clientGet<{ success: boolean }>(url)
    const ok = isRouteOk(res)
    if (!ok) rollback()
  } catch {
    rollback()
  } finally {
    setLikeLoading(false)
  }
}

const VIDEO_API = {
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

export type {
  FetchVideoFeedParamsInterface,
  HighlightVideoInterface,
  InitialHighlightsDataInterface,
  VideoFeedResultInterface,
} from "@/features/highlights/highlight.models"
export { FeedMenu } from "./highlights.constants"
export { fetchVideoFeed, resolveInitialMenu, toggleFollowAction, toggleLikeAction }
