"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleUser, LogOut, Menu, Radio, Search, Settings2, UserRound, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

import { SLUG_MAP, useTranslation } from "@/i18n"
import { getRoutes } from "@/config/routes"
import { MAIN_NAV_ITEMS } from "@/constants/component/layout.constants"
import type { NavItemInterface } from "@/models/layout.models"

import { Button } from "@/components/ui/button"
import { Img } from "@/components/ui/image"
import { ConfirmModal } from "@/components/ui/modal/confirm"
import { Typography } from "@/components/ui/typography"

import kimtvLogo from "@assets/icons/layout/ic-kimtv.svg"

/* ── Avatar Dropdown ─────────────────────────────────────── */
const DROPDOWN_ITEMS = [
  {
    key: "broadcast",
    label: "Phát trực tiếp",
    icon: Radio,
    iconColor: "text-amber-400",
    href: "#",
  },
  {
    key: "profile",
    label: "Hồ sơ cá nhân",
    icon: CircleUser,
    iconColor: "text-blue-400",
    href: "#",
  },
  {
    key: "settings",
    label: "Cài đặt",
    icon: Settings2,
    iconColor: "text-white/50",
    href: "#",
  },
] as const

interface AvatarDropdownProps {
  user: { name?: string | null; avatar?: string | null }
  onLogout: () => void
}

function AvatarDropdown({ user, onLogout }: AvatarDropdownProps) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="hover:ring-gold/50 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-2 ring-white/15 transition-all"
        aria-label="Tài khoản"
      >
        {user.avatar ? (
          <Img
            src={user.avatar}
            alt={user.name ?? "Avatar"}
            width={36}
            height={36}
            objectFit="cover"
            rounded="full"
          />
        ) : (
          <div className="from-blue/80 to-blue flex h-full w-full items-center justify-center bg-gradient-to-br">
            <Typography as="span" size="12" weight="700" className="text-white">
              {String(user.name ?? "U")
                .slice(0, 1)
                .toUpperCase()}
            </Typography>
          </div>
        )}
      </button>

      {/* Dropdown */}
      <div
        className={cn(
          "absolute top-full right-0 z-50 mt-2 w-52",
          "rounded-xl border border-white/10 bg-[#0d1829] shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
          "origin-top-right transition-all duration-150",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        {/* User info */}
        <div className="flex items-center gap-2.5 border-b border-white/8 px-3.5 py-3">
          <div className="from-blue/80 to-blue flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br">
            {user.avatar ? (
              <Img
                src={user.avatar}
                alt={user.name ?? "Avatar"}
                width={32}
                height={32}
                objectFit="cover"
                rounded="full"
              />
            ) : (
              <Typography variant="caption" weight="700" className="text-white">
                {String(user.name ?? "U")
                  .slice(0, 1)
                  .toUpperCase()}
              </Typography>
            )}
          </div>
          <div className="min-w-0">
            <Typography variant="body-sm" weight="600" className="truncate text-white">
              {user.name ?? "Người dùng"}
            </Typography>
            <Typography variant="caption" className="text-white/40">
              Tài khoản của tôi
            </Typography>
          </div>
        </div>

        {/* Menu items */}
        <div className="py-1">
          {DROPDOWN_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group flex items-center gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-white/5"
            >
              <item.icon className={cn("size-4 shrink-0 transition-colors", item.iconColor)} />
              <Typography
                variant="body-sm"
                className="whitespace-nowrap text-white/75 transition-colors group-hover:text-white"
              >
                {item.label}
              </Typography>
            </Link>
          ))}
        </div>

        <div className="mx-3.5 border-t border-white/8" />

        {/* Logout */}
        <div className="py-1">
          <button
            onClick={() => {
              setOpen(false)
              setConfirmOpen(true)
            }}
            className="group flex w-full items-center gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-red-500/8"
          >
            <LogOut className="size-4 shrink-0 text-red-400" />
            <Typography
              variant="body-sm"
              className="whitespace-nowrap text-red-400/80 transition-colors group-hover:text-red-400"
            >
              Đăng xuất
            </Typography>
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Đăng xuất"
        content="Bạn có chắc chắn muốn đăng xuất không?"
        confirmLabel="Xác nhận"
        cancelLabel="Hủy"
        type="destructive"
        onConfirm={onLogout}
      />
    </div>
  )
}

/* ── Search ──────────────────────────────────────────────── */
function SearchInput() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  const expand = () => {
    setOpen(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const collapse = () => {
    setOpen(false)
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
        aria-label="Tìm kiếm"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
          "border shadow-[0_1px_2px_rgba(0,0,0,0.3)]",
          open
            ? "border-white/25 bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
            : "border-white/10 bg-white/[0.05] text-white/45 hover:border-white/20 hover:bg-white/10 hover:text-white"
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
          open
            ? "pointer-events-auto w-56 scale-x-100 opacity-100"
            : "pointer-events-none w-8 scale-x-0 opacity-0"
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-white/40" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && collapse()}
          placeholder="Tìm kiếm..."
          className="text-13 flex-1 bg-transparent text-white outline-none placeholder:text-white/30"
        />
        {value && (
          <button
            onClick={() => {
              setValue("")
              inputRef.current?.focus()
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/40 transition-all hover:bg-white/20 hover:text-white/70"
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
  const [menuOpen, setMenuOpen] = useState(false)
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
          <Link href={routes.home} className="shrink-0" onClick={() => setMenuOpen(false)}>
            <Img src={kimtvLogo} alt="KimTV" width={130} height={48} priority objectFit="contain" />
          </Link>

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

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <SearchInput />

            {isLoggedIn && user ? (
              <AvatarDropdown user={user ?? {}} onLogout={logout} />
            ) : (
              <Button variant="gradient" size="sm" onClick={login} className="max-lg:hidden">
                <UserRound className="h-3.5 w-3.5" />
                {t("header.auth.login")}
              </Button>
            )}

            <button
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              onClick={() => setMenuOpen((v) => !v)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/45 shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu
                className={cn(
                  "absolute h-[18px] w-[18px] transition-all duration-200",
                  menuOpen ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute h-[18px] w-[18px] transition-all duration-200",
                  menuOpen ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 top-[60px] z-40 bg-black/60 backdrop-blur-sm lg:hidden",
          "transition-opacity duration-300",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />

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
          <Button
            variant="gradient"
            className="w-full"
            onClick={() => {
              login()
              setMenuOpen(false)
            }}
          >
            <UserRound className="h-4 w-4" />
            {t("header.auth.login")}
          </Button>
        </div>
      </div>
    </>
  )
}
