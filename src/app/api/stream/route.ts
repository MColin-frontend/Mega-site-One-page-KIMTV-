import { NextRequest, NextResponse } from "next/server"

const ALLOWED_HOSTS = ["sport.esptv666.com", "kimtv-oss.99kimtvs.top"]

const PROXY_HEADERS = {
  Origin: "https://kimtv.net",
  Referer: "https://kimtv.net/",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
}

function proxySegmentUrl(req: NextRequest, rawUrl: string): string {
  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`
  return `${base}/api/stream?url=${encodeURIComponent(rawUrl)}`
}

function rewriteM3u8(req: NextRequest, text: string, manifestUrl: string): string {
  const base = manifestUrl.substring(0, manifestUrl.lastIndexOf("/") + 1)

  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim()

      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith("#")) {
        // Rewrite URI= inside tags e.g. #EXT-X-KEY:METHOD=AES-128,URI="..."
        return line.replace(/URI="([^"]+)"/g, (_, uri) => {
          const abs = uri.startsWith("http") ? uri : base + uri
          return `URI="${proxySegmentUrl(req, abs)}"`
        })
      }

      // Segment / nested playlist lines
      const abs = trimmed.startsWith("http") ? trimmed : base + trimmed
      return proxySegmentUrl(req, abs)
    })
    .join("\n")
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 })

  let target: URL
  try {
    target = new URL(url)
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 })
  }

  if (!ALLOWED_HOSTS.includes(target.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 403 })
  }

  let res: Response
  try {
    res = await fetch(url, { headers: PROXY_HEADERS, cache: "no-store" })
  } catch {
    return NextResponse.json({ error: "upstream fetch failed" }, { status: 502 })
  }

  if (!res.ok) {
    return new NextResponse(null, { status: res.status, statusText: res.statusText })
  }

  const contentType = res.headers.get("content-type") ?? ""
  const isM3u8 = url.includes(".m3u8") || contentType.includes("mpegurl")

  if (isM3u8) {
    const text = await res.text()
    const rewritten = rewriteM3u8(req, text, url)
    return new NextResponse(rewritten, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-cache, no-store",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }

  // TS segments and other binary content — stream directly
  return new NextResponse(res.body, {
    headers: {
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=10",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
