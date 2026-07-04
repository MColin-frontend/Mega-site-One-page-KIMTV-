import { DEFAULT_LOCALE, type LocaleType } from "@/i18n"

import { getRoutes } from "./routes"

export interface NavItemInterface {
  label: string
  href: string
}

/**
 * Thêm ngôn ngữ mới: thêm key vào mỗi object trong NAV_LABELS
 * Nếu thiếu → tự fallback về DEFAULT_LOCALE (vi)
 */
const NAV_LABELS: Record<string, Partial<Record<LocaleType, string>>> = {
  home: { vi: "Trang chủ", en: "Home" },
  schedule: { vi: "Lịch thi đấu", en: "Schedule" },
  liveScore: { vi: "Tỉ số trực tuyến", en: "Live Score" },
  results: { vi: "Kết quả", en: "Results" },
  standings: { vi: "BXH", en: "Standings" },
  news: { vi: "Tin tức", en: "News" },
  video: { vi: "Video", en: "Video" },
  data: { vi: "Dữ liệu", en: "Data" },
}

function t(key: string, locale: LocaleType): string {
  return NAV_LABELS[key]?.[locale] ?? NAV_LABELS[key]?.[DEFAULT_LOCALE] ?? key
}

export function getMainNav(locale: LocaleType): NavItemInterface[] {
  const routes = getRoutes(locale)
  return [
    { label: t("home", locale), href: routes.home },
    { label: t("schedule", locale), href: routes.schedule },
    { label: t("liveScore", locale), href: routes.liveScore },
    { label: t("results", locale), href: routes.results },
    { label: t("standings", locale), href: routes.standings },
    { label: t("news", locale), href: routes.news.index },
    { label: t("video", locale), href: routes.video.index },
    { label: t("data", locale), href: routes.data },
  ]
}
