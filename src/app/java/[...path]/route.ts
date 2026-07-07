import { NextRequest, NextResponse } from "next/server"

import { httpClient } from "@/server/services/request"
import {
  buildKimtvAuthCookieHeader,
  buildKimtvBackendHeaders,
  KIMTV_DEFAULT_REFERER_PATH,
} from "@/lib/kimtv-headers"

import { assertServerEnv, env } from "@/config/env"

type RouteContext = { params: Promise<{ path: string[] }> }

/**
 * Proxy /java/* → {API_BASE_URL}/*
 *
 * Browser chỉ thấy localhost:3000/java/... nhưng server forward tới kimtv.net
 * với Origin/Referer/Cookie giả lập như KIMTV-PC nuxt proxy (changeOrigin).
 */
async function proxyToJava(req: NextRequest, context: RouteContext) {
  assertServerEnv()

  const { path } = await context.params
  const backendPath = `/${path.join("/")}`
  const params = Object.fromEntries(req.nextUrl.searchParams.entries())
  delete params._t

  const token = req.headers.get("token") ?? req.cookies.get("token")?.value ?? ""
  const cookieHeader = buildKimtvAuthCookieHeader(req.cookies)

  const headers = buildKimtvBackendHeaders({
    apiOrigin: env.apiOrigin,
    token: token || null,
    refererPath: KIMTV_DEFAULT_REFERER_PATH,
    cookieHeader,
  })

  if (env.isDev) {
    console.log("[java proxy → backend]", `${env.apiBaseUrl}${backendPath}`, {
      origin: headers.Origin,
      referer: headers.Referer,
      hasToken: Boolean(token),
      hasUserInfo: Boolean(req.cookies.get("userInfo")?.value),
      hasCookieHeader: Boolean(cookieHeader),
    })
  }

  try {
    let data: unknown
    if (req.method !== "GET" && req.method !== "HEAD") {
      const raw = await req.text()
      data = raw ? JSON.parse(raw) : undefined
    }

    const res = await httpClient.request({
      method: req.method,
      url: backendPath,
      params,
      data,
      headers,
    })

    return NextResponse.json(res.data)
  } catch (error) {
    if (env.isDev) {
      console.error("[java proxy] backend error:", backendPath, error)
    }
    return NextResponse.json(
      { status: "fail", errorMsg: "Backend unavailable", result: null },
      { status: 502 }
    )
  }
}

export const GET = proxyToJava
export const POST = proxyToJava
export const PUT = proxyToJava
export const PATCH = proxyToJava
export const DELETE = proxyToJava
