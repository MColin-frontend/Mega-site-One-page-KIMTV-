import { NextRequest, NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

import { PAGE_SIZE_COMMENT as PAGE_SIZE_DEFAULT } from "@/features/highlights/highlights.constants"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const newsId = searchParams.get("newsId") ?? ""
  const page = parseInt(searchParams.get("pageIndex") ?? searchParams.get("page") ?? "0", 10)
  const loginUserId = searchParams.get("loginUserId") ?? ""
  const pageSize = parseInt(searchParams.get("pageSize") ?? String(PAGE_SIZE_DEFAULT), 10)
  const commentType = parseInt(searchParams.get("commentType") ?? "3", 10)

  if (!newsId) return NextResponse.json({ records: [], total: 0 })

  // Backend có thể trả result là array trực tiếp hoặc object { records/list, total }
  const res = await getRequest<unknown>("/news/news-comment", {
    params: {
      newsId,
      pageIndex: page,
      loginUserId: loginUserId || "",
      commentType,
      pageSize,
    },
  })

  const data = res.data
  let records: unknown[]
  let total: number

  if (Array.isArray(data)) {
    // result là array trực tiếp (KIMTV-PC pattern: res.result = [...])
    records = data
    total = data.length
  } else {
    // result là object { records/list, total }
    const obj = data as Record<string, unknown> | null
    records = (obj?.records ?? obj?.list ?? []) as unknown[]
    total = Number(obj?.total ?? records.length)
  }

  return NextResponse.json({ records, total })
}
