"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { SLUG_MAP, useTranslation } from "@/i18n"
import { getRoutes } from "@/config/routes"
import { MAIN_NAV_ITEMS } from "@/constants/component/layout.constants"
import type { NavItemInterface } from "@/models/layout.models"

import { Button } from "@/components/ui/button"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import kimtvLogo from "@assets/icons/layout/ic-kimtv.svg"

export function Header() {
  const { t, locale } = useTranslation()
  const pathname = usePathname()
  const routes = getRoutes(locale)

  function isActive(href: string): boolean {
    if (href === `/${locale}`) return pathname === `/${locale}`
    const viSlug = href.split("/")[2] ?? ""
    const localizedSlugs = Object.values(SLUG_MAP[viSlug] ?? {})
    return pathname.includes(`/${viSlug}`) || localizedSlugs.some((s) => pathname.includes(`/${s}`))
  }

  return (
    <header className="bg-navy sticky top-0 z-50 w-full">
      <div className="container flex h-[60px] items-center">
        <Link href={routes.home} className="shrink-0">
          <Img src={kimtvLogo} alt="KimTV" width={150} height={55} priority objectFit="contain" />
        </Link>

        <nav className="flex flex-1 items-center justify-center gap-6 px-8">
          {MAIN_NAV_ITEMS.map((item: NavItemInterface) => {
            const href = item.getHref(routes)
            return (
              <Link key={href} href={href}>
                <Typography
                  variant="label"
                  className={`whitespace-nowrap transition-colors ${
                    isActive(href) ? "text-gold" : "text-white/85 hover:text-white"
                  }`}
                >
                  {t(item.labelKey)}
                </Typography>
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            aria-label="Tìm kiếm"
            className="rounded-8 border-blue bg-blue hover:bg-blue/80 flex h-9 w-9 items-center justify-center border text-white transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>

          <Button variant="gradient">{t("header.auth.login")}</Button>
        </div>
      </div>
    </header>
  )
}
