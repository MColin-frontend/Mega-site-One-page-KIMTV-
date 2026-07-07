"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Menu, Search, UserRound, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useModal } from "@/hooks/useModal"

import { SLUG_MAP, useTranslation } from "@/i18n"
import { getRoutes } from "@/config/routes"
import { HEADER_DROPDOWN_ITEMS, MAIN_NAV_ITEMS } from "@/constants/component/layout.constants"

import { Button } from "@/components/ui/button"
import { Img } from "@/components/ui/image"
import { ConfirmModal } from "@/components/ui/modal/confirm"
import { Typography } from "@/components/ui/typography"

import kimtvLogo from "@assets/icons/layout/ic-kimtv.svg"

/* ── Avatar Dropdown ─────────────────────────────────────── */
interface AvatarDropdownProps {
  user: { name?: string | null; avatar?: string | null }
  onLogout: () => void
}

function AvatarDropdown({ user, onLogout }: AvatarDropdownProps) {
  const { t } = useTranslation()
  const { state, open, close, toggle, setOpen } = useModal("dropdown", "confirm")
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!state.dropdown) return
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close("dropdown")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [state.dropdown, close])

  const initial = String(user.name ?? "U")
    .slice(0, 1)
    .toUpperCase()

  function renderAvatar(size: number) {
    if (user.avatar) {
      return (
        <Img
          src={user.avatar}
          alt={user.name ?? "Avatar"}
          width={size}
          height={size}
          rounded="full"
        />
      )
    }
    return (
      <div className="from-blue/80 to-blue flex h-full w-full items-center justify-center bg-gradient-to-br">
        <Typography variant="caption" weight="700" className="text-white">
          {initial}
        </Typography>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => toggle("dropdown")}
        className="hover:ring-gold/50 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/15 transition-all"
        aria-label={t("header.user.aria-label")}
      >
        {renderAvatar(36)}
      </button>

      <div
        className={cn(
          "absolute top-full right-0 z-50 mt-2 w-52",
          "rounded-xl border border-white/10 bg-[#0d1829] shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
          "origin-top-right transition-all duration-150",
          state.dropdown
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        {/* User info */}
        <div className="flex items-center gap-2.5 border-b border-white/8 px-3.5 py-3">
          <div className="from-blue/80 to-blue flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br">
            {renderAvatar(32)}
          </div>
          <div className="min-w-0">
            <Typography variant="body-sm" weight="600" className="truncate text-white">
              {user.name ?? t("header.user.fallback-name")}
            </Typography>
            <Typography variant="caption" className="text-muted">
              {t("header.user.account")}
            </Typography>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-1">
          {HEADER_DROPDOWN_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group flex items-center gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-white/5"
            >
              <item.icon className={cn("size-4 shrink-0 transition-colors", item.iconColor)} />
              <Typography
                variant="body-sm"
                className="text-muted whitespace-nowrap transition-colors group-hover:text-white"
              >
                {t(item.labelKey)}
              </Typography>
            </Link>
          ))}
        </div>

        <div className="mx-3.5 border-t border-white/8" />

        {/* Logout */}
        <div className="py-1">
          <button
            onClick={() => {
              close("dropdown")
              open("confirm")
            }}
            className="group flex w-full items-center gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-red-500/8"
          >
            <LogOut className="size-4 shrink-0 text-red-400" />
            <Typography
              variant="body-sm"
              className="whitespace-nowrap text-red-400/80 transition-colors group-hover:text-red-400"
            >
              {t("header.user.logout.label")}
            </Typography>
          </button>
        </div>
      </div>

      {state.confirm && (
        <ConfirmModal
          open={state.confirm}
          onOpenChange={(v) => setOpen("confirm", v)}
          title={t("header.user.logout.title")}
          content={t("header.user.logout.content")}
          confirmLabel={t("header.user.logout.confirm")}
          cancelLabel={t("header.user.logout.cancel")}
          type="destructive"
          onConfirm={onLogout}
        />
      )}
    </div>
  )
}

/* ── Search ──────────────────────────────────────────────── */
function SearchInput() {
  const { t } = useTranslation()
  const { state, open, close } = useModal("search")
  const [value, setValue] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const expand = () => {
    open("search")
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const collapse = () => {
    close("search")
    setValue("")
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (!wrapRef.current?.contains(document.activeElement)) collapse()
    }, 100)
  }

  return (
    <div ref={wrapRef} className="relative hidden md:block" onBlur={handleBlur}>
      <button
        onClick={expand}
        aria-label={t("header.search.aria-label")}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
          "border shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
          state.search
            ? "border-white/25 bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            : "text-muted border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/10 hover:text-white"
        )}
      >
        <Search className="h-[15px] w-[15px]" />
      </button>

      <div
        className={cn(
          "absolute top-1/2 right-0 z-50 -translate-y-1/2",
          "flex items-center gap-2.5",
          "h-9 rounded-full border border-white/15 bg-[#0d1829]",
          "pr-2.5 pl-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
          "origin-right transition-all duration-200 ease-out",
          state.search
            ? "pointer-events-auto w-56 scale-x-100 opacity-100"
            : "pointer-events-none w-8 scale-x-0 opacity-0"
        )}
      >
        <Search className="text-muted h-3.5 w-3.5 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && collapse()}
          placeholder={t("header.search.placeholder")}
          className="text-13 placeholder:text-placeholder flex-1 bg-transparent text-white outline-none"
        />
        {value && (
          <button
            onClick={() => {
              setValue("")
              inputRef.current?.focus()
            }}
            className="text-muted hover:text-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────── */
export function Header() {
  const { t, locale } = useTranslation()
  const pathname = usePathname()
  const routes = getRoutes(locale)
  const { state, toggle, close } = useModal("mobileMenu")
  const { user, isLoggedIn, login, logout } = useAuth()

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
          <Link href={routes.home} className="shrink-0" onClick={() => close("mobileMenu")}>
            <Img
              src={kimtvLogo}
              alt="KimTV"
              width={130}
              height={48}
              priority
              objectFit="contain"
              style={{ height: "auto" }}
            />
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-8 px-8 max-lg:hidden">
            {MAIN_NAV_ITEMS.map((item) => {
              const href = item.getHref(routes)
              const active = isActive(href)
              return (
                <Link key={href} href={href} className="nav-link" data-active={active}>
                  <Typography
                    variant="h6"
                    className={cn(
                      "whitespace-nowrap transition-colors",
                      active ? "text-gold" : "hover:text-gold text-white/85"
                    )}
                  >
                    {t(item.labelKey)}
                  </Typography>
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <SearchInput />

            {isLoggedIn && user ? (
              <AvatarDropdown user={user} onLogout={logout} />
            ) : (
              <Button variant="gradient" onClick={login} className="max-lg:hidden">
                <UserRound className="h-3.5 w-3.5" />
                {t("header.auth.login")}
              </Button>
            )}

            <button
              aria-label={
                state.mobileMenu ? t("header.mobileMenu.close") : t("header.mobileMenu.open")
              }
              onClick={() => toggle("mobileMenu")}
              className="text-muted relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu
                className={cn(
                  "absolute h-[18px] w-[18px] transition-all duration-200",
                  state.mobileMenu
                    ? "scale-50 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute h-[18px] w-[18px] transition-all duration-200",
                  state.mobileMenu
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-50 -rotate-90 opacity-0"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => close("mobileMenu")}
        className={cn(
          "fixed inset-0 top-[60px] z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          state.mobileMenu ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div
        className={cn(
          "bg-navy fixed inset-x-0 top-[60px] z-50 lg:hidden",
          "border-b border-white/8",
          "transition-all duration-300 ease-out",
          state.mobileMenu
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-3 opacity-0"
        )}
      >
        <nav className="container divide-y divide-white/6 py-2">
          {MAIN_NAV_ITEMS.map((item) => {
            const href = item.getHref(routes)
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => close("mobileMenu")}
                className={cn(
                  "flex h-[52px] items-center gap-3 transition-colors",
                  active ? "text-gold" : "text-muted hover:text-white"
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

        {!isLoggedIn && (
          <div className="container pt-3 pb-5">
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => {
                login()
                close("mobileMenu")
              }}
            >
              <UserRound className="h-4 w-4" />
              {t("header.auth.login")}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
