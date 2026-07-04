"use client"

import { useEffect, useState } from "react"

import {
  clearAuthCookies,
  getTokenFromCookie,
  getUserInfoFromCookie,
  type KimtvUser,
} from "@/lib/auth-cookie"
import { loginWith99kim, logoutFrom99kim } from "@/lib/oidc"

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

  const login = () => loginWith99kim().catch(console.error)

  const logout = () => {
    clearAuthCookies()
    setState({ user: null, isLoggedIn: false, isLoading: false })
    logoutFrom99kim().catch(() => {
      window.location.href = "/"
    })
  }

  return { ...state, login, logout }
}
