import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"
import { getServerLoginUserId } from "@/lib/auth-server"

export async function GET(req: NextRequest) {
  const loginUserId = await getServerLoginUserId()
  if (!loginUserId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const typeId = searchParams.get("typeId") ?? ""
  const flag = searchParams.get("flag") ?? "1"
  const isLike = searchParams.get("isLike") !== "false"

  if (!typeId) return NextResponse.json({ success: false }, { status: 400 })

  const res = await getRequest<unknown>("/news/user-like", {
    params: { flag, isLike, typeId, loginUserId },
  })

  return NextResponse.json(res)
}
