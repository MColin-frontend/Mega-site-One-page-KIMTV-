export const env = {
  nodeEnv: (process.env.NODE_ENV ?? "development") as "development" | "production" | "test",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",

  // Backend KimTV (Java) — base URL đã bao gồm prefix `/java`.
  // Override qua biến môi trường khi đổi domain (dev/staging/prod).
  apiBaseUrl: process.env.API_BASE_URL ?? "https://kimtv.net/java",

  // Origin/Referer gửi kèm request — backend/Cloudflare có thể kiểm tra nguồn.
  apiOrigin: process.env.API_ORIGIN ?? "https://kimtv.net",

  // Timeout request (ms). Hủy request nếu backend không phản hồi kịp.
  apiTimeoutMs: Number(process.env.API_TIMEOUT_MS) || 15_000,

  // WebSocket chat — java ws (bỏ /panda theo convention PC cũ).
  // prod: wss://ws.kimtv.org | dev: wss://ws-dev.kimtv.org
  wsBaseUrl: process.env.NEXT_PUBLIC_WS_BASE_URL ?? "wss://ws.kimtv.org",
} as const