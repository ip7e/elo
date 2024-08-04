import type { Metadata } from "next"
import PlausibleProvider from "next-plausible"
import "./globals.css"

import { GeistMono } from "geist/font/mono"
import { Inter } from "next/font/google"
import { cn } from "@/utils/tailwind/cn"

const sans = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shmelo.io",
  description: "Ranking system for board games",
  icons: [
    {
      rel: "icon",
      type: "image/svg",
      url: "/favicon.svg",
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="shmelo.io">
      <html lang="en" className="h-full">
        <body
          className={cn(
            `bg-background h-full w-full font-sans dark:bg-black`,
            GeistMono.className,
            sans.className,
          )}
        >
          {/* <MainNavigation /> */}

          {children}
        </body>
      </html>
    </PlausibleProvider>
  )
}
