"use server"

import { getRequest } from "@/server/services/request"

interface LoginInfoResult {
  token: string
  user: Record<string, unknown>
  newUser?: boolean
}

interface ExchangeResponse {
  status: "success" | string
  result: LoginInfoResult
  errorCode?: number | null
  errorMsg?: string | null
}

export async function exchangeIdTokenAction(
  idToken: string,
  promotionChannelId = ""
): Promise<ExchangeResponse> {
  if (!idToken) {
    return {
      status: "error",
      result: { token: "", user: {} },
      errorMsg: "id_token is empty",
    }
  }

  const res = await getRequest<LoginInfoResult>("/login/v2/get-login-info", {
    params: {
      isFrom: "pc",
      token: idToken,
      type: 11,
      promotionChannelId,
      channelFromtype: promotionChannelId ? "1" : "",
    },
  })

  if (res.success && res.data?.token) {
    return { status: "success", result: res.data }
  }

  return {
    status: "error",
    result: { token: "", user: {} },
    errorCode: res.errorCode ?? null,
    errorMsg: res.message ?? "Authentication failed",
  }
}
