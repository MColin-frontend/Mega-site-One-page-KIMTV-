/**
 * Headers bắt buộc khi gọi KimTV Java API.
 * Khớp KIMTV-PC axios interceptor + nuxt proxy onProxyReq.
 *
 * Browser (localhost) → /java/* → Next.js proxy → kimtv.net/java/*
 * Proxy PHẢI giả lập Origin/Referer/Cookie như request từ kimtv.net,
 * không forward Origin/Referer localhost của browser.
 */

export const KIMTV_API_HEADERS = {
  Accept: "application/json, text/plain, */*",
  lan: "vi",
  sysType: "PC",
} as const

/** Referer mặc định khi gọi API video/social — khớp curl từ /videos/hot. */
export const KIMTV_DEFAULT_REFERER_PATH = "/videos/hot"

/** Headers gửi từ browser tới Next.js proxy (/java/* hoặc /api/*). */
export function buildKimtvClientHeaders(token?: string | null): Record<string, string> {
  return {
    ...KIMTV_API_HEADERS,
    ...(token ? { token } : {}),
  }
}

interface KimtvBackendHeaderOptions {
  apiOrigin: string
  token?: string | null
  /** Path trên kimtv.net, vd. `/videos/hot`. */
  refererPath?: string
  /** Cookie auth forward tới backend (token, userInfo, lang). */
  cookieHeader?: string | null
}

/**
 * Headers server → kimtv.net/java/*.
 * Giống KIMTV-PC nuxt proxy: changeOrigin + set Origin/Referer = pcUrl.
 */
export function buildKimtvBackendHeaders(
  options: KimtvBackendHeaderOptions
): Record<string, string> {
  const origin = options.apiOrigin.replace(/\/$/, "")
  const path = options.refererPath ?? KIMTV_DEFAULT_REFERER_PATH
  const referer = path.startsWith("http")
    ? path
    : `${origin}${path.startsWith("/") ? path : `/${path}`}`

  return {
    ...KIMTV_API_HEADERS,
    Origin: origin,
    Referer: referer,
    ...(options.token ? { token: options.token } : {}),
    ...(options.cookieHeader ? { Cookie: options.cookieHeader } : {}),
  }
}

/** Gom cookie auth từ browser request để forward sang backend (khớp curl -b). */
export function buildKimtvAuthCookieHeader(cookies: {
  get: (name: string) => { value: string } | undefined
}): string | undefined {
  const parts: string[] = []

  const lang = cookies.get("lang")?.value ?? "vi"
  parts.push(`lang=${lang}`)

  const token = cookies.get("token")?.value
  if (token) parts.push(`token=${token}`)

  const userInfo = cookies.get("userInfo")?.value
  if (userInfo) {
    // Next.js trả decoded value — encode lại cho Cookie header giống browser.
    parts.push(`userInfo=${encodeURIComponent(userInfo)}`)
  }

  return parts.length ? parts.join("; ") : undefined
}
