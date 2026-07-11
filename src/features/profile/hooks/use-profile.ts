"use client"

import { useAuth } from "@/hooks/use-auth"

export function useProfile() {
  const { user, isLoggedIn, isLoading, login, logout } = useAuth()

  const displayName = user?.name ?? "Thành viên"
  const avatarUrl = user?.avatar ?? ""
  const userId = user?.userId ?? user?.uid

  return {
    user,
    isLoggedIn,
    isLoading,
    displayName,
    avatarUrl,
    userId,
    login,
    logout,
  }
}
