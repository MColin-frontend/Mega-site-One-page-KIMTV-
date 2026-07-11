import type { ElementType } from "react"

import type { KimtvUser } from "@/lib/auth-cookie"

import type { ProfileSidebarTabEnum } from "./profile.enum"

export interface ProfileStatsInterface {
  matchesWatched: number
  leaguesFollowed: number
  commentsPosted: number
}

export interface ProfileInterface {
  user: KimtvUser
  stats: ProfileStatsInterface
}

export interface UpdateProfilePayloadInterface {
  name?: string
  avatar?: string
  phone?: string
  email?: string
}

export interface SidebarNavItemInterface {
  key: ProfileSidebarTabEnum
  labelKey: string
  icon: ElementType
}
