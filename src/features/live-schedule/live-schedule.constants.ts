import { LiveScheduleTabEnum } from "@/features/live-schedule/live-schedule.enums"

const LIVE_SCHEDULE_TAB_PARAM: string = "live_tab"
const LIVE_SCHEDULE_DEFAULT_TAB: LiveScheduleTabEnum = LiveScheduleTabEnum.ALL

const LIVE_SCHEDULE_FILTER_OPTIONS = [
  { value: LiveScheduleTabEnum.ALL, typeScreen: 0, labelKey: "common.live-page.filter-all" },
  { value: LiveScheduleTabEnum.HOT, typeScreen: 1, labelKey: "common.live-page.filter-hot" },
  { value: LiveScheduleTabEnum.LIVE, typeScreen: 2, labelKey: "common.live-page.filter-live" },
  { value: LiveScheduleTabEnum.TV, typeScreen: 3, labelKey: "common.live-page.filter-tv" },
] as const

export type LiveScheduleTab = LiveScheduleTabEnum

export {
  LiveScheduleTabEnum,
  LIVE_SCHEDULE_TAB_PARAM,
  LIVE_SCHEDULE_DEFAULT_TAB,
  LIVE_SCHEDULE_FILTER_OPTIONS,
}
