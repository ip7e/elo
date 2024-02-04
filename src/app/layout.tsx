import type { Metadata } from "next"
import PlausibleProvider from "next-plausible"
import { Oleo_Script, Roboto_Mono } from "next/font/google"
import "./globals.css"

const mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const display = Oleo_Script({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: "Elo",
  description: "Board Game elo system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="shmelo.io">
      <html lang="en">
        <body className={`${mono.variable} ${display.variable} font-mono bg-bg dark:bg-black`}>
          {children}
        </body>
      </html>
    </PlausibleProvider>
  )
}
