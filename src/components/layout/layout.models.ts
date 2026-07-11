import type { StaticImport } from "next/dist/shared/lib/get-img-props"

import type { TranslationKey } from "@/i18n"
import type { Routes } from "@/config/routes"

interface NavI18nItemInterface {
  labelKey: TranslationKey
  getHref: (r: Routes) => string
}

interface FooterSocialInterface {
  name: string
  icon: StaticImport
  link: string
}

interface FooterMenuInterface {
  key: string
  getHref: (r: Routes) => string
}

export type { NavI18nItemInterface, FooterSocialInterface, FooterMenuInterface }
