import type { TranslationKey } from "@/i18n"
import type { Routes } from "@/config/routes"

interface NavItemInterface {
  labelKey: TranslationKey
  getHref: (r: Routes) => string
}

export type { NavItemInterface }
