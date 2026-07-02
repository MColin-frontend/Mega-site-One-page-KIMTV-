import "server-only"

import { headers } from "next/headers"

import { DEFAULT_LOCALE, LOCALES, type LocaleType } from "./config"
import { getDictionary } from "./index"
import type { TranslationKey } from "./use-translation"

/**
 * Đọc locale hiện tại trong Server Component / Server Action / Route Handler.
 * Middleware đã set header `x-locale` từ pathname → không cần truyền prop lang.
 */
export async function getLocale(): Promise<LocaleType> {
  const headersList = await headers()
  const locale = headersList.get("x-locale") ?? DEFAULT_LOCALE
  return LOCALES.includes(locale as LocaleType) ? (locale as LocaleType) : DEFAULT_LOCALE
}

/** Server-side equivalent của useTranslation() — dùng trong Server Component. */
export async function getTranslation() {
  const locale = await getLocale()
  const dict = await getDictionary(locale)

  function t(key: TranslationKey): string {
    const value = key.split(".").reduce<unknown>((obj, k) => {
      return (obj as Record<string, unknown>)?.[k]
    }, dict)
    return typeof value === "string" ? value : key
  }

  return { t, locale, dict }
}
