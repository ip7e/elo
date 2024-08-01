import type { Metadata } from "next"
import PlausibleProvider from "next-plausible"
import "./globals.css"

import { GeistMono } from "geist/font/mono"
import { Inter } from "next/font/google"

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" })

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
          className={`${GeistMono.variable} ${sans.variable} h-full w-full bg-bg font-sans dark:bg-black`}
        >
          {/* <MainNavigation /> */}

          {children}
        </body>
      </html>
    </PlausibleProvider>
  )
}
