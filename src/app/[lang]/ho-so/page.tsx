import type { Metadata } from "next"

import { ProfilePage } from "@/features/profile/components"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Hồ sơ cá nhân",
}

export default function Page() {
  return <ProfilePage />
}
