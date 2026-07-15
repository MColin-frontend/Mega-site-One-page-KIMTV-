import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Image from "next/image"

import { MouseGlowProvider } from "@/components/providers/mouse-glow-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

import bgStadium from "@assets/images/common/img-stadium-bg.png"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "KimTV",
  description: "Tỉ số bóng đá trực tuyến",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <div className="fixed inset-0 -z-10">
          <Image
            src={bgStadium}
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="bg-background/85 absolute inset-0" />
        </div>
        <QueryProvider>
          <MouseGlowProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </MouseGlowProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
