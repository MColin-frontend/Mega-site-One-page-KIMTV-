import { getRequest } from "@/server/services/request"

import { env } from "@/config/env"
import { GAME_ABBR_TO_ID } from "@/constants/game.constants"

import type { LiveMatchInterface, LivePageDataInterface } from "../live.models"

export { GAME_ABBR_TO_ID }

export function getGameIdFromAbbr(abbr: string): number | null {
  return GAME_ABBR_TO_ID[abbr.toLowerCase()] ?? null
}

export function wrapStreamUrl(url: string): string {
  return env.isDev ? `/api/stream?url=${encodeURIComponent(url)}` : url
}

export function buildStreamSources(
  liveUrl: string | null | undefined,
  liveUrlFlv: string | null | undefined,
  label?: string
): Array<{ url: string; name: string }> {
  const sources: { url: string; name: string }[] = []
  const suffix = label ? ` ${label}` : ""
  if (liveUrlFlv) sources.push({ url: wrapStreamUrl(liveUrlFlv), name: `FLV${suffix}` })
  if (liveUrl) sources.push({ url: wrapStreamUrl(liveUrl), name: `HLS${suffix}` })
  return sources
}

export const LIVE_API = {
  ANCHOR_DETAIL: "/v2/live/detail",
  MATCH_DETAIL: (matchId: string, gameId: number) => `/match/detail/${matchId}/${gameId}`,
} as const

interface AnchorLiveDetailResult {
  match: LiveMatchInterface | null
  userLevel?: number
}

const EMPTY: LivePageDataInterface = { match: null, chatAnnouncement: [] }

/** Fetch theo roomId (bình luận viên live) — dùng cho route /truc-tiep/[id] */
export function fetchAnchorLiveData(roomId: string): Promise<LivePageDataInterface> {
  return getRequest<AnchorLiveDetailResult>(LIVE_API.ANCHOR_DETAIL, {
    params: { roomId },
  } as Parameters<typeof getRequest>[1])
    .then((res) => (res ? { match: res.match ?? null, chatAnnouncement: [] } : EMPTY))
    .catch(() => EMPTY)
}

interface MatchLiveOptions {
  /** liveType=2 + anchorLiveId → API trả stream của anchor cụ thể */
  liveType?: number
  anchorLiveId?: number
}

/** Fetch theo matchId + gameId — dùng cho route /truc-tiep/[id] */
export function fetchMatchLiveData(
  matchId: string,
  gameId: number,
  options: MatchLiveOptions = {}
): Promise<LivePageDataInterface> {
  const params: Record<string, unknown> = {}
  if (options.liveType === 2 && options.anchorLiveId) {
    params.type = 2
    params.anchorLiveId = options.anchorLiveId
  }

  return getRequest<LiveMatchInterface>(LIVE_API.MATCH_DETAIL(matchId, gameId), {
    params,
  } as Parameters<typeof getRequest>[1])
    .then((res) => (res ? { match: res, chatAnnouncement: [] } : EMPTY))
    .catch(() => EMPTY)
}
