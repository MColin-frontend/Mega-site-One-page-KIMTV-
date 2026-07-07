import type { Dispatch, SetStateAction } from "react"

import { clientDelete, clientGet, clientPost } from "@/server/services/client-request"

import {
  buildPendingPlaceholder,
  collectKnownCommentIds,
  createPendingKey,
  normalizeCommentList,
  pickPostedCommentRecord,
  removePendingByKey,
  replacePendingWithRecord,
  resolvePostedCommentId,
} from "./comments.utils"
import type {
  CommentItem,
  CommentListResultInterface,
  CommentParamsState,
  CommentRecordInterface,
  FetchCommentsParamsInterface,
  PostCommentPayloadInterface,
  PostCtx,
  ReplyItem,
} from "./highlight.models"
import { PAGE_SIZE_COMMENT } from "./highlights.constants"

const COMMENT_ROUTES = {
  LIST: "/api/highlights/comments",
  COMMENT: "/api/highlights/comment",
  LIKE: "/api/highlights/comment-like",
  DELETE: "/api/highlights/remove-comment",
} as const

export type {
  CommentRecordInterface,
  CommentListResultInterface,
  PostCommentPayloadInterface,
  PostCtx,
  FetchCommentsParamsInterface,
}

export { PAGE_SIZE_COMMENT as PAGE_SIZE_COMMENT_DEFAULT }
export { normalizeCommentList }

async function fetchComments(params: FetchCommentsParamsInterface) {
  const {
    newsId,
    page,
    loginUserId,
    commentType,
    pageSize = PAGE_SIZE_COMMENT,
    setComments,
    setParams,
  } = params
  const url = `${COMMENT_ROUTES.LIST}?newsId=${newsId}&pageIndex=${page}&loginUserId=${encodeURIComponent(loginUserId)}&pageSize=${pageSize}&commentType=${commentType}`
  await clientGet<CommentListResultInterface>(url)
    .then((res) => {
      const list = normalizeCommentList(res.data?.records || [])
      if (page === 0) {
        setComments((prev) => {
          const pending = prev.filter((c) => c._pending)
          return pending.length ? [...list, ...pending] : list
        })
      } else {
        setComments((prev) => {
          const existingIds = new Set(prev.map((c) => Number(c.ncid)))
          const fresh = list.filter((c) => !existingIds.has(Number(c.ncid)))
          return fresh.length ? [...prev, ...fresh] : prev
        })
      }
      setParams((s) => ({
        ...s,
        total: res.data?.total || 0,
      }))
    })
    .finally(() => {
      setParams((s) => ({
        ...s,
        isLoading: false,
        isLoadingMore: false,
      }))
    })
}

// ---------------------------------------------------------------------------
// postComment — optimistic pending placeholder, then hydrate with real record
// ---------------------------------------------------------------------------

async function postComment(params: {
  payload: PostCommentPayloadInterface
  loginUserId: string
  userProfile: { userName?: string; avatar?: string }
  total: number
  setComments: Dispatch<SetStateAction<CommentItem[]>>
  setParams: Dispatch<SetStateAction<CommentParamsState>>
  onCountChange?: (count: number) => void
  messageSuccess?: string
  messageError?: string
  /** ncid of the parent comment when posting a reply */
  parentNcid?: number
  /** display name of the comment being replied to */
  replyUserName?: string
}): Promise<boolean> {
  const {
    payload,
    loginUserId,
    userProfile,
    total,
    setComments,
    setParams,
    onCountChange,
    messageSuccess,
    parentNcid,
    replyUserName,
  } = params

  const content = payload.content
  const clientKey = createPendingKey()
  const placeholder = buildPendingPlaceholder({
    clientKey,
    content,
    replyUserName,
    userName: userProfile.userName,
    avatar: userProfile.avatar,
  })

  // Collect known IDs before staging so hydration can detect the new record
  let knownIds = new Set<number>()
  setComments((prev) => {
    knownIds = collectKnownCommentIds(prev)
    return prev
  })

  // Stage pending placeholder
  if (parentNcid) {
    setComments((prev) =>
      prev.map((c) =>
        Number(c.ncid) === parentNcid ? { ...c, children: [...(c.children ?? []), placeholder] } : c
      )
    )
  } else {
    setComments((prev) => [...prev, placeholder])
  }

  // Optimistic count increment
  setParams((s) => ({ ...s, total: s.total + 1 }))
  onCountChange?.(total + 1)

  try {
    const res = await clientPost<{ success: boolean; data: unknown }>(
      COMMENT_ROUTES.COMMENT,
      payload,
      { messageSuccess }
    )

    const apiOk = res.success && (res.data as { success?: boolean } | null)?.success !== false

    if (!apiOk) {
      rollback()
      return false
    }

    // Try to hydrate the pending placeholder with the real server record
    const postedId = resolvePostedCommentId((res.data as Record<string, unknown> | null)?.data)

    const tryHydrate = async (): Promise<boolean> => {
      const listRes = await clientGet<CommentListResultInterface>(
        `${COMMENT_ROUTES.LIST}?newsId=${payload.mainNewsId}&pageIndex=0&loginUserId=${encodeURIComponent(loginUserId)}&pageSize=${PAGE_SIZE_COMMENT}&commentType=${payload.commentType}`
      )
      if (!listRes.success) return false

      const list = normalizeCommentList(listRes.data?.records || [])

      let record: ReplyItem | null = null
      if (parentNcid) {
        const parent = list.find((c) => Number(c.ncid) === parentNcid)
        record = pickPostedCommentRecord(
          parent?.children ?? [],
          content,
          postedId,
          knownIds,
          loginUserId
        )
      } else {
        record = pickPostedCommentRecord(list, content, postedId, knownIds, loginUserId)
      }

      if (!record?.ncid) return false

      const finalRecord = record
      setComments((prev) => {
        const { comments: next, replaced } = replacePendingWithRecord(
          prev,
          clientKey,
          finalRecord,
          parentNcid
        )
        return replaced ? next : prev
      })
      return true
    }

    let hydrated = await tryHydrate()
    if (!hydrated) {
      // Server may need a moment to persist the record; retry once
      await new Promise<void>((r) => setTimeout(r, 600))
      hydrated = await tryHydrate()
    }

    if (!hydrated) {
      // Fallback: remove the pending item (list stays server-consistent from next fetch)
      setComments((prev) => removePendingByKey(prev, clientKey))
    }

    return true
  } catch {
    rollback()
    return false
  }

  function rollback() {
    setComments((prev) => removePendingByKey(prev, clientKey))
    setParams((s) => ({ ...s, total: Math.max(0, s.total - 1) }))
    onCountChange?.(Math.max(0, total))
  }
}

// ---------------------------------------------------------------------------

async function likeComment(params: {
  commentId: string | number
  isLike: boolean
  loginUserId: string
}): Promise<boolean> {
  const res = await clientPost<{ success: boolean }>(COMMENT_ROUTES.LIKE, params)
  return res.success && Boolean(res.data?.success)
}

async function deleteComment(params: {
  commentId: string | number
  loginUserId: string
  total: number
  setComments: Dispatch<SetStateAction<CommentItem[]>>
  setParams: Dispatch<SetStateAction<CommentParamsState>>
  onCountChange?: (count: number) => void
  messageSuccess?: string
  messageError?: string
}) {
  const {
    commentId,
    loginUserId,
    total,
    setComments,
    setParams,
    onCountChange,
    messageSuccess,
    messageError,
  } = params

  // Optimistic: remove immediately, rollback if API fails
  let removed: CommentItem[] | null = null
  setComments((prev) => {
    removed = prev
    return prev
      .filter((c) => Number(c.ncid) !== Number(commentId))
      .map((c) => ({
        ...c,
        children: (c.children ?? []).filter((r) => Number(r.ncid) !== Number(commentId)),
      }))
  })
  setParams((s) => ({ ...s, total: Math.max(0, s.total - 1) }))
  onCountChange?.(total - 1)

  const url = `${COMMENT_ROUTES.DELETE}?commentId=${commentId}&loginUserId=${encodeURIComponent(loginUserId)}`

  const res = await clientDelete<{ success: boolean }>(url, {
    messageSuccess,
    messageError,
  })

  if (!(res.success && Boolean(res.data?.success))) {
    // Rollback
    if (removed !== null) setComments(removed)
    setParams((s) => ({ ...s, total: s.total + 1 }))
    onCountChange?.(total)
  }
}

export { fetchComments, postComment, likeComment, deleteComment }
