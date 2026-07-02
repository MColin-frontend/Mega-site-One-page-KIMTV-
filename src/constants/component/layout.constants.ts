import type { FooterMenuInterface, FooterSocialInterface } from "@/models/footer.models"
import type { NavItemInterface } from "@/models/layout.models"

import facebookIcon from "@assets/icons/layout/ic-facebook.svg"
import telegramIcon from "@assets/icons/layout/ic-tele.svg"
import tiktokIcon from "@assets/icons/layout/ic-tiktok.svg"
import youtubeIcon from "@assets/icons/layout/ic-youtube.svg"

export const MAIN_NAV_ITEMS: NavItemInterface[] = [
  { labelKey: "header.nav.home", getHref: (r) => r.home },
  { labelKey: "header.nav.schedule", getHref: (r) => r.schedule },
  { labelKey: "header.nav.liveScore", getHref: (r) => r.liveScore },
  { labelKey: "header.nav.results", getHref: (r) => r.results },
  { labelKey: "header.nav.standings", getHref: (r) => r.standings },
  { labelKey: "header.nav.news", getHref: (r) => r.news.index },
  { labelKey: "header.nav.video", getHref: (r) => r.video },
  { labelKey: "header.nav.data", getHref: (r) => r.data },
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
  { key: "highlights", getHref: (r) => r.video },
]
