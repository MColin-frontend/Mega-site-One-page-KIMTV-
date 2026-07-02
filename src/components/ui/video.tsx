"use client"

import { useEffect, useRef } from "react"
import type { SimplePlayer } from "xgplayer"

import { cn } from "@/lib/utils"

import "xgplayer/dist/index.min.css"

export interface VideoSource {
  url: string
  name?: string
}

export interface VideoPlayerProps {
  /** Single URL hoặc dùng sources cho multi-source */
  url?: string
  sources?: VideoSource[]
  poster?: string
  /** true = live stream (HLS/FLV), false = VOD (MP4/HLS) */
  isLive?: boolean
  autoplay?: boolean
  autoplayMuted?: boolean
  volume?: number
  /** false = ẩn controls hoàn toàn */
  controls?: boolean
  pip?: boolean
  /** Unique id cho player DOM mount */
  id?: string
  className?: string
  onReady?: () => void
  onPlay?: () => void
  onPause?: () => void
  onError?: (error: unknown) => void
  onEnded?: () => void
}

function detectFormat(url: string) {
  if (url.includes(".m3u8")) return "hls"
  if (url.includes(".flv")) return "flv"
  return "native"
}

let _uid = 0
function nextId() {
  return `xgp-${++_uid}`
}

export function VideoPlayer({
  url,
  sources,
  poster,
  isLive = false,
  autoplay = true,
  autoplayMuted = false,
  volume = 0.6,
  controls = true,
  pip = true,
  id,
  className,
  onReady,
  onPlay,
  onPause,
  onError,
  onEnded,
}: VideoPlayerProps) {
  // eslint-disable-next-line react-hooks/refs
  const mountId = useRef(id ?? nextId()).current
  const playerRef = useRef<SimplePlayer | null>(null)

  useEffect(() => {
    let destroyed = false

    async function initPlayer() {
      const activeUrl = url ?? sources?.[0]?.url
      if (!activeUrl) return

      const format = detectFormat(activeUrl)

      const [xgMod, hlsMod, flvMod] = await Promise.all([
        import("xgplayer"),
        format === "hls" ? import("xgplayer-hls") : Promise.resolve(null),
        format === "flv" ? import("xgplayer-flv") : Promise.resolve(null),
      ])

      if (destroyed) return

      // CJS build: module.exports = PresetPlayer (function) → interop default
      // ESM build: no default, only named SimplePlayer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Player = ((xgMod as any).default ?? (xgMod as any).SimplePlayer) as typeof SimplePlayer

      const plugins: unknown[] = []
      // xgplayer-hls exports HlsPlugin as default
      if (hlsMod) plugins.push(hlsMod.default ?? hlsMod.HlsPlugin)
      // xgplayer-flv exports FlvPlugin as default
      if (flvMod) plugins.push(flvMod.default ?? flvMod.FlvPlugin)

      const resourceList =
        sources && sources.length > 1
          ? sources.map((s, i) => ({ name: s.name ?? `Nguồn ${i + 1}`, url: s.url }))
          : undefined

      playerRef.current = new Player({
        id: mountId,
        url: activeUrl,
        poster: poster || undefined,
        plugins,
        isLive,
        autoplay,
        autoplayMuted,
        volume,
        controls,
        pip,
        playsinline: true,
        width: "100%",
        height: "100%",
        fluid: false,
        cssFullscreen: false,
        playbackRate: !isLive,
        ignores: ["start"],
      })

      const player = playerRef.current

      player.on("ready", () => {
        if (destroyed) return
        onReady?.()
        if (resourceList && resourceList.length > 1) {
          player.emit("resourceReady", resourceList)
        }
      })
      player.on("playing", () => {
        if (!destroyed) onPlay?.()
      })
      player.on("pause", () => {
        if (!destroyed) onPause?.()
      })
      player.on("ended", () => {
        if (!destroyed) onEnded?.()
      })
      player.on("error", (err: unknown) => {
        if (!destroyed) onError?.(err)
      })

      player.on("autoplay_was_prevented", () => {
        if (destroyed) return
        player.destroy()
        setTimeout(() => {
          if (!destroyed) initPlayer()
        }, 100)
      })
    }

    initPlayer()

    return () => {
      destroyed = true
      try {
        const p = playerRef.current
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const videoEl = (p as any)?.video || (p as any)?.media
        if (videoEl) {
          videoEl.muted = true
          videoEl.pause?.()
          videoEl.removeAttribute?.("src")
          videoEl.load?.()
        }
        p?.pause?.()
        p?.destroy?.()
      } catch {}
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, sources?.map((s) => s.url).join(",")])

  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-lg bg-black", className)}>
      <div id={mountId} className="h-full w-full" />
    </div>
  )
}
