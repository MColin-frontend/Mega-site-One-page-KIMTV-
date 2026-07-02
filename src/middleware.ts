import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config"

/**
 * Đọc locale từ pathname [/vi/..., /en/...] và ghi vào header `x-locale`.
 * Server components đọc qua getLocale() — không cần truyền prop lang.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segment = pathname.split("/")[1]
  const locale = LOCALES.includes(segment as (typeof LOCALES)[number]) ? segment : DEFAULT_LOCALE

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
