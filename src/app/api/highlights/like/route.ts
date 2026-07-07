import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const typeId = searchParams.get("typeId") ?? ""
  const loginUserId = searchParams.get("loginUserId") ?? ""
  const flag = searchParams.get("flag") ?? "1"
  // "false" string → false, bất kỳ giá trị khác (kể cả "true") → true
  const isLike = searchParams.get("isLike") !== "false"

  if (!typeId) return NextResponse.json({ success: false })

  const res = await getRequest<unknown>("/news/user-like", {
    params: { flag, isLike, typeId, loginUserId },
  })

  return NextResponse.json({ success: res.success })
}
