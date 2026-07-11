"use server"

import { cookies } from "next/headers"

import { postRequest } from "@/server/services/request"
import { parseUserInfoCookie } from "@/lib/auth-cookie"

import type { UpdateProfilePayloadInterface } from "../profile.models"

export async function updateProfileServerAction(
  payload: UpdateProfilePayloadInterface
): Promise<{ success: boolean; message: string | null }> {
  const store = await cookies()
  const token = store.get("token")?.value
  const userInfo = parseUserInfoCookie(store.get("userInfo")?.value)

  if (!token || !userInfo) {
    return { success: false, message: "Chưa đăng nhập" }
  }

  const userId = userInfo.userId ?? userInfo.uid
  const res = await postRequest<{ success: boolean; message?: string }>(
    `/user/profile/${userId}`,
    payload
  )

  if (res?.success) {
    const updated = { ...userInfo, ...payload }
    store.set("userInfo", JSON.stringify(updated), { path: "/", sameSite: "lax" })
  }

  return { success: res?.success ?? false, message: res?.message ?? null }
}
