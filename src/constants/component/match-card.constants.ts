import icCornerFlag from "@assets/icons/match/ic-corner-flag.svg"
import icFootball from "@assets/icons/match/ic-football.png"
import icRedCardV2 from "@assets/icons/match/ic-red-card-v2.svg"
import icYellowCardV2 from "@assets/icons/match/ic-yellow-card-v2.svg"

/** Map halfLabel → i18n key dùng với t() */
export const MATCH_HALF_LABEL_I18N_KEY: Record<string, string> = {
  H1: "common.match-card.period.h1",
  HT: "common.match-card.period.ht",
  H2: "common.match-card.period.h2",
  ET: "common.match-card.period.et",
  PEN: "common.match-card.period.pen",
  LIVE: "common.match-card.period.live",
} as const

/** Fallback string khi không có i18n (tương thích ngược) */
export const MATCH_HALF_LABEL_VI: Record<string, string> = {
  H1: "Hiệp 1",
  HT: "Giữa hiệp",
  H2: "Hiệp 2",
  ET: "Hiệp phụ",
  PEN: "Luân lưu",
  LIVE: "Đang diễn ra",
} as const

export const MATCH_STAT_I18N_KEYS = {
  shots: "common.match-card.stats.shots",
  yellowCard: "common.match-card.stats.yellowCard",
  redCard: "common.match-card.stats.redCard",
  corner: "common.match-card.stats.corner",
} as const

export const COUNTDOWN_I18N_KEYS = {
  hours: "common.match-card.hours",
  minutes: "common.match-card.minutes",
  seconds: "common.match-card.seconds",
} as const

export const MATCH_CARD_I18N_KEYS = {
  finished: "common.match-card.finished",
  blvLabel: "common.match-card.blv-label",
  watching: "common.match-card.watching",
  watchingTooltip: "common.match-card.watching-tooltip",
} as const

export const MATCH_STAT_ICONS = {
  football: icFootball,
  yellowCard: icYellowCardV2,
  redCard: icRedCardV2,
  cornerFlag: icCornerFlag,
} as const

/** Config tĩnh cho từng stat — icon + alt + i18n key */
export const MATCH_STAT_CONFIG = [
  { icon: icFootball, alt: "ball", labelKey: MATCH_STAT_I18N_KEYS.shots },
  { icon: icYellowCardV2, alt: "yellow", labelKey: MATCH_STAT_I18N_KEYS.yellowCard },
  { icon: icRedCardV2, alt: "red", labelKey: MATCH_STAT_I18N_KEYS.redCard },
  { icon: icCornerFlag, alt: "corner", labelKey: MATCH_STAT_I18N_KEYS.corner },
] as const
