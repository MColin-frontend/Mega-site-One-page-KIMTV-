import { NextResponse } from "next/server"

import { getRequest } from "@/server/services/request"

export async function GET() {
  const res = await getRequest<unknown>("/java/news/featured-by-game", {})

  if (!res.success || !res.data) return NextResponse.json([])

  const data = res.data
  if (Array.isArray(data)) return NextResponse.json(data)

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.news)) return NextResponse.json(obj.news)
  }

  return NextResponse.json([])
}
