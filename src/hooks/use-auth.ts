"use client"

import { useEffect, useState } from "react"

import {
  clearAuthCookies,
  getTokenFromCookie,
  getUserInfoFromCookie,
  type KimtvUser,
} from "@/lib/auth-cookie"
import { loginWith99kim, logoutFrom99kim } from "@/lib/oidc"

const RETURN_TO_KEY = "auth_return_to"

interface AuthState {
  user: KimtvUser | null
  isLoggedIn: boolean
  isLoading: boolean
}

export function useAuth(): AuthState & { login: () => void; logout: () => void } {
  const [state, setState] = useState<AuthState>({ user: null, isLoggedIn: false, isLoading: true })

  useEffect(() => {
    const token = getTokenFromCookie()
    const user = token ? getUserInfoFromCookie() : null
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ user, isLoggedIn: !!token, isLoading: false })
  }, [])

  const login = () => {
    // Lưu URL hiện tại để redirect về sau khi login xong
    try {
      sessionStorage.setItem(RETURN_TO_KEY, window.location.pathname + window.location.search)
    } catch {}
    loginWith99kim().catch(console.error)
  }

  const logout = () => {
    clearAuthCookies()
    localStorage.clear()
    setState({ user: null, isLoggedIn: false, isLoading: false })
    logoutFrom99kim().catch(() => {
      window.location.href = "/"
    })
  }

  return { ...state, login, logout }
}
