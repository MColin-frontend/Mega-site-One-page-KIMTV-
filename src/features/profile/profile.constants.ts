import { CircleUser, Eye, Heart, Newspaper, Settings } from "lucide-react"

import { ProfileSidebarTabEnum } from "./profile.enum"
import type { SidebarNavItemInterface } from "./profile.models"

export const PROFILE_SIDEBAR_ITEMS: SidebarNavItemInterface[] = [
  { key: ProfileSidebarTabEnum.PROFILE, labelKey: "profile.nav.profile", icon: CircleUser },
  { key: ProfileSidebarTabEnum.MY_NEWS, labelKey: "profile.nav.myNews", icon: Newspaper },
  { key: ProfileSidebarTabEnum.FAVORITES, labelKey: "profile.nav.favorites", icon: Heart },
  { key: ProfileSidebarTabEnum.FOLLOWING, labelKey: "profile.nav.following", icon: Eye },
  { key: ProfileSidebarTabEnum.SETTINGS, labelKey: "profile.nav.settings", icon: Settings },
]
