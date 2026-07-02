import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"

import { env } from "@/config/env"
import type {
  ApiEnvelopeInterface,
  NormalizedErrorInterface,
  RequestOptionsInterface,
  RequestResultInterface,
} from "@/models/request.models"

/**
 * HTTP client (axios) gọi backend KimTV (Java) — CHỈ chạy trên server.
 *
 * Vì sao server-only:
 * - Backend/Cloudflare kiểm tra `Origin`/`Referer` → browser cấm set các header này.
 * - Gọi thẳng từ browser sẽ dính CORS (khác origin với kimtv.net).
 * → Mọi request đi qua Server Component / Route Handler / Server Action.
 *
 * Helper tái sử dụng (LUÔN return result, không throw):
 *   getRequest / postRequest / putRequest / patchRequest / deleteRequest
 */

const DEFAULT_HEADERS: Readonly<Record<string, string>> = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
  lan: "vi",
  sysType: "PC",
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  // Timeout chuẩn: tính cả thời gian chờ phản hồi, hủy nếu quá hạn.
  timeout: env.apiTimeoutMs,
  timeoutErrorMessage: `Request timeout sau ${env.apiTimeoutMs}ms`,
  headers: {
    ...DEFAULT_HEADERS,
    Origin: env.apiOrigin,
    Referer: `${env.apiOrigin}/`,
  },
})

// Cache-buster `_t` trên mọi request (giống FE gốc).
httpClient.interceptors.request.use((config) => {
  config.params = { ...config.params, _t: Date.now() }
  return config
})

function normalizeError(error: unknown): NormalizedErrorInterface {
  if (error instanceof AxiosError) {
    // Timeout: axios set code ECONNABORTED hoặc ETIMEDOUT.
    if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
      return { message: error.message, httpStatus: 408, errorCode: null }
    }
    // Có response từ server (4xx/5xx).
    if (error.response) {
      const envelope = error.response.data as Partial<ApiEnvelopeInterface<unknown>> | undefined
      return {
        message: envelope?.errorMsg ?? envelope?.message ?? error.message,
        httpStatus: error.response.status,
        errorCode: envelope?.errorCode ?? null,
      }
    }
    // Không kết nối được (DNS, refused, network down).
    return { message: error.message, httpStatus: 0, errorCode: null }
  }
  return { message: "Unknown request error", httpStatus: 0, errorCode: null }
}

/** Lõi chung: gọi axios và gói thành RequestResultInterface, không throw. */
async function request<T>(
  config: AxiosRequestConfig,
  options: RequestOptionsInterface = {}
): Promise<RequestResultInterface<T>> {
  const { successMessage, errorMessage, showSuccess = false, showError = true } = options

  try {
    const res = await httpClient.request<ApiEnvelopeInterface<T>>(config)
    const envelope = res.data

    // Backend trả 200 nhưng status !== success → coi là lỗi nghiệp vụ.
    if (envelope?.status !== "success") {
      const serverMsg = envelope?.errorMsg ?? envelope?.message ?? "Yêu cầu thất bại"
      return {
        success: false,
        data: null,
        message: showError ? (errorMessage ?? serverMsg) : null,
        errorCode: envelope?.errorCode ?? null,
        httpStatus: res.status,
      }
    }

    return {
      success: true,
      data: envelope.result,
      message: showSuccess ? (successMessage ?? null) : null,
      errorCode: null,
      httpStatus: res.status,
    }
  } catch (error) {
    const normalized = normalizeError(error)
    return {
      success: false,
      data: null,
      message: showError ? (errorMessage ?? normalized.message) : null,
      errorCode: normalized.errorCode,
      httpStatus: normalized.httpStatus,
    }
  }
}

export function getRequest<T>(
  path: string,
  options?: RequestOptionsInterface
): Promise<RequestResultInterface<T>> {
  return request<T>({ ...options, method: "GET", url: path }, options)
}

export function postRequest<T>(
  path: string,
  body?: unknown,
  options?: RequestOptionsInterface
): Promise<RequestResultInterface<T>> {
  return request<T>({ ...options, method: "POST", url: path, data: body }, options)
}

export function putRequest<T>(
  path: string,
  body?: unknown,
  options?: RequestOptionsInterface
): Promise<RequestResultInterface<T>> {
  return request<T>({ ...options, method: "PUT", url: path, data: body }, options)
}

export function patchRequest<T>(
  path: string,
  body?: unknown,
  options?: RequestOptionsInterface
): Promise<RequestResultInterface<T>> {
  return request<T>({ ...options, method: "PATCH", url: path, data: body }, options)
}

export function deleteRequest<T>(
  path: string,
  options?: RequestOptionsInterface
): Promise<RequestResultInterface<T>> {
  return request<T>({ ...options, method: "DELETE", url: path }, options)
}
