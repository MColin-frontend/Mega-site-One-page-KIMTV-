import { NextRequest, NextResponse } from "next/server"

import { getRequest, postRequest } from "@/server/services/request"
import { getServerLoginUserId } from "@/lib/auth-server"

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const newsId = sp.get("newsId")
  if (!newsId) return NextResponse.json({ success: false }, { status: 400 })

  const loginUserId = await getServerLoginUserId()
  const res = await getRequest("/news/news-comment", {
    params: {
      newsId,
      pageIndex: sp.get("pageIndex") ?? 0,
      pageSize: sp.get("pageSize") ?? 100,
      commentType: sp.get("commentType") ?? 1,
      loginUserId,
    },
  })

  return NextResponse.json(res)
}

export async function POST(req: NextRequest) {
  const loginUserId = await getServerLoginUserId()
  if (!loginUserId)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  const body = (await req.json()) as Record<string, unknown>
  const res = await postRequest("/news/comment-news", { ...body, userSourceId: loginUserId })
  return NextResponse.json(res)
}

export async function DELETE(req: NextRequest) {
  const loginUserId = await getServerLoginUserId()
  if (!loginUserId)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  const commentId = req.nextUrl.searchParams.get("commentId")
  if (!commentId) return NextResponse.json({ success: false }, { status: 400 })

  const res = await getRequest("/news/remove-comment", {
    params: { commentId, loginUserId },
  })
  return NextResponse.json(res)
}
