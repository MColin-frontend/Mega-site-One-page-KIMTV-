"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import { SLUG_MAP, useTranslation } from "@/i18n"
import { getRoutes } from "@/config/routes"
import { MAIN_NAV_ITEMS } from "@/constants/component/layout.constants"

const BAR_COLOR = "#111d35" // noticeably lighter than page (#091320) so notch is visible
const BAR_H = 64
const CIRCLE_R = 28
const NOTCH_R = 40 // tight around circle: gap = 40-28 = 12px
const CURVE_S = 8
const CORNER_R = 20

/** SVG path: bar with true circular arc notch (W = D = R) */
function buildPath(W: number, cx: number): string {
  const H = BAR_H
  const cr = CORNER_R
  const R = NOTCH_R
  const s = CURVE_S

  const lx = cx - R // arc left x (at y=0)
  const rx = cx + R // arc right x (at y=0)

  // Use SVG arc: radius R, clockwise sweep → true semicircle, D = R
  return [
    `M 0,${H}`,
    `L 0,${cr}`,
    `Q 0,0 ${cr},0`,
    // Approach bar to notch with small smooth Q
    `L ${lx - s},0`,
    `Q ${lx},0 ${lx},${s}`,
    // True circular arc (W = D = R → perfect semicircle depth)
    `A ${R},${R} 0 0,1 ${rx},${s}`,
    // Exit notch smoothly
    `Q ${rx},0 ${rx + s},0`,
    `L ${W - cr},0`,
    `Q ${W},0 ${W},${cr}`,
    `L ${W},${H}`,
    `Z`,
  ].join(" ")
}

export function MobileBottomNav() {
  const { locale } = useTranslation()
  const pathname = usePathname()
  const routes = getRoutes(locale)
  const navRef = useRef<HTMLDivElement>(null)
  const [cx, setCx] = useState(0)
  const [W, setW] = useState(375)
  const [ready, setReady] = useState(false)

  function isActive(href: string): boolean {
    if (href === `/${locale}`) return pathname === `/${locale}`
    const viSlug = href.split("/")[2] ?? ""
    const localizedSlugs = Object.values(SLUG_MAP[viSlug] ?? {})
    return pathname.includes(`/${viSlug}`) || localizedSlugs.some((s) => pathname.includes(`/${s}`))
  }

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const width = nav.offsetWidth
    setW(width)
    const active = nav.querySelector<HTMLElement>("[data-active='true']")
    if (active) setCx(active.offsetLeft + active.offsetWidth / 2)
    setReady(true)
  }, [pathname])

  const path = ready ? buildPath(W, cx) : null

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <div ref={navRef} className="relative" style={{ height: BAR_H }}>
        {/* Bar SVG */}
        {path ? (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 w-full overflow-visible"
            height={BAR_H}
            viewBox={`0 0 ${W} ${BAR_H}`}
            preserveAspectRatio="none"
            style={{ filter: "drop-shadow(0 -6px 28px rgba(0,0,0,0.7))" }}
          >
            <path d={path} fill={BAR_COLOR} />
          </svg>
        ) : (
          <div className="absolute inset-0" style={{ background: BAR_COLOR }} />
        )}

        {/* Items */}
        <div className="relative flex h-full items-center justify-around">
          {MAIN_NAV_ITEMS.map((item) => {
            const href = item.getHref(routes)
            const active = isActive(href)
            const Icon = item.icon
            if (!Icon) return null

            return (
              <Link
                key={item.labelKey}
                href={href}
                data-active={active}
                className="group relative flex flex-1 flex-col items-center justify-center"
              >
                <div
                  className={cn(
                    "relative flex items-center justify-center transition-all duration-300 ease-out",
                    active ? "-translate-y-7" : "translate-y-0"
                  )}
                >
                  {/* Circle wrapper — only for active */}
                  {active && (
                    <div
                      className="absolute rounded-full"
                      style={{
                        background: BAR_COLOR,
                        boxShadow: [
                          "0 16px 32px -4px rgba(0,0,0,0.95)",   // deep shadow dưới → tạo depth
                          "0 6px 12px -2px rgba(0,0,0,0.8)",     // shadow gần hơn
                          "inset 0 1px 0 rgba(255,255,255,0.08)", // top highlight
                        ].join(", "),
                        width: CIRCLE_R * 2 + 4,
                        height: CIRCLE_R * 2 + 4,
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative z-10">
                    <Icon
                      className={cn(
                        "transition-all duration-300",
                        active
                          ? "text-gold size-[34px]"
                          : "size-[24px] text-white/35 group-hover:text-white/65"
                      )}
                      style={
                        active
                          ? {
                              filter: [
                                "drop-shadow(0 0 2px rgba(246,195,67,1))",
                                "drop-shadow(0 0 10px rgba(246,195,67,1))",
                                "drop-shadow(0 0 24px rgba(246,195,67,0.85))",
                                "drop-shadow(0 0 48px rgba(246,195,67,0.6))",
                                "drop-shadow(0 0 80px rgba(246,195,67,0.35))",
                              ].join(" "),
                            }
                          : undefined
                      }
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 flex size-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.9)]" />
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* iPhone safe area */}
      <div style={{ height: "env(safe-area-inset-bottom,0px)", background: BAR_COLOR }} />
    </nav>
  )
}
