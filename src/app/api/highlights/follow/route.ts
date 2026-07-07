import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? ""
  const loginUserId = searchParams.get("loginUserId") ?? ""
  const isFollow = searchParams.get("isFollow") !== "false"

  if (!userId) return NextResponse.json({ success: false })

  const res = await getRequest<unknown>("/user/follow-user", {
    params: { isFollow, userId, loginUserId },
  })

  return NextResponse.json({ success: res.success })
}
