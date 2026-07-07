import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"
import type { KimtvUser } from "@/lib/auth-cookie"

async function getLoginUserId(): Promise<string> {
  try {
    const store = await cookies()
    const raw = store.get("userInfo")?.value
    if (!raw) return ""
    const user = JSON.parse(decodeURIComponent(raw)) as KimtvUser
    return String(user.userId ?? "")
  } catch {
    return ""
  }
}

export async function GET(req: NextRequest) {
  const loginUserId = await getLoginUserId()
  if (!loginUserId)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  const sp = req.nextUrl.searchParams
  const res = await getRequest("/user/follow-user", {
    params: {
      isFollow: sp.get("isFollow"),
      userId: sp.get("userId"),
      loginUserId,
    },
  })
  return NextResponse.json(res)
}
