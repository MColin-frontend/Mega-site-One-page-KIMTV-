"use client"

import { useCallback, useEffect, useState } from "react"
import { Heart, MessageCircle } from "lucide-react"

import { clientDelete, clientGet, clientPost } from "@/lib/client-request"
import { formatPublishTime } from "@/lib/date"
import { useAuth } from "@/hooks/use-auth"

import { useTranslation } from "@/i18n"
import type { NewsComment } from "@/models/home.models"

import { NEWS_ROUTES } from "@/features/news/news.api"
import { EmptyState } from "@/components/ui/empty-state"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import { NEWS_PANEL_STYLE } from "../shared"

/* ─── CommentComposeInput ─────────────────────────────────── */

const MAX_LENGTH = 500

interface CommentComposeInputPropsInterface {
  placeholder?: string
  submitLabel?: string
  loading?: boolean
  onSubmit: (text: string) => void
}

function CommentComposeInput({
  placeholder = "",
  submitLabel = "Đăng",
  loading = false,
  onSubmit,
}: CommentComposeInputPropsInterface) {
  const [value, setValue] = useState("")

  const trimmed = value.trim()

  function handleSubmit() {
    if (!trimmed || loading) return
    onSubmit(trimmed)
    setValue("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-0 py-0.5 transition-colors focus-within:border-[rgba(255,210,32,0.35)] focus-within:bg-white/10">
      <input
        type="text"
        value={value}
        maxLength={MAX_LENGTH}
        placeholder={placeholder}
        disabled={loading}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
        onKeyDown={handleKeyDown}
        className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-[13px] text-white outline-none placeholder:text-white/40 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        disabled={!trimmed || loading}
        onClick={handleSubmit}
        className="font-700 mr-0.5 flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#ffd220] px-3 text-[12px] text-[#0a1128] transition-colors hover:bg-[#ffe04d] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? (
          <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-[#0a1128]/20 border-t-[#0a1128]/70" />
        ) : (
          submitLabel
        )}
      </button>
    </div>
  )
}

const DEFAULT_AVATAR = "/images/common/img-avatar-default.png"
const PAGE_SIZE = 100

/* ─── utils (ported từ KIMTV-PC/plugins/utils.js) ────────── */

function resolvePostedCommentId(result: unknown): number | null {
  if (result == null || result === "") return null
  if (typeof result === "number" && Number.isFinite(result) && result > 0) return Math.floor(result)
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
    const obj = result as Record<string, unknown>
    const candidates = [
      obj.ncid,
      obj.commentId,
      obj.id,
      obj.typeId,
      obj.commentNewsId,
      obj.newsCommentId,
      obj.data,
    ]
    for (const raw of candidates) {
      if (raw == null) continue
      const nested = resolvePostedCommentId(raw)
      if (nested) return nested
      const id = Number(raw)
      if (Number.isFinite(id) && id > 0) return id
    }
  }
  return null
}

function stripContent(content: string): string {
  return content
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function toTimestamp(item: NewsComment): number {
  const n = Number(item.publishTime ?? 0)
  if (!n) return 0
  return n < 1e12 ? n : Math.floor(n / 1000)
}

function isRecent(item: NewsComment, maxSec = 180): boolean {
  const ts = toTimestamp(item)
  if (!ts) return true
  return Math.floor(Date.now() / 1000) - ts <= maxSec
}

/* ─── normalizer ──────────────────────────────────────────── */

function normalizeList(raw: unknown): NewsComment[] {
  if (!Array.isArray(raw)) return []
  return (raw as NewsComment[])
    .filter((c) => c && c.ncid != null && !(c as unknown as Record<string, unknown>).isDeleted)
    .map((c) => ({
      ...c,
      children: Array.isArray(c.children) ? c.children.filter((r) => r && r.ncid != null) : [],
    }))
}

function ncidNum(id: string | number | undefined) {
  return Number(id ?? 0)
}

function genKey() {
  return `pk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/* ─── pick newly posted comment from refreshed list ──────── */

function pickPostedRecord(
  list: NewsComment[],
  content: string,
  postedId: number | null,
  knownIds: Set<number>,
  loginUserId: string
): NewsComment | null {
  if (!list.length) return null
  const normalizedContent = stripContent(content)

  if (postedId) {
    return list.find((r) => ncidNum(r.ncid) === postedId) ?? null
  }

  const isOwn = (r: NewsComment) => (loginUserId ? String(r.userSourceId) === loginUserId : false)

  const candidates = list.filter((r) => isOwn(r) && stripContent(r.content) === normalizedContent)
  if (!candidates.length) return null
  if (candidates.length === 1) return candidates[0]

  const fresh = candidates.filter((r) => !knownIds.has(ncidNum(r.ncid)))
  const pool = fresh.length ? fresh : candidates.filter(isRecent)
  if (!pool.length) return null

  return pool.reduce((best, r) => (toTimestamp(r) >= toTimestamp(best) ? r : best))
}

/* ─── skeleton ────────────────────────────────────────────── */

function SkeletonRow({ small = false }: { small?: boolean }) {
  return (
    <div className="flex gap-2.5 border-t border-white/[0.06] py-3">
      <div
        className={`shrink-0 animate-pulse rounded-full bg-white/[0.08] ${small ? "size-7" : "size-9"}`}
      />
      <div className="flex flex-1 flex-col gap-2 pt-0.5">
        <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/[0.08]" />
        <div className="h-3 w-full animate-pulse rounded-full bg-white/[0.08]" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/[0.08]" />
        <div className="mt-1 h-2.5 w-28 animate-pulse rounded-full bg-white/[0.08]" />
      </div>
    </div>
  )
}

function Avatar({ src, alt }: { src?: string; alt: string }) {
  return (
    <Img
      src={src ?? DEFAULT_AVATAR}
      fallback={DEFAULT_AVATAR}
      alt={alt}
      className="size-9 shrink-0 rounded-full object-cover"
    />
  )
}

function AvatarSm({ src, alt }: { src?: string; alt: string }) {
  return (
    <Img
      src={src ?? DEFAULT_AVATAR}
      fallback={DEFAULT_AVATAR}
      alt={alt}
      className="size-7 shrink-0 rounded-full object-cover"
    />
  )
}

/* ─── main component ──────────────────────────────────────── */

interface CommentSectionProps {
  newsId: string | number
  newsType?: number
  initialCount?: number
}

export function CommentSection({ newsId, newsType = 1, initialCount = 0 }: CommentSectionProps) {
  const { t } = useTranslation()
  const { user, isLoggedIn, isLoading: authLoading, login } = useAuth()

  const [comments, setComments] = useState<NewsComment[]>([])
  const [total, setTotal] = useState(initialCount)
  const [, setPageIndex] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [replyParent, setReplyParent] = useState<NewsComment | null>(null)
  const [replyTo, setReplyTo] = useState<NewsComment | null>(null)
  const [replySubmitting, setReplySubmitting] = useState(false)
  const [likeBusy, setLikeBusy] = useState<Record<string, boolean>>({})

  const loginUserId = user?.userId ? String(user.userId) : ""

  /* ─── fetch helpers ─── */

  async function fetchPage(page: number): Promise<NewsComment[]> {
    const qs = new URLSearchParams({
      newsId: String(newsId),
      pageIndex: String(page),
      pageSize: String(PAGE_SIZE),
      commentType: String(newsType),
    })
    const json = await clientGet<{ success: boolean; data: unknown }>(
      `${NEWS_ROUTES.COMMENTS}?${qs}`
    )
    return normalizeList(json?.data)
  }

  const fetchComments = useCallback(
    async (reset: boolean) => {
      if (reset) {
        setLoading(true)
        setComments([])
        setHasMore(false)
        setPageIndex(0)
      } else {
        setLoadingMore(true)
      }

      try {
        // pageIndex is read via functional update below — avoids stale closure
        const page = reset
          ? 0
          : await new Promise<number>((r) =>
              setPageIndex((p) => {
                r(p)
                return p
              })
            )
        const list = await fetchPage(page)

        if (reset) {
          setComments(list)
          setPageIndex(1)
        } else {
          setComments((prev) => [...prev, ...list])
          setPageIndex((p) => p + 1)
        }
        setHasMore(list.length >= PAGE_SIZE)
      } catch {
        setHasMore(false)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newsId, newsType]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchComments(true)
  }, [fetchComments])

  /* ─── collect known IDs (for hydration dedup) ─── */

  function collectKnownIds(): Set<number> {
    const ids = new Set<number>()
    const walk = (items: NewsComment[]) => {
      for (const c of items) {
        if (!c._pending && c.ncid != null) ids.add(ncidNum(c.ncid))
        walk(c.children ?? [])
      }
    }
    walk(comments)
    return ids
  }

  /* ─── optimistic helpers ─── */

  function buildPending(content: string, replyUserName = ""): NewsComment {
    return {
      ncid: genKey(),
      content,
      userName: user?.name ?? "",
      avatar: user?.avatar as string | undefined,
      replyUserName,
      children: [],
      _pending: true,
      _clientKey: genKey(),
    }
  }

  function removePending(clientKey: string) {
    setComments((prev) =>
      prev
        .filter((c) => c._clientKey !== clientKey)
        .map((c) => ({
          ...c,
          children: (c.children ?? []).filter((r) => r._clientKey !== clientKey),
        }))
    )
  }

  function replacePending(clientKey: string, record: NewsComment, parentNcid?: number): boolean {
    let replaced = false
    setComments((prev) => {
      if (parentNcid) {
        return prev.map((c) => {
          if (ncidNum(c.ncid) !== parentNcid) return c
          const children = (c.children ?? []).map((r) => {
            if (r._clientKey !== clientKey) return r
            replaced = true
            return { ...record, children: [] }
          })
          return { ...c, children }
        })
      }
      return prev.map((c) => {
        if (c._clientKey !== clientKey) return c
        replaced = true
        return { ...record, children: Array.isArray(record.children) ? record.children : [] }
      })
    })
    return replaced
  }

  /* ─── hydrate pending after post ─── */

  async function hydratePending(
    clientKey: string,
    content: string,
    postResult: unknown,
    parentNcid?: number,
    replyUserName?: string
  ) {
    const postedId = resolvePostedCommentId(postResult)
    const knownIds = collectKnownIds()

    const findRecord = async (): Promise<NewsComment | null> => {
      const freshList = await fetchPage(0)
      const pool = parentNcid
        ? (freshList.find((c) => ncidNum(c.ncid) === parentNcid)?.children ?? [])
        : freshList
      return pickPostedRecord(pool, content, postedId, knownIds, loginUserId)
    }

    let record = await findRecord()
    if (!record) {
      await new Promise((r) => setTimeout(r, 500))
      record = await findRecord()
    }

    if (record) {
      replacePending(clientKey, record, parentNcid)
    } else {
      // fallback: build a local record from whatever the API returned
      const localRecord: NewsComment = {
        ncid: postedId ?? (Date.now() as number),
        content,
        userName: user?.name ?? "",
        avatar: user?.avatar as string | undefined,
        publishTime: Math.floor(Date.now() / 1000),
        likeCount: 0,
        isLike: false,
        userSourceId: loginUserId,
        replyUserName: replyUserName ?? "",
        children: [],
      }
      replacePending(clientKey, localRecord, parentNcid)
    }
  }

  function rollback(clientKey: string) {
    removePending(clientKey)
    setTotal((n) => Math.max(0, n - 1))
  }

  /* ─── submit top-level comment ─── */

  async function submitComment(content: string) {
    if (!content || submitting || !loginUserId) return

    const pending = buildPending(content)
    const clientKey = pending._clientKey!

    setComments((prev) => [...prev, pending])
    setTotal((n) => n + 1)
    setSubmitting(true)

    try {
      const json = await clientPost<{ success: boolean; data: unknown }>(NEWS_ROUTES.COMMENTS, {
        commentType: newsType,
        content,
        mainNewsId: Number(newsId),
        topFloorId: 0,
      })

      if (json?.success) {
        await hydratePending(clientKey, content, json.data)
      } else {
        rollback(clientKey)
      }
    } catch {
      rollback(clientKey)
    } finally {
      setSubmitting(false)
    }
  }

  /* ─── submit reply ─── */

  async function submitReply(content: string) {
    if (!content || replySubmitting || !replyParent || !replyTo || !loginUserId) return

    const parentNcid = ncidNum(replyParent.ncid)
    const replyUserName = replyTo.userName ?? ""
    const pending = buildPending(content, replyUserName)
    const clientKey = pending._clientKey!

    setComments((prev) =>
      prev.map((c) =>
        ncidNum(c.ncid) === parentNcid ? { ...c, children: [...(c.children ?? []), pending] } : c
      )
    )
    setTotal((n) => n + 1)
    setReplySubmitting(true)

    try {
      const json = await clientPost<{ success: boolean; data: unknown }>(NEWS_ROUTES.COMMENTS, {
        commentType: newsType,
        content,
        mainNewsId: Number(newsId),
        topFloorId: parentNcid,
        replyToCommentId: ncidNum(replyTo.ncid),
        replyToUserSourceId: replyTo.userSourceId,
      })

      if (json?.success) {
        await hydratePending(clientKey, content, json.data, parentNcid, replyUserName)
      } else {
        rollback(clientKey)
      }
    } catch {
      rollback(clientKey)
    } finally {
      setReplySubmitting(false)
      setReplyParent(null)
      setReplyTo(null)
    }
  }

  /* ─── delete ─── */

  async function deleteComment(item: NewsComment) {
    if (!item.ncid) return
    try {
      const qs = new URLSearchParams({ commentId: String(item.ncid) })
      const json = await clientDelete<{ success: boolean }>(`${NEWS_ROUTES.COMMENTS}?${qs}`)
      if (json?.success) {
        setTotal((n) => Math.max(0, n - 1))
        const id = ncidNum(item.ncid)
        setComments((prev) => {
          let removed = false
          const next = prev.map((c) => {
            const filtered = (c.children ?? []).filter((r) => ncidNum(r.ncid) !== id)
            if (filtered.length !== (c.children ?? []).length) {
              removed = true
              return { ...c, children: filtered }
            }
            return c
          })
          return removed ? next : next.filter((c) => ncidNum(c.ncid) !== id)
        })
      }
    } catch {
      // ignore
    }
  }

  /* ─── like comment ─── */

  function toggleLike(item: NewsComment) {
    if (!loginUserId) {
      login()
      return
    }
    const id = String(item.ncid)
    if (likeBusy[id]) return
    const isLike = !item.isLike
    const delta = isLike ? 1 : -1

    setLikeBusy((b) => ({ ...b, [id]: true }))

    const applyDelta = (c: NewsComment): NewsComment =>
      ncidNum(c.ncid) === ncidNum(item.ncid)
        ? { ...c, isLike, likeCount: Math.max(0, (c.likeCount ?? 0) + delta) }
        : c

    setComments((prev) =>
      prev.map((c) => ({ ...applyDelta(c), children: (c.children ?? []).map(applyDelta) }))
    )

    const qs = new URLSearchParams({ flag: "2", isLike: String(isLike), typeId: id })
    clientGet<{ success: boolean }>(`${NEWS_ROUTES.LIKE}?${qs}`)
      .then((json) => {
        if (!json?.success) {
          const rollbackDelta = (c: NewsComment): NewsComment =>
            ncidNum(c.ncid) === ncidNum(item.ncid)
              ? { ...c, isLike: !isLike, likeCount: Math.max(0, (c.likeCount ?? 0) - delta) }
              : c
          setComments((prev) =>
            prev.map((c) => ({
              ...rollbackDelta(c),
              children: (c.children ?? []).map(rollbackDelta),
            }))
          )
        }
      })
      .finally(() => setLikeBusy((b) => ({ ...b, [id]: false })))
  }

  /* ─── reply UI ─── */

  function openReply(parent: NewsComment, target: NewsComment) {
    if (!loginUserId) {
      login()
      return
    }
    setReplyParent(parent)
    setReplyTo(target)
  }

  function closeReply() {
    setReplyParent(null)
    setReplyTo(null)
  }

  const isOwn = (c: NewsComment) => !!loginUserId && String(c.userSourceId) === loginUserId

  /* ─── render helpers ─── */

  function renderActions(item: NewsComment, parent?: NewsComment) {
    return (
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => toggleLike(item)}
          className={`flex items-center gap-1.5 text-[12px] transition-colors ${
            item.isLike ? "text-[#ffd220]" : "text-white/40 hover:text-white/70"
          }`}
        >
          <Heart className="size-3.5" />
          <span>{item.likeCount ?? 0}</span>
        </button>

        {!authLoading && (
          <button
            type="button"
            onClick={() => openReply(parent ?? item, item)}
            className="text-[12px] text-white/40 transition-colors hover:text-white/70"
          >
            {t("news.comment.reply")}
          </button>
        )}

        {isOwn(item) && (
          <button
            type="button"
            onClick={() => void deleteComment(item)}
            className="text-[12px] text-white/30 transition-colors hover:text-red-400"
          >
            {t("news.comment.delete")}
          </button>
        )}
      </div>
    )
  }

  function renderReply(r: NewsComment, parent: NewsComment) {
    if (r._pending) return <SkeletonRow key={r._clientKey} small />
    return (
      <div key={String(r.ncid)} className="flex gap-2 py-2">
        <AvatarSm src={r.avatar} alt={r.userName ?? ""} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-600 text-[13px] text-[#ffd220]">{r.userName}</span>
            {r.replyUserName && (
              <span className="text-[12px] text-white/40">▸ {r.replyUserName}</span>
            )}
            <span className="text-[12px] text-white/30">{formatPublishTime(r.publishTime)}</span>
          </div>
          <p className="mt-1 mb-1.5 text-[13px] leading-relaxed whitespace-pre-wrap text-white/80">
            {r.content}
          </p>
          {renderActions(r, parent)}
        </div>
      </div>
    )
  }

  function renderCommentItem(c: NewsComment) {
    if (c._pending) return <SkeletonRow key={c._clientKey} />
    return (
      <div key={String(c.ncid)} className="flex gap-2.5 border-t border-white/[0.06] py-3">
        <Avatar src={c.avatar} alt={c.userName ?? ""} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-600 text-[13px] text-[#ffd220]">{c.userName}</span>
            <span className="text-[12px] text-white/30">{formatPublishTime(c.publishTime)}</span>
          </div>
          <p className="mt-1 mb-1.5 text-[14px] leading-relaxed whitespace-pre-wrap text-white/80">
            {c.content}
          </p>
          {renderActions(c)}

          {(c.children ?? []).length > 0 && (
            <div className="mt-2 border-l-2 border-white/[0.08] pl-3">
              {(c.children ?? []).map((r) => renderReply(r, c))}
            </div>
          )}

          {replyParent && ncidNum(replyParent.ncid) === ncidNum(c.ncid) && (
            <div className="mt-2 flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <CommentComposeInput
                  placeholder={`${t("news.comment.reply")} @${replyTo?.userName ?? ""}…`}
                  submitLabel={t("news.comment.reply")}
                  loading={replySubmitting}
                  onSubmit={submitReply}
                />
              </div>
              <button
                type="button"
                onClick={closeReply}
                className="shrink-0 text-lg leading-none text-white/30 hover:text-white/60"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ─── render ─── */

  return (
    <div className="card-glow rounded-12 flex flex-col gap-0 p-4" style={NEWS_PANEL_STYLE}>
      <div className="flex items-center gap-2 pb-3">
        <MessageCircle className="size-5 text-white/60" />
        <Typography variant="h2" className="text-white">
          {t("news.comment.title")}
        </Typography>
        <span className="text-[13px] text-white/40">({total})</span>
      </div>

      <div>
        {loading && !comments.length ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
        ) : comments.length === 0 ? (
          <EmptyState label={t("news.comment.empty")} />
        ) : (
          comments.map(renderCommentItem)
        )}

        {loadingMore && Array.from({ length: 2 }).map((_, i) => <SkeletonRow key={`more-${i}`} />)}

        {hasMore && !loadingMore && (
          <div className="flex justify-center pt-3">
            <button
              type="button"
              onClick={() => void fetchComments(false)}
              className="font-600 flex items-center gap-1.5 rounded-full bg-[rgba(255,210,32,0.1)] px-4 py-1.5 text-[13px] text-[#ffd220] transition-colors hover:bg-[rgba(255,210,32,0.18)]"
            >
              {t("news.comment.viewMore")}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 border-t border-white/[0.06] pt-3">
        {authLoading ? null : !isLoggedIn ? (
          <button
            type="button"
            onClick={login}
            className="w-full rounded-full border border-white/10 py-2 text-[14px] text-white/50 transition-colors hover:border-[rgba(255,210,32,0.35)] hover:text-white/80"
          >
            {t("news.comment.loginToComment")}
          </button>
        ) : (
          <CommentComposeInput
            placeholder={t("news.comment.placeholder")}
            submitLabel={t("news.comment.submit")}
            loading={submitting}
            onSubmit={submitComment}
          />
        )}
      </div>
    </div>
  )
}
