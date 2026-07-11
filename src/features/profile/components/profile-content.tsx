"use client"

import { useState } from "react"

import type { KimtvUser } from "@/lib/auth-cookie"

import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

import { useProfile } from "../hooks/use-profile"
import { PROFILE_SIDEBAR_ITEMS } from "../profile.constants"
import { ProfileSidebarTabEnum } from "../profile.enum"
import { ProfileInfoSection } from "./profile-info-section"
import { ProfilePreferences } from "./profile-preferences"
import { ProfileSecurity } from "./profile-security"
import { ProfileSidebar } from "./profile-sidebar"

interface ProfileContentLabels {
  loginPrompt: string
  loginButton: string
  nav: Record<string, string>
  info: {
    title: string
    editProfile: string
    phone: string
    email: string
    password: string
    change: string
    save: string
    cancel: string
    saving: string
    saveSuccess: string
    saveError: string
  }
  preferences: { title: string; addMore: string }
  security: {
    title: string
    phone: string
    password: string
    changeLink: string
    changePassword: string
  }
  emptyTab: string
}

interface ProfileContentProps {
  labels: ProfileContentLabels
}

function EmptyTabContent({ message }: { message: string }) {
  return (
    <div className="rounded-16 flex min-h-48 items-center justify-center border border-white/8 bg-[#0d1829]">
      <Typography variant="body-sm" className="text-text-muted">
        {message}
      </Typography>
    </div>
  )
}

export function ProfileContent({ labels }: ProfileContentProps) {
  const { user, isLoggedIn, isLoading, login } = useProfile()
  const [activeTab, setActiveTab] = useState<ProfileSidebarTabEnum>(ProfileSidebarTabEnum.PROFILE)

  if (isLoading) return null

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-4">
        <Typography variant="body" className="text-text-muted">
          {labels.loginPrompt}
        </Typography>
        <Button variant="gradient" onClick={login}>
          {labels.loginButton}
        </Button>
      </div>
    )
  }

  const sidebarLabels: Record<string, string> = Object.fromEntries(
    PROFILE_SIDEBAR_ITEMS.map((item) => [item.labelKey, labels.nav[item.labelKey] ?? item.key])
  )

  function renderTabContent() {
    switch (activeTab) {
      case ProfileSidebarTabEnum.PROFILE:
        return (
          <>
            <ProfileInfoSection user={user as KimtvUser} labels={labels.info} />
            <ProfilePreferences labels={labels.preferences} />
            <ProfileSecurity user={user as KimtvUser} labels={labels.security} />
          </>
        )
      default:
        return <EmptyTabContent message={labels.emptyTab} />
    }
  }

  return (
    <div className="grid grid-cols-[260px_1fr] items-start gap-5 max-lg:grid-cols-1">
      <ProfileSidebar
        user={user as KimtvUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        labels={sidebarLabels}
      />
      <div className="flex flex-col gap-5">{renderTabContent()}</div>
    </div>
  )
}
