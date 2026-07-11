import type { ElementType } from "react"
import { CircleUser, Radio, Settings2 } from "lucide-react"

import type { TranslationKey } from "@/i18n"
import type { Routes } from "@/config/routes"
import type { FooterMenuInterface, FooterSocialInterface } from "@/models/footer.models"
import type { NavItemInterface } from "@/models/layout.models"

import facebookIcon from "@assets/icons/layout/ic-facebook.svg"
import telegramIcon from "@assets/icons/layout/ic-tele.svg"
import tiktokIcon from "@assets/icons/layout/ic-tiktok.svg"
import youtubeIcon from "@assets/icons/layout/ic-youtube.svg"

export interface DropdownItemInterface {
  key: string
  labelKey: TranslationKey
  icon: ElementType
  iconColor: string
  getHref: (r: Routes) => string
}

export const HEADER_DROPDOWN_ITEMS: DropdownItemInterface[] = [
  {
    key: "broadcast",
    labelKey: "header.user.menu.broadcast",
    icon: Radio,
    iconColor: "text-amber-400",
    getHref: () => "#",
  },
  {
    key: "profile",
    labelKey: "header.user.menu.profile",
    icon: CircleUser,
    iconColor: "text-blue-400",
    getHref: (r) => r.profile,
  },
  {
    key: "settings",
    labelKey: "header.user.menu.settings",
    icon: Settings2,
    iconColor: "text-muted",
    getHref: () => "#",
  },
]

export const MAIN_NAV_ITEMS: NavItemInterface[] = [
  { labelKey: "header.nav.home", getHref: (r) => r.home },
  { labelKey: "header.nav.schedule", getHref: (r) => r.schedule },
  { labelKey: "header.nav.liveSchedule", getHref: (r) => r.liveSchedule },
  { labelKey: "header.nav.news", getHref: (r) => r.news.index },
  { labelKey: "header.nav.highlight", getHref: (r) => r.video.index },
]

export const FOOTER_SOCIAL_LINKS = {
  FACEBOOK: "https://www.facebook.com/Trangchukimtv?locale=vi_VN",
  TELEGRAM: "https://t.me/anhemkimtv",
  TIKTOK: "#",
  YOUTUBE: "#",
} as const

export const FOOTER_SOCIALS: FooterSocialInterface[] = [
  { name: "facebook", icon: facebookIcon, link: FOOTER_SOCIAL_LINKS.FACEBOOK },
  { name: "telegram", icon: telegramIcon, link: FOOTER_SOCIAL_LINKS.TELEGRAM },
  { name: "tiktok", icon: tiktokIcon, link: FOOTER_SOCIAL_LINKS.TIKTOK },
  { name: "youtube", icon: youtubeIcon, link: FOOTER_SOCIAL_LINKS.YOUTUBE },
]

export const FOOTER_MENUS: FooterMenuInterface[] = [
  { key: "home", getHref: (r) => r.home },
  { key: "fixtures", getHref: (r) => r.schedule },
  { key: "live-score", getHref: (r) => r.liveScore },
  { key: "news", getHref: (r) => r.news.index },
  { key: "highlights", getHref: (r) => r.video.index },
]
