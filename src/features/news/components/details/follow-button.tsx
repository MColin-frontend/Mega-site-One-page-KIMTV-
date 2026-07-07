"use client"

import { useState } from "react"

import { clientGet } from "@/lib/client-request"
import { useAuth } from "@/hooks/use-auth"

import { useTranslation } from "@/i18n"

import { USER_ROUTES } from "@/features/news/news.api"

interface FollowButtonProps {
  authorId: number | null | undefined
  initialFollow: boolean | null | undefined
}

export function FollowButton({ authorId, initialFollow }: FollowButtonProps) {
  const { t } = useTranslation()
  const { isLoggedIn, login } = useAuth()
  const [following, setFollowing] = useState(!!initialFollow)
  const [loading, setLoading] = useState(false)

  if (!authorId) return null

  async function toggle() {
    if (!isLoggedIn) {
      login()
      return
    }
    if (loading) return

    const next = !following
    setFollowing(next)
    setLoading(true)

    try {
      const qs = new URLSearchParams({ isFollow: String(next), userId: String(authorId) })
      const res = await clientGet<{ success: boolean }>(`${USER_ROUTES.FOLLOW}?${qs}`)
      if (!res?.success) setFollowing(!next)
    } catch {
      setFollowing(!next)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`font-600 rounded-full px-3 py-1 text-[12px] transition-all disabled:opacity-60 ${
        following
          ? "border border-white/20 text-white/50 hover:border-red-400/50 hover:text-red-400"
          : "bg-gold text-[#0a1128] hover:opacity-85"
      }`}
    >
      {following ? t("news.author.following") : t("news.author.follow")}
    </button>
  )
}
