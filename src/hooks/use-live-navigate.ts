"use client"

import type { LocaleType } from "@/i18n"
import { getRoutes } from "@/config/routes"

import { useRouter } from "./useRouter"

export function useLiveNavigate() {
  const { push, pathname } = useRouter()

  return function navigateToLive(matchId: string | number, gameId: number) {
    const locale = (pathname.split("/")[1] || "vi") as LocaleType
    push(getRoutes(locale).live(matchId, gameId))
  }
}
