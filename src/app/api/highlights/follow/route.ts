import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? ""
  const isFollow = searchParams.get("isFollow") !== "false"

  if (!userId) return NextResponse.json({ success: false })

  // Java identifies the current user from the token header forwarded by request.ts interceptor.
  // No loginUserId needed — mirrors KIMTV-PC: Api.followUser({ isFollow, userId }).
  const res = await getRequest<unknown>("/user/follow-user", {
    params: { isFollow, userId },
  })

  return NextResponse.json({ success: res.success })
}
