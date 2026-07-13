import type { Metadata } from "next"

import { UserInfoPage } from "@/features/user-info/components"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Thông tin người dùng",
}

export default function Page() {
  return <UserInfoPage />
}
