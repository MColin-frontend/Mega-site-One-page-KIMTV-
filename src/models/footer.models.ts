import type { StaticImport } from "next/dist/shared/lib/get-img-props"

import type { Routes } from "@/config/routes"

interface FooterSocialInterface {
  name: string
  icon: StaticImport
  link: string
}

interface FooterMenuInterface {
  key: string
  getHref: (r: Routes) => string
}

export type { FooterSocialInterface, FooterMenuInterface }
