export interface KimtvUser {
  /** Field chuẩn hóa — luôn có sau khi parse cookie (map từ uid hoặc userId gốc). */
  userId?: number | string
  /** Field gốc từ Java backend. */
  uid?: number | string
  name?: string
  avatar?: string
  phone?: string
  email?: string
  [key: string]: unknown
}

function getCookieDomain(): string | undefined {
  if (typeof window === "undefined") return undefined
  let domain = window.location.hostname
  if (domain === "localhost") return undefined
  if (domain.startsWith("www.")) domain = domain.slice(4)
  return `.${domain}`
}

function setCookie(name: string, value: string): void {
  const domain = getCookieDomain()
  const parts = [`${name}=${encodeURIComponent(value)}`, "path=/", "SameSite=Lax"]
  if (domain) parts.push(`domain=${domain}`)
  document.cookie = parts.join("; ")
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function deleteCookie(name: string): void {
  const domain = getCookieDomain()
  const base = `${name}=; path=/; max-age=0`
  document.cookie = domain ? `${base}; domain=${domain}` : base
}

export function saveAuthCookies(token: string, user: KimtvUser): void {
  setCookie("token", token)
  setCookie("userInfo", JSON.stringify(user))
}

export function clearAuthCookies(): void {
  deleteCookie("token")
  deleteCookie("userInfo")
}

export function getTokenFromCookie(): string | null {
  return getCookie("token")
}

export function getUserInfoFromCookie(): KimtvUser | null {
  const raw = getCookie("userInfo")
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as KimtvUser
    // Backend Java trả về `uid`, normalize về `userId` để dùng thống nhất trong app
    if (parsed.uid != null && parsed.userId == null) {
      parsed.userId = parsed.uid
    }
    return parsed
  } catch {
    return null
  }
}
