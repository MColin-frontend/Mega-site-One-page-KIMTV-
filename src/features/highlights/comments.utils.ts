import type { CommentItem, ReplyItem } from "./highlight.models"
import { PAGE_SIZE_COMMENT } from "./highlights.constants"

export { PAGE_SIZE_COMMENT as PAGE_SIZE_COMMENT_DEFAULT }

/**
 * Normalise the isLike field from the Java API.
 * The backend can return boolean, 1/0, "1"/"0", or "true"/"false".
 * String "0" is truthy in JS, so an explicit check is required (mirrors
 * KIMTV-PC's `articleIsLiked` computed property).
 */
export function resolveIsLiked(v: unknown): boolean {
  return v === true || v === 1 || v === "1" || v === "true"
}

export function normalizeCommentList(list: unknown[]): CommentItem[] {
  return (Array.isArray(list) ? list : [])
    .filter((c: unknown) => {
      const item = c as Record<string, unknown>
      return item && item.ncid != null && !item.isDeleted
    })
    .map((c: unknown) => {
      const item = c as Record<string, unknown>
      return {
        ...item,
        ncid: item.ncid as string | number,
        isLike: resolveIsLiked(item.isLike),
        children: Array.isArray(item.children)
          ? (item.children as unknown[])
              .filter((r: unknown) => {
                const reply = r as Record<string, unknown>
                return reply && reply.ncid != null && !reply.isDeleted
              })
              .map((r: unknown) => {
                const reply = r as Record<string, unknown>
                return { ...reply, isLike: resolveIsLiked(reply.isLike) } as ReplyItem
              })
          : [],
      } as CommentItem
    })
}

// ---------------------------------------------------------------------------
// Resolve the new comment ID from the POST response.
// The Java backend can return the ID in many shapes; try them all.
// ---------------------------------------------------------------------------
export function resolvePostedCommentId(result: unknown): number | null {
  if (result == null || result === "") return null

  if (typeof result === "number" && Number.isFinite(result) && result > 0) {
    return Math.floor(result)
  }

  if (typeof result === "string") {
    const trimmed = result.trim()
    if (/^\d+$/.test(trimmed)) return Number(trimmed)
    try {
      return resolvePostedCommentId(JSON.parse(trimmed))
    } catch {
      return null
    }
  }

  if (typeof result === "object" && !Array.isArray(result)) {
    const r = result as Record<string, unknown>
    const d = r.data as Record<string, unknown> | null | undefined
    const comment = r.comment as Record<string, unknown> | null | undefined
    const vo = r.vo as Record<string, unknown> | null | undefined

    const candidates: unknown[] = [
      r.ncid,
      r.commentId,
      r.id,
      r.typeId,
      r.commentNewsId,
      r.newsCommentId,
      r.data,
      d?.ncid,
      d?.commentId,
      d?.id,
      comment?.ncid,
      comment?.commentId,
      comment?.id,
      vo?.ncid,
      vo?.commentId,
      vo?.id,
      r.result,
    ]

    for (const raw of candidates) {
      const nested = resolvePostedCommentId(raw)
      if (nested) return nested
      const id = Number(raw)
      if (Number.isFinite(id) && id > 0) return id
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Strip HTML tags and normalise whitespace for content matching.
// ---------------------------------------------------------------------------
export function stripCommentContent(content: unknown): string {
  return String(content ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

// ---------------------------------------------------------------------------
// Pending-placeholder helpers
// ---------------------------------------------------------------------------

export function createPendingKey(): string {
  return `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function buildPendingPlaceholder(opts: {
  clientKey: string
  content: string
  replyUserName?: string
  userName?: string
  avatar?: string
}): ReplyItem {
  return {
    ncid: opts.clientKey,
    content: opts.content,
    _pending: true,
    _clientKey: opts.clientKey,
    userName: opts.userName ?? "",
    avatar: opts.avatar ?? "",
    replyUserName: opts.replyUserName ?? "",
    children: [],
    publishTime: Math.floor(Date.now() / 1000),
    likeCount: 0,
    isLike: false,
  }
}

export function removePendingByKey(comments: CommentItem[], clientKey: string): CommentItem[] {
  return comments
    .filter((c) => c._clientKey !== clientKey)
    .map((c) => {
      if (!c.children?.length) return c
      const children = c.children.filter((r) => r._clientKey !== clientKey)
      if (children.length === c.children.length) return c
      return { ...c, children }
    })
}

export function replacePendingWithRecord(
  comments: CommentItem[],
  clientKey: string,
  record: ReplyItem,
  parentNcid?: number
): { comments: CommentItem[]; replaced: boolean } {
  let replaced = false

  if (parentNcid) {
    const next = comments.map((c) => {
      if (Number(c.ncid) !== parentNcid) return c
      const children = (c.children ?? []).map((child) => {
        if (child._clientKey !== clientKey) return child
        replaced = true
        return { ...record, children: [] }
      })
      return { ...c, children }
    })
    return { comments: next, replaced }
  }

  const next = comments.map((c) => {
    if (c._clientKey !== clientKey) return c
    replaced = true
    return {
      ...record,
      children: Array.isArray(record.children) ? record.children : [],
    } as CommentItem
  })
  return { comments: next, replaced }
}

// ---------------------------------------------------------------------------
// Record-finding helpers (used during hydration)
// ---------------------------------------------------------------------------

function toCommentTimestamp(record: ReplyItem): number {
  const n = Number(record?.publishTime) || 0
  if (!n) return 0
  return n < 1e12 ? n : Math.floor(n / 1000)
}

function isRecentPostedComment(record: ReplyItem, maxAgeSec = 180): boolean {
  const ts = toCommentTimestamp(record)
  if (!ts) return true
  return Math.floor(Date.now() / 1000) - ts <= maxAgeSec
}

export function collectKnownCommentIds(comments: CommentItem[]): Set<number> {
  const ids = new Set<number>()
  const walk = (items: ReplyItem[]) => {
    for (const item of items) {
      if (item && item.ncid != null && !item._pending) {
        ids.add(Number(item.ncid))
      }
      if (Array.isArray((item as CommentItem).children)) {
        walk((item as CommentItem).children ?? [])
      }
    }
  }
  walk(comments)
  return ids
}

export function pickPostedCommentRecord(
  list: ReplyItem[],
  content: string,
  postedId: number | null,
  knownIds: Set<number>,
  loginUserId: string
): ReplyItem | null {
  if (!list.length) return null
  const normalizedContent = stripCommentContent(content)

  if (postedId) {
    return list.find((r) => Number(r.ncid) === postedId) ?? null
  }

  const candidates = list.filter(
    (r) =>
      String(r.userSourceId) === loginUserId &&
      stripCommentContent(String(r.content ?? "")) === normalizedContent
  )
  if (!candidates.length) return null
  if (candidates.length === 1) return candidates[0]

  const fresh = candidates.filter((r) => r.ncid != null && !knownIds.has(Number(r.ncid)))
  const pool = fresh.length ? fresh : candidates.filter((r) => isRecentPostedComment(r))
  if (!pool.length) return null

  return pool.reduce<ReplyItem | null>((best, r) => {
    if (!best) return r
    return toCommentTimestamp(r) >= toCommentTimestamp(best) ? r : best
  }, null)
}
