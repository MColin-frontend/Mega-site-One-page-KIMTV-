import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { MouseGlowProvider } from "@/components/providers/mouse-glow-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

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
        <QueryProvider>
          <MouseGlowProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </MouseGlowProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
