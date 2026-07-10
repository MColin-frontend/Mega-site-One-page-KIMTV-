import { HTTP_METHOD, LIVE_MATCH_TYPE, MATCH_API, MATCH_QUERY_PARAMS } from "@/lib/match.utils"

import { HOME_API } from "@/features/home/home.api"

export { HTTP_METHOD, LIVE_MATCH_TYPE, MATCH_QUERY_PARAMS }

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
  FINISHED: {
    endpoint: HOME_API.MATCH_PAST,
    method: HTTP_METHOD.POST,
    params: MATCH_QUERY_PARAMS.ALL_GAMES,
    matchType: LIVE_MATCH_TYPE.FINISHED,
    i18nKey: "common.live-page.finished-section",
  },
} as const
