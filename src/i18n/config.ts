export const LOCALES = ["vi", "en"] as const
export type LocaleType = (typeof LOCALES)[number]
export type NonViLocale = Exclude<LocaleType, "vi">
export const DEFAULT_LOCALE: LocaleType = "vi"
