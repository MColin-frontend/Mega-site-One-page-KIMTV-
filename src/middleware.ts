import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { DEFAULT_LOCALE, LOCALES, type LocaleType } from "@/i18n/config"
import { SLUG_TO_VI } from "@/i18n/slug-map"

/**
 * 1. Đọc locale từ pathname [/vi/..., /en/...] và ghi vào header `x-locale`.
 * 2. Rewrite slug đã localize về slug canonical vi để Next.js routing hoạt động.
 *    Ví dụ: /en/news/123 → rewrite nội bộ thành /en/tin-tuc/123.
 *    URL hiển thị trên browser vẫn là /en/news/123 (transparent rewrite).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segments = pathname.split("/")
  const segment = segments[1]
  const locale = LOCALES.includes(segment as (typeof LOCALES)[number]) ? segment : DEFAULT_LOCALE

  // Rewrite localized slug → vi canonical (chỉ khi locale khác vi)
  if (locale !== DEFAULT_LOCALE && segments[2]) {
    const localSlug = segments[2]
    const viSlug = SLUG_TO_VI[locale as Exclude<LocaleType, typeof DEFAULT_LOCALE>]?.[localSlug]
    if (viSlug && viSlug !== localSlug) {
      const rest = segments.slice(3).join("/")
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}/${viSlug}${rest ? `/${rest}` : ""}`
      const rewriteRes = NextResponse.rewrite(url)
      rewriteRes.headers.set("x-locale", locale)
      return rewriteRes
    }
  }

  const response = NextResponse.next()
  response.headers.set("x-locale", locale)
  return response
}

export const config = {
  matcher: [
    // Bỏ qua _next/static, _next/image, favicon, api
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
}
