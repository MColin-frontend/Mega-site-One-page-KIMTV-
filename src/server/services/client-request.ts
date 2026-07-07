/**
 * Client-side HTTP helpers — mirror API của server/services/request.ts
 * nhưng dùng browser fetch, không import server-only modules.
 *
 * Luôn resolve, không throw — return { success, data, httpStatus }.
 */

import { buildKimtvClientHeaders } from "@/lib/kimtv-headers"

import { toast } from "@/components/ui/toast"

export interface ClientRequestResult<T> {
  success: boolean
  data: T | null
  httpStatus: number
}

export interface ClientRequestOptions extends RequestInit {
  isMessageSuccess?: boolean
  isMessageError?: boolean
  messageSuccess?: string
  messageError?: string
}

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
  Accept: "application/json",
}

function getTokenFromCookie(): string {
  if (typeof document === "undefined") return ""
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ""
}

function kimtvHeaders(token: string): HeadersInit {
  return {
    ...DEFAULT_HEADERS,
    ...buildKimtvClientHeaders(token || null),
  }
}

async function request<T>(
  url: string,
  options: ClientRequestOptions = {}
): Promise<ClientRequestResult<T>> {
  const { isMessageError, messageSuccess, messageError, ...fetchOptions } = options
  const token = getTokenFromCookie()
  try {
    const res = await fetch(url, {
      ...fetchOptions,
      credentials: "include",
      headers: { ...kimtvHeaders(token), ...fetchOptions.headers },
    })
    const httpStatus = res.status

    if (!res.ok) {
      const errMsg = messageError ?? "Yêu cầu thất bại"
      if (isMessageError) toast.error(errMsg)
      return { success: false, data: null, httpStatus }
    }

    const data = (await res.json()) as T
    if (messageSuccess) toast.success(messageSuccess)
    return { success: true, data, httpStatus }
  } catch {
    const errMsg = messageError ?? "Đã xảy ra lỗi, vui lòng thử lại"
    if (isMessageError) toast.error(errMsg)
    return { success: false, data: null, httpStatus: 0 }
  }
}

export function clientGet<T>(
  url: string,
  options?: ClientRequestOptions
): Promise<ClientRequestResult<T>> {
  return request<T>(url, { ...options, method: "GET" })
}

export function clientPost<T>(
  url: string,
  body: unknown,
  options?: ClientRequestOptions
): Promise<ClientRequestResult<T>> {
  return request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) })
}

export function clientDelete<T>(
  url: string,
  options?: ClientRequestOptions
): Promise<ClientRequestResult<T>> {
  return request<T>(url, { ...options, method: "DELETE" })
}
