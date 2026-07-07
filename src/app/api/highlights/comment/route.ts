import { NextRequest, NextResponse } from "next/server"

import { postRequest } from "@/server/services/request"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await postRequest<unknown>("/news/comment-news", body)
    return NextResponse.json({ success: res.success, data: res.data })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
