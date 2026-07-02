import { notFound } from "next/navigation"

import { LOCALES, type LocaleType } from "@/i18n"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!LOCALES.includes(lang as LocaleType)) notFound()

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
