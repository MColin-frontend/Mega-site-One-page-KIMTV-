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
  errorCode?: number
  errorMsg?: string
}

export async function exchangeIdTokenAction(
  idToken: string,
  promotionChannelId = ""
): Promise<ExchangeResponse> {
  const res = await getRequest<LoginInfoResult>("/login/v2/get-login-info", {
    params: {
      isFrom: "pc",
      token: idToken,
      type: 11,
      promotionChannelId,
      channelFromtype: promotionChannelId ? "1" : "",
    },
  })

  if (res.success && res.data) {
    return { status: "success", result: res.data }
  }

  return {
    status: "error",
    result: { token: "", user: {} },
    errorCode: res.errorCode ?? undefined,
    errorMsg: res.message ?? "Authentication failed",
  }
}
