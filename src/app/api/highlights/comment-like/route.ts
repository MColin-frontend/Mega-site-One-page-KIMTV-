import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

import "@/features/highlights/highlights.constants"

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      commentId: string | number
      isLike: boolean
      loginUserId: string
    }
    // flag: 2 = comment like (KIMTV-PC: newsUserLike flag=2)
    const res = await getRequest<unknown>("/news/user-like", {
      params: {
        flag: 2,
        isLike: body.isLike,
        loginUserId: body.loginUserId || "",
        typeId: body.commentId,
      },
    })
    return NextResponse.json({ success: res.success })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
