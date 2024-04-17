import type { Metadata } from "next"
import PlausibleProvider from "next-plausible"
import "./globals.css"

import { GeistMono } from "geist/font/mono"
import MainNavigation from "./main-navigation"

const mono = GeistMono

export const metadata: Metadata = {
  title: "Elo",
  description: "Board Game elo system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="shmelo.io">
      <html lang="en" className="h-full">
        <body className={`${mono.variable} font-mono bg-bg dark:bg-black w-full h-full`}>
          <MainNavigation />

          {children}
        </body>
      </html>
    </PlausibleProvider>
  )
}
