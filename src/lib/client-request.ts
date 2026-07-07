/**
 * HTTP client cho browser — dùng trong Client Components.
 *
 * Interface tương tự server/services/request nhưng:
 * - Không dùng axios / assertServerEnv
 * - Gọi tới Next.js API routes (cùng origin → không cần Origin/Referer)
 * - Luôn resolve, không throw
 */

import { getTokenFromCookie } from "@/lib/auth-cookie"
import { buildKimtvClientHeaders } from "@/lib/kimtv-headers"

function kimtvFetchInit(init?: RequestInit): RequestInit {
  const token = getTokenFromCookie()
  return {
    ...init,
    credentials: "include",
    headers: {
      ...buildKimtvClientHeaders(token),
      ...(init?.headers as Record<string, string> | undefined),
    },
  }
}

async function clientRequest<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, kimtvFetchInit(init))
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function clientGet<T>(url: string): Promise<T | null> {
  return clientRequest<T>(url)
}

export function clientPost<T>(url: string, body: unknown): Promise<T | null> {
  return clientRequest<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export function clientDelete<T>(url: string): Promise<T | null> {
  return clientRequest<T>(url, { method: "DELETE" })
}
