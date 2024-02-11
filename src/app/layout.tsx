import type { Metadata } from "next"
import PlausibleProvider from "next-plausible"
import { JetBrains_Mono, Oleo_Script } from "next/font/google"
import "./globals.css"

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Elo",
  description: "Board Game elo system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="shmelo.io">
      <html lang="en" className="h-full">
        <body className={`${mono.variable} font-mono bg-bg dark:bg-black w-full h-full`}>
          {children}
        </body>
      </html>
    </PlausibleProvider>
  )
}
