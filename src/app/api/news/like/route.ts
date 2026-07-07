import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"
import { getServerLoginUserId } from "@/lib/auth-server"

export async function GET(req: NextRequest) {
  const loginUserId = await getServerLoginUserId()
  if (!loginUserId)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  const sp = req.nextUrl.searchParams
  const res = await getRequest("/news/user-like", {
    params: {
      flag: sp.get("flag") ?? 2,
      isLike: sp.get("isLike"),
      loginUserId,
      typeId: sp.get("typeId"),
    },
  })
  return NextResponse.json(res)
}
