/**
 * HTTP client cho browser — dùng trong Client Components.
 *
 * Interface tương tự server/services/request nhưng:
 * - Không dùng axios / assertServerEnv
 * - Gọi tới Next.js API routes (cùng origin → không cần Origin/Referer)
 * - Luôn resolve, không throw
 */

async function clientRequest<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init)
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
