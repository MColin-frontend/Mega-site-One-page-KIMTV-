"use client"

import { useTranslation } from "@/i18n"
import type { AnchorRoomVo, MatchInterface } from "@/models/match.models"

import { Chat } from "@/components/ui/chat"
import { MatchCarousel } from "@/components/ui/match/match-carousel"
import { MatchLiveInfoBar } from "@/components/ui/match/match-live-info-bar"

import { LIVE_SECTION_CONFIG } from "../live.constants"
import type { LiveMatchInterface } from "../live.models"
import { LiveVideoPlayer } from "./live-video-player"

export interface LivePageProps {
  match: LiveMatchInterface | null
}

export function LivePage({ match }: LivePageProps) {
  const { t } = useTranslation()

  const liveUrls = (() => {
    if (match?.liveUrls?.length) return match.liveUrls
    const firstAnchor = match?.anchorRoom?.[0]
    if (firstAnchor?.liveUrl || firstAnchor?.liveUrlFlv) {
      return [{ liveUrl: firstAnchor.liveUrl, liveUrlFlv: firstAnchor.liveUrlFlv }]
    }
    return []
  })()

  return (
    <div className="container flex flex-col gap-6">
      <div className="flex h-[min(90vh,900px)] gap-4 max-lg:h-auto max-lg:flex-col">
        <div className="card-glow rounded-12 flex min-w-0 flex-1 flex-col overflow-hidden">
          <LiveVideoPlayer liveUrls={liveUrls} />
          {match && (
            <MatchLiveInfoBar
              match={{
                ...(match as unknown as MatchInterface),
                anchorRoomVos: (match.anchorRoom as unknown as AnchorRoomVo[]) ?? null,
              }}
            />
          )}
        </div>
        <div className="flex w-[420px] shrink-0 flex-col overflow-hidden max-lg:h-[500px] max-lg:w-full">
          <Chat />
        </div>
      </div>

      {Object.values(LIVE_SECTION_CONFIG).map((cfg) => (
        <MatchCarousel
          key={cfg.i18nKey}
          title={t(cfg.i18nKey as Parameters<typeof t>[0])}
          endpoint={cfg.endpoint}
          method={cfg.method}
          params={{ ...cfg.params }}
          matchType={cfg.matchType}
        />
      ))}
    </div>
  )
}
