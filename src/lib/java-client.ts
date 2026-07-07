/**
 * Browser client gọi backend KimTV qua proxy `/java/*` (cùng pattern KIMTV-PC).
 * Response giữ nguyên envelope `{ status, result, ... }` từ Java backend.
 *
 * Curl tham chiếu (kimtv.net):
 *   GET /java/user/follow-user?isFollow=true&userId=1070
 *   Headers: token, lan, sysType
 */

import { getTokenFromCookie } from "@/lib/auth-cookie"
import { buildKimtvClientHeaders } from "@/lib/kimtv-headers"

import type { ApiEnvelopeInterface } from "@/models/request.models"

type JavaParams = Record<string, string | number | boolean | null | undefined>

function buildSearchParams(params?: JavaParams): string {
  const qs = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value != null) qs.set(key, String(value))
    }
  }
  return qs.toString()
}

function javaHeaders(): HeadersInit {
  return buildKimtvClientHeaders(getTokenFromCookie())
}

export function isJavaSuccess(res: ApiEnvelopeInterface<unknown> | null): boolean {
  return res?.status === "success"
}

export function getJavaErrorMessage(res: ApiEnvelopeInterface<unknown> | null): string | null {
  if (!res || res.status === "success") return null
  return res.errorMsg ?? res.message ?? null
}

export async function javaGet<T = unknown>(
  path: string,
  params?: JavaParams
): Promise<ApiEnvelopeInterface<T> | null> {
  const pathNorm = path.startsWith("/") ? path : `/${path}`
  const qs = buildSearchParams(params)
  try {
    const res = await fetch(`/java${pathNorm}${qs ? `?${qs}` : ""}`, {
      method: "GET",
      headers: javaHeaders(),
      credentials: "include",
    })
    if (!res.ok) return null
    return (await res.json()) as ApiEnvelopeInterface<T>
  } catch {
    return null
  }
}

/** Follow / unfollow — giống KIMTV-PC `Api.followUser`: isFollow + userId, token trong header. */
export async function followUser(params: {
  isFollow: boolean
  userId: string | number
}): Promise<ApiEnvelopeInterface<unknown> | null> {
  return javaGet("/user/follow-user", params)
}
