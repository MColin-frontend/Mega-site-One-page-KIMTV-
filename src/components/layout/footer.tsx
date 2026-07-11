"use client"

import Link from "next/link"

import { useTranslation } from "@/i18n"
import { getRoutes } from "@/config/routes"
import { FOOTER_MENUS, FOOTER_SOCIALS } from "@/constants/component/layout.constants"

import type { FooterMenuInterface, FooterSocialInterface } from "@/components/layout/layout.models"
import { Img } from "@/components/ui/image"
import { Typography } from "@/components/ui/typography"

import kimtvLogo from "@assets/icons/layout/ic-kimtv.svg"

export function Footer() {
  const { t, locale } = useTranslation()
  const routes = getRoutes(locale)

  return (
    <footer className="border-line w-full border-t pt-8 pb-14">
      <div className="container">
        <div className="border-line flex items-center justify-between gap-4 border-b pb-10 max-lg:flex-col max-lg:pb-7 max-md:pb-5">
          <div className="max-w-[400px] max-lg:flex max-lg:w-full max-lg:max-w-full max-lg:flex-col max-lg:items-center">
            <Img src={kimtvLogo} alt="KimTV" width={130} height={48} objectFit="contain" priority />

            <Typography
              variant="body-sm"
              weight="300"
              className="mt-7 leading-100 text-white max-lg:mt-6 max-md:mt-4 max-md:text-center"
            >
              {t("footer.desc")}
            </Typography>

            <div className="mt-7 flex items-center gap-6 max-lg:mt-6 max-lg:gap-5 max-md:mt-4 max-md:justify-center max-md:gap-4">
              {FOOTER_SOCIALS.map((social: FooterSocialInterface) => (
                <Link
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="social-btn flex h-8 w-8 items-center justify-center rounded-full"
                >
                  <Img
                    src={social.icon}
                    alt={social.name}
                    width={14}
                    height={14}
                    className="hover:animation-duration-[0.6s] animate-[scaleBreath_2s_ease-in-out_infinite]"
                  />
                </Link>
              ))}
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-9 max-lg:gap-6 max-md:gap-3">
            {FOOTER_MENUS.map((menu: FooterMenuInterface) => (
              <Link key={menu.key} href={menu.getHref(routes)} className="footer-menu-link">
                <Typography
                  variant="label"
                  className="hover:text-gold text-white uppercase transition-colors"
                >
                  {t(`footer.menu.${menu.key}` as Parameters<typeof t>[0])}
                </Typography>
              </Link>
            ))}
          </nav>
        </div>

        <Typography
          variant="body-sm"
          weight="300"
          className="pt-8 text-center text-white max-lg:pt-6 max-md:pt-4"
        >
          {t("footer.copyright")}
        </Typography>
      </div>
    </footer>
  )
}
