"use client"

import Image from "next/image"

import type { KimtvUser } from "@/lib/auth-cookie"
import { cn } from "@/lib/utils"

import { PROFILE_SIDEBAR_ITEMS } from "../profile.constants"
import { ProfileSidebarTabEnum } from "../profile.enum"

interface ProfileSidebarProps {
  user: KimtvUser
  activeTab: ProfileSidebarTabEnum
  onTabChange: (tab: ProfileSidebarTabEnum) => void
  labels: Record<string, string>
}

export function ProfileSidebar({ user, activeTab, onTabChange, labels }: ProfileSidebarProps) {
  const displayName = user.name ?? "Thành viên"
  const avatarUrl = user.avatar ?? ""

  return (
    <aside className="panel-dark rounded-16 flex flex-col overflow-hidden">
      {/* Avatar + info */}
      <div className="flex flex-col items-center gap-3 px-6 py-8">
        <div className="relative">
          <div className="size-20 overflow-hidden rounded-full border-2 border-white/15">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                width={80}
                height={80}
                className="size-full object-cover"
              />
            ) : (
              <div className="from-blue/80 to-blue text-24 font-700 flex size-full items-center justify-center bg-gradient-to-br text-white uppercase">
                {displayName.charAt(0)}
              </div>
            )}
          </div>
          {/* Level badge */}
          <div className="bg-blue text-10 font-700 absolute -right-1 -bottom-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-white shadow-[0_2px_6px_rgba(67,97,253,0.6)]">
            S1
          </div>
        </div>

        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-16 font-600 text-white">{displayName}</span>
          <span className="text-12 text-text-muted">Thành viên tích cực</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/8" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3">
        {PROFILE_SIDEBAR_ITEMS.map(({ key, labelKey, icon: Icon }) => {
          const isActive = activeTab === key
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={cn(
                "rounded-8 flex w-full items-center gap-3 px-4 py-3 text-left transition-all",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn("size-4 shrink-0", isActive ? "text-gold" : "text-current")}
                strokeWidth={1.8}
              />
              <span className="text-14 font-500">{labels[labelKey] ?? key}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
