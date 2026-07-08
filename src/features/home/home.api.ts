import { getRequest, postRequest } from "@/server/services/request"
import { MATCH_API } from "@/lib/match.utils"

import { env } from "@/config/env"
import { FOOTBALL_GAME_ID } from "@/constants/component/home.constants"
import { DateRangeEnum } from "@/enums/common.enum"
import type {
  FeaturedNewsResult,
  LatestNewsResult,
  NewsItem,
  PopularNewsResult,
} from "@/models/home.models"

import type { LiveMatch } from "@/features/home/components/hero-video"

export type { ApiConfig, NewsItem, LeagueApiItem, LeagueApiResult } from "@/models/home.models"

export const HOME_API = {
  MATCH_LEAGUES: "/league/v2/match-leagues",
  MATCH_UPCOMING: "/v2/match/get-pc-upcoming-game-match",
  MATCH_PAST: "/v2/match/get-pc-past-game-match",
  NEWS_FEATURED: "/news/featured-by-game",
  NEWS_POPULAR: "/news/get-popular-news-by-game",
  NEWS_LATEST: "/v4/0/new/1",
} as const

async function fetchLatestNewsAction(): Promise<NewsItem | null> {
  try {
    const res = await getRequest<LatestNewsResult>(
      `${HOME_API.NEWS_LATEST}?tabType=0&type=new&pageIndex=1`
    )
    if (!res.success || !res.data) return null
    return res.data.records?.[0] ?? null
  } catch (err) {
    console.error("fetchLatestNewsAction error:", err)
    return null
  }
}

async function fetchLatestNewsListAction(limit = 5): Promise<NewsItem[]> {
  try {
    const res = await getRequest<LatestNewsResult>(
      `${HOME_API.NEWS_LATEST}?tabType=0&type=new&pageIndex=1`
    )
    if (!res.success || !res.data) return []
    return (res.data.records ?? []).slice(0, limit)
  } catch (err) {
    console.error("fetchLatestNewsListAction error:", err)
    return []
  }
}

async function fetchFeaturedNewsAction(gameIds = FOOTBALL_GAME_ID): Promise<NewsItem[]> {
  try {
    const res = await getRequest<FeaturedNewsResult>(`${HOME_API.NEWS_FEATURED}?gameIds=${gameIds}`)
    if (!res.success || !res.data) return []
    return res.data.news ?? []
  } catch (err) {
    console.error("fetchFeaturedNewsAction error:", err)
    return []
  }
}

function getEndpointByDate(date: string | null): string {
  switch (date) {
    case DateRangeEnum.YESTERDAY:
      return HOME_API.MATCH_PAST
    case DateRangeEnum.TOMORROW:
      return HOME_API.MATCH_UPCOMING
    default:
      return MATCH_API.LIVE
  }
}

async function fetchLiveMatchesAction(): Promise<LiveMatch[]> {
  try {
    const res = await postRequest<unknown[]>(MATCH_API.LIVE, { gameId: [] })
    if (!res.success || !Array.isArray(res.data)) return []

    return res.data
      .map((raw) => {
        const m = raw as Record<string, unknown>
        const liveUrls = (m.liveUrls as { liveUrl?: string; liveUrlFlv?: string }[] | null) ?? []

        const wrapUrl = (raw: string) =>
          env.isDev ? `/api/stream?url=${encodeURIComponent(raw)}` : raw

        const sources = liveUrls.flatMap((u, i) => {
          const result = []
          if (u.liveUrl) result.push({ url: wrapUrl(u.liveUrl), name: `Nguồn ${i + 1} HLS` })
          if (u.liveUrlFlv) result.push({ url: wrapUrl(u.liveUrlFlv), name: `Nguồn ${i + 1} FLV` })
          return result
        })

        if (sources.length === 0) return null

        return {
          id: m.matchId as number,
          chatroomId: m.matchId as number,
          gameId: (m.gameId as number) ?? 0,
          homeTeam: {
            name: (m.homeName as string) ?? "",
            logo: (m.homeLogo as string) ?? "",
          },
          awayTeam: {
            name: (m.awayName as string) ?? "",
            logo: (m.awayLogo as string) ?? "",
          },
          homeScore: (m.homeScore as number) ?? undefined,
          awayScore: (m.awayScore as number) ?? undefined,
          period: (m.gameTime as number) ?? undefined,
          state: (m.state as number) ?? null,
          startTime: (m.startTime as number) ?? null,
          leagueName: (m.leagueName as string) ?? undefined,
          leagueLogo: (m.leagueLogo as string) ?? undefined,
          homeCornerKick: (m.homeCornerKick as number) ?? undefined,
          awayCornerKick: (m.awayCornerKick as number) ?? undefined,
          homeYellowCard: (m.homeYellowCard as number) ?? undefined,
          awayYellowCard: (m.awayYellowCard as number) ?? undefined,
          homeRedCard: (m.homeRedCard as number) ?? undefined,
          awayRedCard: (m.awayRedCard as number) ?? undefined,
          anchors: ((m.anchorRoomVos as { userAvatar: string; userName: string }[]) ?? [])
            .slice(0, 3)
            .map((a) => ({ userAvatar: a.userAvatar, userName: a.userName })),
          sources,
        } satisfies LiveMatch
      })
      .filter(Boolean) as LiveMatch[]
  } catch {
    return []
  }
}

async function fetchPopularNewsAction(gameIds = FOOTBALL_GAME_ID): Promise<NewsItem[]> {
  try {
    const res = await getRequest<PopularNewsResult>(`${HOME_API.NEWS_POPULAR}?gameIds=${gameIds}`)
    if (!res.success || !res.data) return []
    return res.data.videos ?? []
  } catch (err) {
    console.error("fetchPopularNewsAction error:", err)
    return []
  }
}

export {
  fetchLatestNewsAction,
  fetchLatestNewsListAction,
  fetchFeaturedNewsAction,
  fetchPopularNewsAction,
  fetchLiveMatchesAction,
  getEndpointByDate,
}
