import { localePath, type LocaleType } from "@/i18n"

export const getRoutes = (locale: LocaleType) => ({
  home: `/${locale}`,
  schedule: localePath(locale, "lich-thi-dau"),
  liveScore: localePath(locale, "ti-so-truc-tuyen"),
  liveSchedule: localePath(locale, "live-schedule"),
  results: localePath(locale, "ket-qua"),
  standings: localePath(locale, "bxh"),
  news: {
    index: localePath(locale, "tin-tuc"),
    article: (slug: string) => localePath(locale, "tin-tuc", slug),
  },
  video: {
    index: localePath(locale, "video"),
    article: (slug: string) => localePath(locale, "video", slug),
  },
  data: localePath(locale, "du-lieu"),
  auth: {
    login: localePath(locale, "dang-nhap"),
    register: localePath(locale, "dang-ky"),
  },
  inviteFriend: localePath(locale, "moi-ban"),
})

export type Routes = ReturnType<typeof getRoutes>
