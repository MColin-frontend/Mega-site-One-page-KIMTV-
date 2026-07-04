"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { exchangeIdTokenAction } from "@/server/actions/auth.action"
import { saveAuthCookies } from "@/lib/auth-cookie"
import { signinRedirectCallback } from "@/lib/oidc"

import { useTranslation } from "@/i18n"

export default function CallbackPage() {
  const router = useRouter()
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function handle() {
      try {
        const user = await signinRedirectCallback()
        const idToken = user?.id_token
        if (!idToken) throw new Error("Missing id_token")

        const promotionChannelId = localStorage.getItem("promotionChannelId") ?? ""
        const res = await exchangeIdTokenAction(idToken, promotionChannelId)

        if (res.status === "success") {
          saveAuthCookies(res.result.token, res.result.user)
          if (res.result.newUser) sessionStorage.setItem("kim99_new_user", "1")
        }

        router.replace("/")
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        if (msg.includes("No matching state found in storage")) {
          router.replace("/")
          return
        }
        setFailed(true)
        setTimeout(() => router.replace("/"), 2000)
      }
    }

    handle()
  }, [router])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-white">
      <p className="text-14 text-white/60">
        {failed ? t("header.auth.callback.error") : t("header.auth.callback.processing")}
      </p>
    </div>
  )
}
