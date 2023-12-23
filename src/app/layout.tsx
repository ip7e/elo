import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navigation from "./navigation"

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})
const inter = Inter({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Elo",
  description: "Board Game elo system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} ${inter.variable} font-sans bg-bg`}>
        <div className="container max-w-lg py-10 mx-auto">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
