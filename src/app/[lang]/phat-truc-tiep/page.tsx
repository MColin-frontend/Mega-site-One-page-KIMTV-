import type { Metadata } from "next"

import { BroadcastPage } from "@/features/broadcast/components"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Phát trực tiếp",
}

export default function Page() {
  return <BroadcastPage />
}
