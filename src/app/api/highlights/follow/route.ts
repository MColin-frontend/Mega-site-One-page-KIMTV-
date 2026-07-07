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
    const id = user.userId ?? user.uid
    return id != null ? String(id) : ""
  } catch {
    return ""
  }
}

export async function GET(req: NextRequest) {
  const loginUserId = await getLoginUserId()
  if (!loginUserId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") ?? ""
  const isFollow = searchParams.get("isFollow") !== "false"

  if (!userId) return NextResponse.json({ success: false }, { status: 400 })

  const res = await getRequest<unknown>("/user/follow-user", {
    params: { isFollow, userId, loginUserId },
  })

  return NextResponse.json(res)
}
