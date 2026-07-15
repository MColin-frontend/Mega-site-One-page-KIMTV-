import type { Metadata } from "next"

import { BroadcastCenterPage } from "@/features/broadcast/components"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Trung tâm phát trực tiếp",
}

export default function Page() {
  return <BroadcastCenterPage />
}
