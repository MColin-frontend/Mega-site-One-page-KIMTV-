import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { DEFAULT_LOCALE, LOCALES, SLUG_TO_VI, type NonViLocale } from "@/i18n"

function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value
  if (cookie && LOCALES.includes(cookie as never)) return cookie

  const acceptLang = request.headers.get("accept-language") ?? ""
  for (const locale of LOCALES) {
    if (acceptLang.toLowerCase().includes(locale)) return locale
  }
  return DEFAULT_LOCALE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  const pathnameLocale = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  // Không có locale → redirect
  if (!pathnameLocale) {
    const locale = detectLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
  }

  // Non-vi locale: rewrite localized slug → vi canonical slug
  if (pathnameLocale !== "vi") {
    const afterLocale = pathname.slice(`/${pathnameLocale}`.length)
    const segments = afterLocale.split("/").filter(Boolean)

    if (segments.length > 0) {
      const localSlug = segments[0]
      const viSlug = SLUG_TO_VI[pathnameLocale as NonViLocale]?.[localSlug]

      if (viSlug && viSlug !== localSlug) {
        const rest = segments.slice(1).join("/")
        request.nextUrl.pathname = `/${pathnameLocale}/${viSlug}${rest ? `/${rest}` : ""}`
        return NextResponse.rewrite(request.nextUrl)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
}
