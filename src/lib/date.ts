export function parseDateParam(s: string | null): Date | null {
  if (!s) return null
  const [y, m, d] = s.split("-").map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function formatDateParam(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function formatFullDate(d: Date): string {
  return d.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatDisplayDate(d: Date): string {
  const today = new Date()
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  if (isToday) return "Hôm nay"
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })
}

export function formatKickOff(ts: number, locale = "vi-VN"): string {
  return new Date(ts * 1000).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Format unix timestamp (seconds hoặc milliseconds) → chuỗi ngày giờ.
 * Tự phát hiện đơn vị: >= 1e12 là ms, ngược lại là giây.
 */
export function formatTimestamp(value: string | number | undefined, locale = "vi-VN"): string {
  if (!value) return ""
  const ts = Number(value)
  if (!ts) return ""
  const ms = ts < 1e12 ? ts * 1000 : ts
  const d = new Date(ms)
  if (isNaN(d.getTime())) return ""
  return d.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Phút bóng đá — quá 90 hiển thị dạng `90+6`. */
export function formatFootballGameTime(gameTime: number): string {
  if (gameTime > 90) return `90+${gameTime - 90}`
  return String(gameTime)
}
