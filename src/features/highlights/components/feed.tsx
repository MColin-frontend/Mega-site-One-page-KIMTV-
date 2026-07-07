"use client"

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { cn, formatCount, formatDuration } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useDisclosure } from "@/hooks/useDisclosure"

import { useTranslation } from "@/i18n"
import { getRoutes } from "@/config/routes"
import { siteConfig } from "@/config/site"

import { resolveIsLiked } from "@/features/highlights/comments.utils"
import type { HighlightVideoInterface } from "@/features/highlights/highlights.api"
import {
  fetchVideoFeed,
  toggleFollowAction,
  toggleLikeAction,
} from "@/features/highlights/highlights.api"
import {
  FeedMenu,
  FILTER_MENU_CONFIG,
  LINK_MENU_CONFIG,
} from "@/features/highlights/highlights.constants"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"
import type { VideoFeedPlayerHandle } from "@/components/ui/video-feed-player"

import {
  IcComment,
  IcHeart,
  IcHeartBurst,
  IcHeartFilled,
  IcMenuFeatured,
  IcMenuLatest,
  IcMenuNews,
  IcMenuPromotion,
  IcMenuTrending,
  IcMute,
  IcNavDown,
  IcNavUp,
  IcPauseHint,
  IcPlay,
  IcReplay,
  IcShare,
  IcUnmute,
} from "./feed-icons"
import { FeedSkeleton, MenuSkeleton } from "./skeleton"

// ─── Static icon maps (module-level, không re-create mỗi render) ─────────────
type MenuIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const FILTER_ICON: Record<FeedMenu, MenuIconComponent> = {
  [FeedMenu.Featured]: IcMenuTrending,
  [FeedMenu.Latest]: IcMenuLatest,
  [FeedMenu.Trending]: IcMenuFeatured,
}
const LINK_ICON: Record<string, MenuIconComponent> = {
  news: IcMenuNews,
  promotion: IcMenuPromotion,
}

const VideoFeedPlayer = dynamic(
  () => import("@/components/ui/video-feed-player").then((m) => m.VideoFeedPlayer),
  { ssr: false }
)
const CommentDrawer = dynamic(() => import("./comment-drawer").then((m) => m.CommentDrawer), {
  ssr: false,
})

export { FeedMenu }

function resolveNewsId(item: HighlightVideoInterface | null): string {
  if (!item) return ""
  return String(item.newsId ?? "")
}

function resolveIsFollowed(item: HighlightVideoInterface): boolean {
  return resolveIsLiked(item.hasFollow)
}

function MenuIcon({ Icon, active }: { Icon: MenuIconComponent; active?: boolean }) {
  return <Icon className={cn("size-5 shrink-0", active ? "text-[#ffd220]" : "text-white/60")} />
}

// ─── Main component ───────────────────────────────────────────────────────────

interface HighlightsFeedProps {
  initialVideos: HighlightVideoInterface[]
  initialMenu?: FeedMenu
  initialHasMore?: boolean
}

export function HighlightsFeed({
  initialVideos,
  initialMenu = FeedMenu.Featured,
  initialHasMore = false,
}: HighlightsFeedProps) {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const { user, isLoggedIn, login } = useAuth()
  const routes = getRoutes(locale)

  // ── Data state ──────────────────────────────────────────────────────────────
  const [videos, setVideos] = useState<HighlightVideoInterface[]>(initialVideos)
  const [activeMenu, setActiveMenu] = useState<FeedMenu>(initialMenu)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)

  // ── Navigation state ────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const pendingAdvance = useRef(false)

  // ── Playback state ──────────────────────────────────────────────────────────
  const [isMuted, setIsMuted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isEnded, setIsEnded] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const [showPauseHint, setShowPauseHint] = useState(false)
  const pauseHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Social state ────────────────────────────────────────────────────────────
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({})
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({})
  const [likeLoading, setLikeLoading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [showHeartBurst, setShowHeartBurst] = useState(false)
  const [isAwaitingNext, setIsAwaitingNext] = useState(false)

  // ── UI state ─────────────────────────────────────────────────────────────────
  const { state: drawerState, open: openDrawer, close: closeDrawer } = useDisclosure("comment")

  // ── Player refs ─────────────────────────────────────────────────────────────
  const playerRef = useRef<VideoFeedPlayerHandle | null>(null)

  // ── Progress drag ────────────────────────────────────────────────────────────
  const isDragging = useRef(false)

  // ── Wheel debounce ────────────────────────────────────────────────────────────
  const wheelLocked = useRef(false)
  const wheelContainerRef = useRef<HTMLDivElement>(null)

  // ── Last tap for double-tap like ─────────────────────────────────────────────
  const lastTapTime = useRef(0)

  // ── Stage sizing ─────────────────────────────────────────────────────────────
  const [stageHeight, setStageHeight] = useState(720)
  const [playerWidth, setPlayerWidth] = useState(360)
  const [layoutReady, setLayoutReady] = useState(false)

  const updateLayout = useCallback(() => {
    if (typeof window === "undefined") return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const headerH = document.getElementById("header")?.offsetHeight ?? 72
    const isMobile = vw <= 768
    const topMenuH = isMobile ? 80 : 0
    const sideMenuW = isMobile ? 0 : 96
    const railW = isMobile ? 0 : 60
    const gap = 12

    const stageH = Math.max(vh - headerH - topMenuH - 20, 360)
    const maxPlayerW = Math.max(vw - sideMenuW - railW - gap * 2 - (isMobile ? 32 : 48), 260)
    let pw = Math.round((stageH * 9) / 16)
    if (pw > maxPlayerW) pw = maxPlayerW

    setStageHeight(Math.round(stageH))
    setPlayerWidth(Math.round(pw))
    setLayoutReady(true)
  }, [])

  // useLayoutEffect chạy đồng bộ trước khi browser paint → không bao giờ hiện state sai kích thước
  useLayoutEffect(() => {
    updateLayout() // eslint-disable-line react-hooks/set-state-in-effect
  }, [updateLayout])

  // Resize listener không cần synchronous
  useEffect(() => {
    window.addEventListener("resize", updateLayout)
    return () => window.removeEventListener("resize", updateLayout)
  }, [updateLayout])

  // ── Derived ──────────────────────────────────────────────────────────────────
  const currentItem = videos[currentIndex] ?? null
  const newsId = resolveNewsId(currentItem)
  const coverUrl = currentItem?.coverUrl ?? ""

  const isLiked = (() => {
    if (!currentItem) return false
    if (likedMap[newsId] !== undefined) return likedMap[newsId]
    return resolveIsLiked(currentItem.isLike)
  })()

  const isFollowed = (() => {
    if (!currentItem?.authorId) return false
    const aid = String(currentItem.authorId)
    if (followMap[aid] !== undefined) return followMap[aid]
    return resolveIsFollowed(currentItem)
  })()

  const displayLikeCount = Number(currentItem?.likeCount) || 0
  const canGoNext = currentIndex < videos.length - 1 || hasMore
  const showFollowBtn =
    !!currentItem?.authorId &&
    !(isLoggedIn && user?.userId && String(user.userId) === String(currentItem.authorId))

  // ── Fetch videos ─────────────────────────────────────────────────────────────
  const fetchVideos = useCallback(async (menu: FeedMenu, pageNum = 1, append = false) => {
    if (append) setLoadingMore(true)
    else setLoading(true)
    try {
      const { videos: newVideos, hasMore: more } = await fetchVideoFeed({
        status: menu,
        page: pageNum,
      })
      if (append) {
        setVideos((prev) => [...prev, ...newVideos])
      } else {
        setVideos(newVideos)
        setCurrentIndex(0)
      }
      setHasMore(more)
      setPage(pageNum)
    } catch {
      if (!append) setVideos([])
    } finally {
      if (append) {
        setLoadingMore(false)
        // Nếu pendingAdvance chưa được resolve (không có video mới), xóa skeleton
        if (pendingAdvance.current) {
          pendingAdvance.current = false
          setIsAwaitingNext(false)
        }
      } else {
        setLoading(false)
      }
    }
  }, [])

  // ── Menu change ───────────────────────────────────────────────────────────────
  const onMenuChange = useCallback(
    async (menu: FeedMenu) => {
      if (menu === activeMenu || loading) return
      setActiveMenu(menu)
      router.replace(`?highlight-status=${menu}`, { scroll: false })
      await fetchVideos(menu, 1, false)
    },
    [activeMenu, loading, fetchVideos, router]
  )

  // ── Load more ────────────────────────────────────────────────────────────────
  const loadMore = useCallback(() => {
    if (activeMenu !== FeedMenu.Latest || loadingMore || !hasMore) return
    fetchVideos(activeMenu, page + 1, true)
  }, [activeMenu, loadingMore, hasMore, page, fetchVideos])

  // ── Sync liked map on video change ───────────────────────────────────────────
  useEffect(() => {
    videos.forEach((v) => {
      const id = resolveNewsId(v)
      if (!id || likedMap[id] !== undefined) return
      if (resolveIsLiked(v.isLike)) setLikedMap((prev) => ({ ...prev, [id]: true }))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos])

  // ── Advance after more loaded ─────────────────────────────────────────────────
  useEffect(() => {
    if (pendingAdvance.current && videos.length > 0) {
      pendingAdvance.current = false
      setIsAwaitingNext(false)
      setCurrentIndex((i) => Math.min(i + 1, videos.length - 1))
    }
  }, [videos.length])

  // ── Reset playback on index/menu change ──────────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPaused(false)
    setIsEnded(false)
    setShowPauseHint(false)
    setVideoReady(false)
    setPlaybackProgress(0)
    closeDrawer("comment")
    if (pauseHintTimer.current) clearTimeout(pauseHintTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, activeMenu])

  // ── Keyboard nav ─────────────────────────────────────────────────────────────
  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase()
      if (tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable)
        return
      if ((e.target as HTMLElement)?.closest?.(".comment-compose-input")) return

      if (e.key === "Escape" && drawerState.comment) {
        e.preventDefault()
        closeDrawer("comment")
        return
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        goPrev()
      } else if (e.key === " ") {
        e.preventDefault()
        togglePlayPause()
      }
    }
    window.addEventListener("keydown", onKeydown)
    return () => window.removeEventListener("keydown", onKeydown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, videos.length, hasMore, drawerState.comment, isPaused, isEnded])

  // ── Load more near end ────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeMenu === FeedMenu.Latest && hasMore && currentIndex >= videos.length - 3) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMore()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // ── Block page scroll khi chuột trong vùng feed ──────────────────────────────
  useEffect(() => {
    const el = wheelContainerRef.current
    if (!el) return
    const block = (e: WheelEvent) => e.preventDefault()
    el.addEventListener("wheel", block, { passive: false })
    return () => el.removeEventListener("wheel", block)
  }, [])

  // ── Navigation ───────────────────────────────────────────────────────────────
  function goPrev() {
    if (currentIndex <= 0) return
    setCurrentIndex((i) => i - 1)
  }

  function goNext() {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((i) => i + 1)
      return
    }
    if (activeMenu !== FeedMenu.Latest || !hasMore) return
    pendingAdvance.current = true
    setIsAwaitingNext(true)
    if (!loadingMore) loadMore()
  }

  // ── Wheel ─────────────────────────────────────────────────────────────────────
  function onWheel(e: React.WheelEvent) {
    if (wheelLocked.current) return
    wheelLocked.current = true
    setTimeout(() => {
      wheelLocked.current = false
    }, 450)
    if (e.deltaY > 0) goNext()
    else if (e.deltaY < 0) goPrev()
  }

  // ── Playback controls ─────────────────────────────────────────────────────────
  function pauseVideo() {
    playerRef.current?.pause()
    setIsPaused(true)
    setShowPauseHint(true)
    if (pauseHintTimer.current) clearTimeout(pauseHintTimer.current)
    pauseHintTimer.current = setTimeout(() => setShowPauseHint(false), 500)
  }

  function resumeVideo() {
    const p = playerRef.current
    if (!p) return
    const dur = p.getDuration()
    const cur = p.getCurrentTime()
    if (dur > 0 && cur >= dur - 0.1) p.seek(0)
    p.setMuted(isMuted)
    p.play()
    setIsPaused(false)
    setIsEnded(false)
    setShowPauseHint(false)
  }

  function togglePlayPause() {
    if (isEnded) {
      resumeVideo()
      return
    }
    if (isPaused) resumeVideo()
    else pauseVideo()
  }

  function toggleMute() {
    const next = !isMuted
    setIsMuted(next)
    playerRef.current?.setMuted(next)
  }

  // ── Tap handler (single = play/pause, double = like) ──────────────────────────
  function onPlayerTap() {
    const now = Date.now()
    if (now - lastTapTime.current < 280) {
      triggerLike(true)
      lastTapTime.current = 0
      return
    }
    lastTapTime.current = now
    setTimeout(() => {
      if (Date.now() - lastTapTime.current >= 280) {
        togglePlayPause()
      }
    }, 300)
  }

  // ── Progress bar ──────────────────────────────────────────────────────────────
  function seekToX(clientX: number, trackEl: HTMLElement) {
    const p = playerRef.current
    if (!p) return
    const rect = trackEl.getBoundingClientRect()
    if (!rect.width) return
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    const dur = p.getDuration()
    if (!Number.isFinite(dur) || dur <= 0) return
    p.seek(ratio * dur)
    setPlaybackProgress(Math.round(ratio * 100))
  }

  function onProgressMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    const trackEl = e.currentTarget.querySelector<HTMLElement>(".feed-progress__track")
    if (!trackEl) return
    seekToX(e.clientX, trackEl)
    isDragging.current = true

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current) return
      seekToX(ev.clientX, trackEl)
    }
    const onUp = () => {
      isDragging.current = false
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  // ── Like ──────────────────────────────────────────────────────────────────────
  function triggerLike(fromDoubleTap = false) {
    if (fromDoubleTap && !isLiked) {
      setShowHeartBurst(true)
      setTimeout(() => setShowHeartBurst(false), 700)
    }
    if (!isLiked) toggleLike(true)
  }

  async function toggleLike(fromDoubleTap = false) {
    if (!currentItem || likeLoading) return
    if (!isLoggedIn) {
      login()
      return
    }

    const wasLiked = isLiked
    if (fromDoubleTap && wasLiked) return

    await toggleLikeAction({
      newsId,
      isLike: fromDoubleTap ? true : !wasLiked,
      wasLiked,
      originalCount: displayLikeCount,
      loginUserId: user?.userId ? String(user.userId) : "",
      setLikedMap,
      setVideos,
      setLikeLoading,
    })
  }

  async function handleFollow() {
    if (!isLoggedIn) {
      login()
    } else {
      await toggleFollowAction({
        userId: String(currentItem?.authorId),
        setFollowMap,
        setVideos,
        setFollowLoading,
        messageSuccess: t("video.follow.success"),
      })
    }
  }

  function handleShareVideo() {
    if (!currentItem) return
    const url = `${window.location.origin}${routes.video.article(String(newsId))}`
    try {
      navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
  }

  // ── Menu items — built from static config + runtime t() / routes ────────────
  const filterMenuItems = FILTER_MENU_CONFIG.map((c) => ({
    ...c,
    label: t(c.labelKey),
    Icon: FILTER_ICON[c.key],
  }))

  const linkUrlMap: Record<string, string> = {
    news: routes.news.index,
    promotion: siteConfig.links.promotion,
  }
  const linkMenuItems = LINK_MENU_CONFIG.map((c) => ({
    ...c,
    label: t(c.labelKey),
    Icon: LINK_ICON[c.key],
    url: linkUrlMap[c.key],
  }))

  return (
    <div className="flex w-full gap-3" style={{ height: stageHeight, minHeight: stageHeight }}>
      {/* ── Side menu (desktop) ─────────────────────────────────────────── */}
      {loading ? <MenuSkeleton /> : null}
      <aside
        className={cn(
          "feed-menu sticky w-24 shrink-0 self-start pt-6 max-md:hidden",
          loading && "hidden"
        )}
      >
        <nav className="flex flex-col gap-0.5 rounded-2xl border border-white/8 bg-[rgba(22,24,35,0.92)] px-2 py-2.5 shadow-xl backdrop-blur-xl">
          {/* Filter group */}
          <div className="flex flex-col gap-0.5">
            {filterMenuItems.map(({ key, label, Icon }) => (
              <Button
                key={key}
                type="button"
                disabled={loading}
                onClick={() => onMenuChange(key)}
                className={cn(
                  "relative h-auto min-h-16 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-0 px-1 py-2.5 text-[11px] leading-tight font-medium transition-all [&_svg]:size-auto",
                  activeMenu === key
                    ? "bg-[rgba(255,210,32,0.1)] opacity-100 backdrop-blur-sm"
                    : "bg-transparent opacity-60 hover:bg-white/6 hover:opacity-90",
                  loading && "cursor-not-allowed opacity-30"
                )}
              >
                <MenuIcon Icon={Icon} active={activeMenu === key} />
                <Typography
                  as="span"
                  variant="caption"
                  className={cn(
                    "line-clamp-2 text-center text-[11px] leading-tight font-medium",
                    activeMenu === key ? "text-[#ffd220]" : "text-white/70"
                  )}
                >
                  {label}
                </Typography>
                {activeMenu === key && (
                  <span className="absolute bottom-1 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-[#ffd220]" />
                )}
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-1.5 my-2 h-px bg-linear-to-r from-transparent via-white/14 to-transparent" />

          {/* Link group */}
          <div className="flex flex-col gap-0.5">
            {linkMenuItems.map(({ key, label, Icon, url, external }) => (
              <Button
                key={key}
                type="button"
                onClick={() => {
                  if (external || /^https?:\/\//i.test(url)) {
                    window.open(url, "_blank", "noopener,noreferrer")
                  } else {
                    window.location.href = url
                  }
                }}
                className="h-auto min-h-16 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-0 bg-transparent px-1 py-2.5 opacity-60 hover:bg-white/6 hover:opacity-90 [&_svg]:size-auto"
              >
                <MenuIcon Icon={Icon} />
                <Typography
                  as="span"
                  variant="caption"
                  className="line-clamp-2 text-center text-[11px] leading-tight font-medium text-white/70"
                >
                  {label}
                </Typography>
              </Button>
            ))}
          </div>
        </nav>
      </aside>

      {/* ── Mobile top menu ─────────────────────────────────────────────── */}
      <div className="absolute top-0 right-0 left-0 z-10 flex scrollbar-none items-center gap-1 overflow-x-auto bg-black/60 px-3 py-2 backdrop-blur-sm md:hidden">
        {filterMenuItems.map(({ key, label }) => (
          <Button
            key={key}
            type="button"
            onClick={() => onMenuChange(key)}
            className={cn(
              "h-auto shrink-0 rounded-full border-0 px-3 py-1.5 text-xs font-semibold transition-colors",
              activeMenu === key
                ? "bg-[#ffd220] text-black hover:bg-[#ffd220]/90"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            )}
          >
            {label}
          </Button>
        ))}
        <span className="mx-0.5 h-5 w-px shrink-0 bg-white/15" />
        {linkMenuItems.map(({ key, label, url, external }) => (
          <Button
            key={key}
            type="button"
            onClick={() => {
              if (external || /^https?:\/\//i.test(url)) {
                window.open(url, "_blank", "noopener,noreferrer")
              } else {
                window.location.href = url
              }
            }}
            className="h-auto shrink-0 rounded-full border-0 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/20"
          >
            {label}
          </Button>
        ))}
      </div>

      <main className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden bg-black">
        {loading || !layoutReady ? (
          <FeedSkeleton playerWidth={playerWidth} stageHeight={stageHeight} />
        ) : videos.length === 0 ? (
          <Typography variant="body-sm" className="text-white/50">
            {t("video.empty")}
          </Typography>
        ) : (
          <div
            ref={wheelContainerRef}
            className="flex h-full w-full touch-none items-center justify-center"
            style={{ height: stageHeight }}
            onWheel={onWheel}
          >
            {/* Skeleton khi đang chờ load video tiếp theo */}
            {isAwaitingNext && <FeedSkeleton playerWidth={playerWidth} stageHeight={stageHeight} />}

            {/* center: player + rail */}
            <div className={cn("flex h-full items-stretch gap-3", isAwaitingNext && "invisible")}>
              {/* Player */}
              <div
                className="relative overflow-hidden rounded bg-black"
                style={{ width: playerWidth, height: stageHeight }}
              >
                {/* Cover */}
                {coverUrl && !videoReady && (
                  <Img
                    src={coverUrl}
                    alt={currentItem?.title ?? ""}
                    fill
                    objectFit="contain"
                    unoptimized
                    sizes="100vw"
                    wrapperClassName="absolute inset-0 z-2"
                  />
                )}

                {/* Video */}
                {currentItem?.videoUrl && (
                  <VideoFeedPlayer
                    key={`player-${newsId}-${currentIndex}`}
                    ref={playerRef}
                    url={currentItem.videoUrl}
                    poster={coverUrl}
                    muted={isMuted}
                    volume={0.8}
                    autoplay
                    onReady={() => setVideoReady(true)}
                    onPlay={() => {
                      setVideoReady(true)
                      setIsPaused(false)
                      setIsEnded(false)
                    }}
                    onPause={() => setIsPaused(true)}
                    onEnded={() => {
                      setIsEnded(true)
                      setIsPaused(true)
                      setPlaybackProgress(100)
                    }}
                    onTimeUpdate={(cur, dur) => {
                      if (isDragging.current || !dur) return
                      setPlaybackProgress(Math.round((cur / dur) * 100))
                    }}
                    className="absolute inset-0 z-1"
                  />
                )}

                {/* Tap overlay */}
                <Button
                  type="button"
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 z-14 h-full w-full cursor-pointer rounded-none border-0 bg-transparent hover:bg-transparent",
                    isEnded && "pointer-events-none"
                  )}
                  onClick={onPlayerTap}
                />

                {/* Mute btn */}
                {currentItem?.videoUrl && (
                  <Button
                    type="button"
                    className="absolute top-4 left-4 z-20 h-12 w-12 rounded-full border-0 bg-black/35 p-0 text-white hover:bg-black/50"
                    onClick={toggleMute}
                    aria-label={isMuted ? t("video.actions.unmute") : t("video.actions.mute")}
                  >
                    {isMuted ? <IcMute /> : <IcUnmute />}
                  </Button>
                )}

                {/* Pause hint */}
                {showPauseHint && (
                  <div className="pointer-events-none absolute inset-0 z-18 flex animate-[feedPauseHint_0.5s_ease_forwards] items-center justify-center">
                    <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-white/85 bg-black/28 backdrop-blur-[10px]">
                      <IcPauseHint className="text-white" />
                    </div>
                  </div>
                )}

                {/* Play / Replay button */}
                {((isPaused && !isEnded) || isEnded) && (
                  <Button
                    type="button"
                    className="absolute inset-0 z-18 flex h-full w-full items-center justify-center border-0 bg-transparent hover:bg-transparent"
                    onClick={resumeVideo}
                    aria-label={isEnded ? t("video.actions.replay") : t("video.actions.play")}
                  >
                    <span className="flex h-18 w-18 items-center justify-center rounded-full border-2 border-white/92 bg-black/28 backdrop-blur-[10px] transition-transform hover:scale-105">
                      {isEnded ? (
                        <IcReplay className="text-white" />
                      ) : (
                        <IcPlay className="text-white" />
                      )}
                    </span>
                  </Button>
                )}

                {/* Heart burst */}
                {showHeartBurst && (
                  <div className="pointer-events-none absolute inset-0 z-18 flex animate-[heartPop_0.7s_ease_forwards] items-center justify-center text-[#fe2c55]">
                    <IcHeartBurst />
                  </div>
                )}

                {/* Progress bar */}
                {currentItem?.videoUrl && (
                  <div className="absolute right-0 bottom-5 left-0 z-22 px-2">
                    {currentItem.durationMillis ? (
                      <Typography
                        as="p"
                        variant="caption"
                        className="mb-1.5 px-1 text-right font-semibold text-white/95"
                        style={{ textShadow: "0 1px 4px rgba(0,0,0,.7)" }}
                      >
                        {formatDuration(Number(currentItem.durationMillis))}
                      </Typography>
                    ) : null}
                    <div className="feed-progress cursor-pointer" onMouseDown={onProgressMouseDown}>
                      <div className="feed-progress__track relative h-[3px] w-full rounded-full bg-white/25 transition-[height] hover:h-1">
                        <span
                          className="absolute top-0 left-0 block h-full rounded-full bg-white"
                          style={{
                            width: `${playbackProgress}%`,
                            transition: isDragging.current ? "none" : "width 0.15s linear",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Meta (user + title) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-12 bg-linear-to-t from-black/72 via-black/40 to-transparent px-5 pt-16 pb-14">
                  {currentItem?.authorId ? (
                    <Link
                      href={`/user-info/${currentItem.authorId}`}
                      className="pointer-events-auto mb-2 inline-block"
                    >
                      <Typography as="span" variant="h2" className="text-white drop-shadow">
                        @{currentItem.userName || "KIMTV"}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography
                      as="span"
                      variant="h2"
                      className="mb-2 inline-block text-white drop-shadow"
                    >
                      @{currentItem?.userName || "KIMTV"}
                    </Typography>
                  )}
                  <Link
                    href={routes.video.article(String(newsId))}
                    className="pointer-events-auto block w-full text-left"
                  >
                    <Typography
                      as="p"
                      variant="h6"
                      className="line-clamp-3 leading-snug text-white/95 drop-shadow"
                    >
                      {currentItem?.title}
                    </Typography>
                  </Link>
                </div>
              </div>

              {/* Rail */}
              <aside className="flex flex-col items-center justify-center gap-7 self-stretch py-4 max-md:hidden">
                {/* Avatar + Follow */}
                <div className="relative">
                  {currentItem?.authorId ? (
                    <Link href={`/user-info/${currentItem.authorId}`}>
                      <Avatar size={56} className="border-2 border-white">
                        <AvatarImage
                          src={currentItem?.userAvatar}
                          alt={currentItem?.userName || ""}
                        />
                      </Avatar>
                    </Link>
                  ) : (
                    <Avatar size={56} className="border-2 border-white">
                      <AvatarImage
                        src={currentItem?.userAvatar}
                        alt={currentItem?.userName || ""}
                      />
                    </Avatar>
                  )}
                  {showFollowBtn && !isFollowed && (
                    <Button
                      type="button"
                      disabled={followLoading}
                      onClick={handleFollow}
                      className="absolute -bottom-2.5 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full border-0 bg-[#fe2c55] p-0 text-center text-xl leading-6 font-bold text-white hover:bg-[#fe2c55]/90"
                    >
                      +
                    </Button>
                  )}
                </div>

                {/* Like */}
                <Button
                  type="button"
                  disabled={likeLoading}
                  onClick={() => toggleLike(false)}
                  className="h-auto w-auto flex-col items-center gap-2 border-0 bg-transparent text-white hover:bg-transparent disabled:opacity-60"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(84,84,84,0.72)]">
                    {isLiked ? (
                      <IcHeartFilled className="text-[#fe2c55]" />
                    ) : (
                      <IcHeart className="text-white" />
                    )}
                  </span>
                  <Typography
                    as="span"
                    variant="label"
                    className={cn("font-semibold", isLiked && "text-[#fe2c55]")}
                  >
                    {formatCount(displayLikeCount)}
                  </Typography>
                </Button>

                {/* Comment */}
                <Button
                  type="button"
                  onClick={() => openDrawer("comment")}
                  className="h-auto w-auto flex-col items-center gap-2 border-0 bg-transparent text-white hover:bg-transparent"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(84,84,84,0.72)]">
                    <IcComment className="text-white" />
                  </span>
                  <Typography as="span" variant="label" className="font-semibold">
                    {formatCount(Number(currentItem?.commentCount) || 0)}
                  </Typography>
                </Button>

                {/* Share */}
                <Button
                  type="button"
                  onClick={handleShareVideo}
                  className="h-auto w-auto flex-col items-center gap-2 border-0 bg-transparent text-white hover:bg-transparent"
                  aria-label={t("video.actions.share")}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(84,84,84,0.72)]">
                    <IcShare className="text-white" />
                  </span>
                </Button>
              </aside>
            </div>

            {/* Nav buttons */}
            <div className="absolute top-1/2 right-0 flex -translate-y-1/2 flex-col gap-3 pr-1">
              <Button
                type="button"
                disabled={currentIndex <= 0}
                onClick={goPrev}
                className="h-12 w-12 rounded-full border-0 bg-white/12 text-white hover:bg-white/22 disabled:opacity-35"
                aria-label="Previous"
              >
                <IcNavUp />
              </Button>
              <Button
                type="button"
                disabled={!canGoNext}
                onClick={goNext}
                className="h-12 w-12 rounded-full border-0 bg-white/12 text-white hover:bg-white/22 disabled:opacity-35"
                aria-label="Next"
              >
                <IcNavDown />
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Comment drawer */}
      {drawerState.comment && currentItem && (
        <CommentDrawer
          key={newsId}
          newsId={newsId}
          newsType={currentItem.newsType ?? 3}
          commentCount={Number(currentItem.commentCount) || 0}
          status={activeMenu}
          onClose={() => closeDrawer("comment")}
          onCountChange={(count) => {
            setVideos((prev) =>
              prev.map((v) => (resolveNewsId(v) === newsId ? { ...v, commentCount: count } : v))
            )
          }}
        />
      )}
    </div>
  )
}
