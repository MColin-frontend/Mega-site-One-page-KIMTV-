import { Suspense } from "react"
import Image from "next/image"

import { getTranslation } from "@/i18n/get-locale"

import bgStadium from "@assets/images/profile/bg-stadium.png"

import { ProfileContent } from "./profile-content"
import { ProfileContentSkeleton, ProfileSidebarSkeleton } from "./skeleton"

async function ProfileData() {
  const { t } = await getTranslation()

  const labels = {
    loginPrompt: t("profile.loginPrompt"),
    loginButton: t("profile.loginButton"),
    nav: {
      "profile.nav.profile": t("profile.nav.profile"),
      "profile.nav.myNews": t("profile.nav.myNews"),
      "profile.nav.favorites": t("profile.nav.favorites"),
      "profile.nav.following": t("profile.nav.following"),
      "profile.nav.settings": t("profile.nav.settings"),
    },
    info: {
      title: t("profile.info.title"),
      editProfile: t("profile.info.editProfile"),
      phone: t("profile.info.phone"),
      email: t("profile.info.email"),
      password: t("profile.info.password"),
      change: t("profile.info.change"),
      save: t("profile.info.save"),
      cancel: t("profile.info.cancel"),
      saving: t("profile.info.saving"),
      saveSuccess: t("profile.info.saveSuccess"),
      saveError: t("profile.info.saveError"),
    },
    preferences: {
      title: t("profile.preferences.title"),
      addMore: t("profile.preferences.addMore"),
    },
    security: {
      title: t("profile.security.title"),
      phone: t("profile.info.phone"),
      password: t("profile.info.password"),
      changeLink: t("profile.security.changeLink"),
      changePassword: t("profile.security.changePassword"),
    },
    emptyTab: t("profile.emptyTab"),
  }

  return <ProfileContent labels={labels} />
}

export async function ProfilePage() {
  return (
    <>
      {/* Full-viewport stadium bg — fixed, không bọc content */}
      <div className="fixed inset-0 -z-10">
        <Image
          src={bgStadium}
          alt=""
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="bg-background/85 absolute inset-0" />
      </div>

      <div className="container">
        <Suspense
          fallback={
            <div className="grid grid-cols-[260px_1fr] items-start gap-5 max-lg:grid-cols-1">
              <ProfileSidebarSkeleton />
              <ProfileContentSkeleton />
            </div>
          }
        >
          <ProfileData />
        </Suspense>
      </div>
    </>
  )
}
