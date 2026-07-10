import { MATCH_API } from "@/lib/match.utils"

import { HOME_API } from "@/features/home/home.api"

export const LIVE_MATCH_TYPE = {
  LIVE: "live",
  UPCOMING: "upcoming",
  FINISHED: "finished",
} as const

export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
} as const

export const MATCH_QUERY_PARAMS = {
  ALL_GAMES: { gameId: [] },
} as const

export const LIVE_SECTION_CONFIG = {
  LIVE: {
    endpoint: MATCH_API.LIVE,
    method: HTTP_METHOD.POST,
    params: MATCH_QUERY_PARAMS.ALL_GAMES,
    matchType: LIVE_MATCH_TYPE.LIVE,
    i18nKey: "common.live-page.live-section",
  },
  UPCOMING: {
    endpoint: HOME_API.MATCH_UPCOMING,
    method: HTTP_METHOD.POST,
    params: MATCH_QUERY_PARAMS.ALL_GAMES,
    matchType: LIVE_MATCH_TYPE.UPCOMING,
    i18nKey: "common.live-page.upcoming-section",
  },
} as const
