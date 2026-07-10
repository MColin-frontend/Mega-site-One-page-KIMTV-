export const LIVE_SCHEDULE_TAB_PARAM = "live_tab"

export const LIVE_SCHEDULE_DEFAULT_TAB = "all"

export const LIVE_SCHEDULE_FILTER_OPTIONS = [
  { value: "all", typeScreen: 0, labelKey: "common.live-page.filter-all" },
  { value: "hot", typeScreen: 1, labelKey: "common.live-page.filter-hot" },
  { value: "live", typeScreen: 2, labelKey: "common.live-page.filter-live" },
  { value: "tv", typeScreen: 3, labelKey: "common.live-page.filter-tv" },
] as const

export type LiveScheduleTab = (typeof LIVE_SCHEDULE_FILTER_OPTIONS)[number]["value"]
