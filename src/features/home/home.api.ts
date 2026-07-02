import { getRequest } from "@/server/services/request"

import { FOOTBALL_GAME_ID, MATCH_STATUS_TAB } from "@/constants/component/home.constants"
import { DateRangeEnum } from "@/enums/common.enum"
import type {
  ApiConfig,
  FeaturedNewsResult,
  LatestNewsResult,
  LeagueApiResult,
  NewsItem,
} from "@/models/home.models"

export type { ApiConfig, NewsItem, LeagueApiItem, LeagueApiResult } from "@/models/home.models"

export const HOME_API = {
  /** Danh sách giải đấu theo ngày/option */
  MATCH_LEAGUES: "/league/v2/match-leagues",
  /** Trận đang live (today) */
  MATCH_SCHEDULE: "/v2/match/get-pc-game-match-by-condition",
  /** Tất cả / sắp / kết thúc — body: { date, gameId, leagueIds, option, page, lot } */
  MATCH_H5_LIST: "/sports-match-h5/list",
  /** Ngày mai */
  MATCH_UPCOMING: "/v2/match/get-pc-upcoming-game-match",
  /** Hôm qua */
  MATCH_PAST: "/v2/match/get-pc-past-game-match",
  /** Tin tức nổi bật theo game */
  NEWS_FEATURED: "/news/featured-by-game",
  /** Tin mới nhất theo tab (tabType=0: tất cả) */
  NEWS_LATEST: "/v4/0/new/1",
} as const

const H5_OPTION: Partial<Record<string, number>> = {
  [MATCH_STATUS_TAB.ALL]: 1,
  [MATCH_STATUS_TAB.UPCOMING]: 1,
  [MATCH_STATUS_TAB.FINISHED]: 2,
}

/**
 * Chọn endpoint + method + body phù hợp.
 *
 * @param statusFilter  Giá trị filter hiện tại ("all" | "live" | "upcoming" | "finished")
 * @param date          DateRangeEnum (yesterday/tomorrow) hoặc null (today)
 * @param pickedDateTs  Unix timestamp (giây) của ngày đang xem — dùng cho h5 list
 */
function getApiConfig(
  statusFilter: string,
  pickedDateTs: number,
  leagueIds: number[] = []
): ApiConfig {
  if (statusFilter === MATCH_STATUS_TAB.LIVE) {
    return {
      endpoint: HOME_API.MATCH_SCHEDULE,
      method: "POST",
      params: { gameId: [] },
      paginate: false,
    }
  }

  return {
    endpoint: HOME_API.MATCH_H5_LIST,
    method: "POST",
    params: {
      date: pickedDateTs,
      gameId: FOOTBALL_GAME_ID,
      leagueIds: leagueIds.length > 0 ? leagueIds.join(",") : "",
      option: H5_OPTION[statusFilter] ?? 1,
      lot: null,
    },
  }
}

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

async function fetchLeaguesAction(gameId = FOOTBALL_GAME_ID, option = 1): Promise<LeagueApiResult> {
  const empty: LeagueApiResult = { hotLeagus: [], moreLeagus: [] }
  try {
    const time = Math.floor(Date.now() / 1000)
    const res = await getRequest<LeagueApiResult>(
      `${HOME_API.MATCH_LEAGUES}?gameId=${gameId}&time=${time}&option=${option}`
    )
    if (!res.success || !res.data) return empty
    return res.data
  } catch {
    return empty
  }
}

function getEndpointByDate(date: string | null): string {
  switch (date) {
    case DateRangeEnum.YESTERDAY:
      return HOME_API.MATCH_PAST
    case DateRangeEnum.TOMORROW:
      return HOME_API.MATCH_UPCOMING
    default:
      return HOME_API.MATCH_SCHEDULE
  }
}

export {
  fetchLatestNewsAction,
  fetchLatestNewsListAction,
  fetchFeaturedNewsAction,
  fetchLeaguesAction,
  getApiConfig,
  getEndpointByDate,
}
