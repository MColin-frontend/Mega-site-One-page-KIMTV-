"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, User, X } from "lucide-react"

import { cn } from "@/lib/utils"

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
  const [menuOpen, setMenuOpen] = useState(false)

  function isActive(href: string): boolean {
    if (href === `/${locale}`) return pathname === `/${locale}`
    const viSlug = href.split("/")[2] ?? ""
    const localizedSlugs = Object.values(SLUG_MAP[viSlug] ?? {})
    return pathname.includes(`/${viSlug}`) || localizedSlugs.some((s) => pathname.includes(`/${s}`))
  }

  return (
    <>
      <header className="bg-header sticky top-0 z-50 w-full">
        <div className="container flex h-fit items-center gap-3 py-3">
          <Link href={routes.home} className="shrink-0" onClick={() => setMenuOpen(false)}>
            <Img src={kimtvLogo} alt="KimTV" width={130} height={48} priority objectFit="contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="flex flex-1 items-center justify-center gap-8 px-8 max-lg:hidden">
            {MAIN_NAV_ITEMS.map((item: NavItemInterface) => {
              const href = item.getHref(routes)
              return (
                <Link key={href} href={href} className="nav-link" data-active={isActive(href)}>
                  <Typography
                    variant="h6"
                    className={cn(
                      "whitespace-nowrap transition-colors",
                      isActive(href) ? "text-gold" : "hover:text-gold text-white/85"
                    )}
                  >
                    {t(item.labelKey)}
                  </Typography>
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              aria-label="Tìm kiếm"
              className="rounded-8 border-blue bg-blue hover:bg-blue/80 flex h-9 w-9 items-center justify-center border text-white transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            <Button variant="gradient" className="max-lg:hidden">
              <User className="h-4 w-4" />
              {t("header.auth.login")}
            </Button>

            <button
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-8 relative flex h-9 w-9 items-center justify-center text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              <Menu
                className={cn(
                  "absolute h-5 w-5 transition-all duration-200",
                  menuOpen ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute h-5 w-5 transition-all duration-200",
                  menuOpen ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 top-[60px] z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Mobile drawer */}
      <div
        className={cn(
          "bg-navy fixed inset-x-0 top-[60px] z-50 lg:hidden",
          "border-b border-white/8",
          "transition-all duration-300 ease-out",
          menuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        )}
      >
        <nav className="container divide-y divide-white/6 py-2">
          {MAIN_NAV_ITEMS.map((item: NavItemInterface) => {
            const href = item.getHref(routes)
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex h-[52px] items-center gap-3 transition-colors",
                  active ? "text-gold" : "text-white/70 hover:text-white"
                )}
              >
                <span
                  className={cn(
                    "h-4 w-[3px] rounded-full transition-all duration-200",
                    active ? "bg-gold" : "bg-transparent"
                  )}
                />
                <Typography variant="label" className="text-inherit">
                  {t(item.labelKey)}
                </Typography>
              </Link>
            )
          })}
        </nav>

        <div className="container pt-3 pb-5">
          <Button variant="gradient" className="w-full" onClick={() => setMenuOpen(false)}>
            {t("header.auth.login")}
          </Button>
        </div>
      </div>
    </>
  )
}
