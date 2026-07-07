import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const commentId = searchParams.get("commentId") ?? ""
    const loginUserId = searchParams.get("loginUserId") ?? ""

    const res = await getRequest<unknown>("/news/remove-comment", {
      params: { commentId, loginUserId: loginUserId || "" },
    })
    return NextResponse.json({ success: res.success })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
